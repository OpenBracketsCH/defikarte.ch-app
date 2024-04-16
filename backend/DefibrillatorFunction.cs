using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using DefikarteBackend.Cache;
using DefikarteBackend.Configuration;
using DefikarteBackend.Model;
using DefikarteBackend.OsmOverpassApi;
using DefikarteBackend.Validation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using OsmSharp;
using OsmSharp.IO.API;
using OsmSharp.Tags;

namespace DefikarteBackend
{
    public class DefibrillatorFunction
    {
        private readonly ServiceConfiguration _config;
        private readonly ICacheRepository<OsmNode> _cacheRepository;

        public DefibrillatorFunction(ServiceConfiguration config, ICacheRepository<OsmNode> cacheRepository)
        {
            _config = config;
            _cacheRepository = cacheRepository;
        }

        [FunctionName("Defibrillators_GETALL")]
        [OpenApiOperation(operationId: "GetDefibrillators_V1", tags: new[] { "Defibrillator-V1" }, Summary = "Get all defibrillators from switzerland as custom json.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(List<OsmNode>), Description = "The OK response")]
        public async Task<IActionResult> GetAll(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "defibrillator")] HttpRequestMessage req,
            ILogger log)
        {
            try
            {
                if (TryParseIdQuery(req.RequestUri.ParseQueryString(), out var id))
                {
                    var byIdResponse = await _cacheRepository.GetByIdAsync(id);
                    return new OkObjectResult(byIdResponse);
                }

                var response = await _cacheRepository.GetAsync();
                if (response != null && response.Count > 0)
                {
                    log.LogInformation($"Get all AED from cache. Count: {response.Count}");
                    return new OkObjectResult(response);
                }

                var overpassApiUrl = _config.OverpassApiUrl;
                log.LogInformation($"Get all AED from {overpassApiUrl}. Cache is not available.");

                var overpassApiClient = new OverpassClient(overpassApiUrl);
                var overpassResponse = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                return new OkObjectResult(overpassResponse);
            }
            catch (Exception ex)
            {
                return new ExceptionResult(ex, false);
            }
        }


        [FunctionName("Defibrillators_POST")]
        [OpenApiOperation(operationId: "CreateDefibrillator_V1", tags: new[] { "Defibrillator-V1" }, Summary = "Create a new defibrillator. [Soon deprecated, use V2]")]
        [OpenApiRequestBody("application/json", typeof(DefibrillatorRequest))]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.Created, contentType: "application/json", bodyType: typeof(DefibrillatorResponse), Description = "The OK response")]
        [OpenApiSecurity("Defikarte.ch API-Key", SecuritySchemeType.ApiKey, In = OpenApiSecurityLocationType.Header, Name = "x-functions-key")]
        public async Task<IActionResult> Create(
            [HttpTrigger(AuthorizationLevel.Function, "Post", Route = "defibrillator")] HttpRequest req,
            ILogger log)
        {
            try
            {
                var username = _config.OsmUserName;
                var password = _config.OsmUserPassword;
                var osmApiUrl = _config.OsmApiUrl;

                if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(osmApiUrl))
                {
                    log.LogWarning("No valid configuration available for eighter username, password or osmApiUrl");
                    return new InternalServerErrorResult();
                }

                var defibrillatorObj = await req.GetJsonBodyAsync<DefibrillatorRequest, DefibrillatorRequestValidator>();

                if (!defibrillatorObj.IsValid)
                {
                    log.LogInformation($"Invalid request data.");
                    return defibrillatorObj.ToBadRequest();
                }

                var newNode = CreateNode(defibrillatorObj.Value);
                var clientFactory = new ClientsFactory(log, new HttpClient(), osmApiUrl);

                var authClient = clientFactory.CreateBasicAuthClient(username, password);
                var changeSetTags = new TagsCollection() { new Tag("created_by", username), new Tag("comment", "Create new AED.") };
                var changeSetId = await authClient.CreateChangeset(changeSetTags);

                newNode.ChangeSetId = changeSetId;
                var nodeId = await authClient.CreateElement(changeSetId, newNode);

                await authClient.CloseChangeset(changeSetId);

                var createdNode = await authClient.GetNode(nodeId);

                log.LogInformation($"Added new node {nodeId}");
                return new OkObjectResult(createdNode) { StatusCode = 201 };
            }
            catch (JsonSerializationException ex)
            {
                log.LogError(ex.ToString());
                return new BadRequestObjectResult(ex.Message);
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
                return new ExceptionResult(ex, false);
            }
        }

        private static bool TryParseIdQuery(NameValueCollection query, out string id)
        {
            id = string.Empty;
            try
            {
                var idValues = query.GetValues("id");
                bool available = idValues != null && idValues.Length > 0;
                id = idValues != null && idValues.Length > 0 ? idValues[0] : string.Empty;
                return available;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private static Node CreateNode(DefibrillatorRequest request)
        {
            var tags = new Dictionary<string, string>
            {
                {
                    "emergency", "defibrillator"
                },
                {
                    "emergency:phone", request.EmergencyPhone
                },
                {
                    "defibrillator:location", request.Location
                },
                {
                    "opening_hours", request.OpeningHours
                },
                {
                    "phone", request.OperatorPhone
                },
                {
                    "operator", request.Operator
                },
                {
                    "access", request.Access ? "yes" : "no"
                },
                {
                    "indoor", request.Indoor ? "yes" : "no"
                },
                {
                    "description", request.Description
                },
                {
                    "level", request.Level
                },
                {
                    "source", request.Source
                },
            };

            var keysToRemove = new List<string>();
            // remove empty values
            foreach (var keyval in tags)
            {
                if (string.IsNullOrEmpty(keyval.Value))
                {
                    keysToRemove.Add(keyval.Key);
                }
            }

            keysToRemove.ForEach(r => tags.Remove(r));

            return new Node()
            {
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                Tags = new TagsCollection(tags),
            };
        }
    }
}
