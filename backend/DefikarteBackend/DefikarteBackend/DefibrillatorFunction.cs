using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using DefikarteBackend.Cache;
using DefikarteBackend.Model;
using DefikarteBackend.OsmOverpassApi;
using DefikarteBackend.Validation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OsmSharp;
using OsmSharp.IO.API;
using OsmSharp.Tags;

namespace DefikarteBackend
{
    public class DefibrillatorFunction
    {
        private readonly IConfigurationRoot config;

        public DefibrillatorFunction(IConfigurationRoot config)
        {
            this.config = config;
        }

        [FunctionName("Defibrillators_GETALL")]
        public async Task<IActionResult> GetAll(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "defibrillator")] HttpRequestMessage req,
            [DurableClient(TaskHub = "%BackendTaskHub%")] IDurableEntityClient client,
            ILogger log)
        {
            try
            {
                EntityStateResponse<SimpleCache> stateResponse = await client.ReadEntityStateAsync<SimpleCache>(new EntityId(nameof(SimpleCache), "cache"));
                log.LogInformation($"Request AEDs. Try to get from Cache:{stateResponse.EntityState?.CacheId} LastUpdated:{stateResponse.EntityState?.LastUpdate}.");
                var response = stateResponse.EntityExists ? await stateResponse.EntityState.TryGetLegalCache() : null;
                if (response == null)
                {
                    var overpassApiUrl = config["overpassUrl"];
                    log.LogInformation($"Get all AED from {overpassApiUrl}. Cache:{stateResponse.EntityState?.CacheId} is not available (LastUpdated:{stateResponse.EntityState?.LastUpdate}).");

                    var overpassApiClient = new OverpassClient(overpassApiUrl);
                    response = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                }

                return new OkObjectResult(response);
            }
            catch (Exception ex)
            {
                return new ExceptionResult(ex, false);
            }
        }


        [FunctionName("Defibrillators_POST")]
        public async Task<IActionResult> Create(
            [HttpTrigger(AuthorizationLevel.Function, "Post", Route = "defibrillator")] HttpRequest req,
            ILogger log)
        {
            try
            {
                var username = config["osmUsername"];
                var password = config["osmUserPassword"];
                var osmApiUrl = config["osmApiUrl"];

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

        private Node CreateNode(DefibrillatorRequest request)
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
                }
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
