using DefikarteBackend.Helpers;
using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using DefikarteBackend.OsmOverpassApi;
using DefikarteBackend.Validation;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using OsmSharp;
using OsmSharp.IO.API;
using OsmSharp.Tags;
using System.Net;

namespace DefikarteBackend.Functions
{
    public class DefibrillatorFunctionV2
    {
        private static readonly HttpClient _httpClient = new();

        private readonly IServiceConfiguration _config;
        private readonly IUpdateGeoJsonCacheService _updateGeoJsonCacheService;
        private readonly IGeoJsonCacheRepository _cacheRepository;
        private readonly IGeofenceService _localisationService;
        private readonly ILogger<DefibrillatorFunctionV2> _logger;

        public DefibrillatorFunctionV2(
            IServiceConfiguration config,
            IEnumerable<IGeoJsonCacheRepository> cacheRepositories,
            IUpdateGeoJsonCacheService updateGeoJsonCacheService,
            IGeofenceService localisationService,
            ILogger<DefibrillatorFunctionV2> logger)
        {
            _config = config;
            _logger = logger;
            _updateGeoJsonCacheService = updateGeoJsonCacheService;
            _localisationService = localisationService;
            _cacheRepository = cacheRepositories.First(x => x.DataSourceType == DataSourceType.Osm);
        }

        [Function("Defibrillators_GETALL_V2")]
        [OpenApiOperation(operationId: "GetDefibrillators_V2", tags: ["Defibrillator-V2"], Summary = "Get all or resourceId based defibrillators from switzerland as geojson.")]
        [OpenApiParameter(name: "id?", In = ParameterLocation.Path, Required = false, Type = typeof(string), Summary = "Id of the defibrillator which should be returned.")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(FeatureCollection), Description = "The OK response")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.NotFound, contentType: "application/json", bodyType: typeof(Dictionary<string, string>), Description = "The NotFound response.")]
        public async Task<IActionResult> GetAll(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v2/defibrillator/{id?}")] HttpRequest req,
            string? id)
        {
            try
            {
                if (!string.IsNullOrEmpty(id))
                {
                    var byIdResponse = await _cacheRepository.GetByIdAsync(id);
                    return byIdResponse != null
                        ? new OkObjectResult(byIdResponse)
                        : new ObjectResult(new { Error = $"AED with Id: {id} not found." }) { StatusCode = StatusCodes.Status404NotFound };
                }

                var response = await _cacheRepository.GetAsync().ConfigureAwait(false);
                if (response != null && response.Features.Count > 0)
                {
                    _logger.LogInformation($"Get all AED from cache. Count: {response.Features.Count}");
                    return new OkObjectResult(response);
                }

                var overpassApiUrl = _config.OverpassApiUrl;
                _logger.LogWarning($"Get all AED from {overpassApiUrl}. Cache is not available.");

                var overpassApiClient = new OverpassClient(overpassApiUrl);
                var overpassResponse = await overpassApiClient.GetAllDefibrillatorsInSwitzerland();
                var geojsonResponse = GeoJsonConverter.Convert2GeoJson(overpassResponse);
                return new OkObjectResult(geojsonResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return new ObjectResult(new { Error = ex.Message })
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                };
            }
        }


        [Function("Defibrillators_POST_V2")]
        [OpenApiOperation(operationId: "CreateDefibrillator_V2", tags: ["Defibrillator-V2"], Summary = "Create a new defibrillator.")]
        [OpenApiRequestBody("application/json", typeof(DefibrillatorRequestV2))]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.Created, contentType: "application/json", bodyType: typeof(FeatureCollection), Description = "The OK response")]
        [OpenApiSecurity("api-key", SecuritySchemeType.ApiKey, In = OpenApiSecurityLocationType.Header, Name = "x-functions-key")]
        public async Task<IActionResult> Create(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v2/defibrillator")] HttpRequest req)
        {
            try
            {
                var username = _config.OsmUserName;
                var osmApiToken = _config.OsmApiToken;
                var osmApiUrl = _config.OsmApiUrl;

                if (string.IsNullOrEmpty(osmApiToken) || string.IsNullOrEmpty(osmApiUrl))
                {
                    _logger.LogWarning("No valid configuration available for eighter username, token or osmApiUrl");
                    return new ObjectResult(new { Error = "Configuration error. Contact API-Admins." })
                    {
                        StatusCode = StatusCodes.Status500InternalServerError,
                    };
                }

                var validationResult = await req.GetValidatedRequestAsync<DefibrillatorRequestV2, DefibrillatorRequestValidatorV2>();
                if (validationResult == null || validationResult.IsValid == false)
                {
                    _logger.LogInformation($"Invalid request data.");
                    return validationResult?.ToBadRequest() ?? new BadRequestObjectResult(new { Error = "Request cannot be parsed. Body is not a valid JSON or null." });
                }

                var body = validationResult.Value;
                var isInSwitzerland = await _localisationService.IsSwitzerlandAsync(body.Latitude, body.Longitude).ConfigureAwait(false);
                var newNode = CreateNode(body, isInSwitzerland);
                var clientFactory = new ClientsFactory(_logger, _httpClient, osmApiUrl);

                var osmClient = clientFactory.CreateOAuth2Client(osmApiToken);
                var changeSetTags = new TagsCollection() { new Tag("created_by", username), new Tag("comment", "Create new AED.") };
                var changeSetId = await osmClient.CreateChangeset(changeSetTags);

                newNode.ChangeSetId = changeSetId;
                var nodeId = await osmClient.CreateElement(changeSetId, newNode);

                await osmClient.CloseChangeset(changeSetId);

                var createdNode = await osmClient.GetNode(nodeId);

                _logger.LogInformation($"Added new node {nodeId}, isInSwitzerland:{isInSwitzerland}");

                var geoJsonResponse = GeoJsonConverter.Convert2GeoJson(createdNode);
                await _updateGeoJsonCacheService.AddOrUpdateFeaturesInLocalCacheAsync(geoJsonResponse).ConfigureAwait(false);

                return new ObjectResult(geoJsonResponse) { StatusCode = StatusCodes.Status201Created };
            }
            catch (JsonSerializationException ex)
            {
                _logger.LogError(ex.ToString());
                return new BadRequestObjectResult(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return new ObjectResult(new { Error = ex.Message }) { StatusCode = StatusCodes.Status500InternalServerError };
            }
        }

        [Function("Defibrillators_PUT_V2")]
        [OpenApiOperation(operationId: "UdpateDefibrillator_V2", tags: ["Defibrillator-V2"], Summary = "Update a defibrillator.")]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(long), Summary = "Id of the defibrillator which should be updated.")]
        [OpenApiRequestBody("application/json", typeof(DefibrillatorRequestV2))]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(FeatureCollection), Description = "The OK response")]
        [OpenApiSecurity("api-key", SecuritySchemeType.ApiKey, In = OpenApiSecurityLocationType.Header, Name = "x-functions-key")]
        public async Task<IActionResult> Update(
          [HttpTrigger(AuthorizationLevel.Function, "put", Route = "v2/defibrillator/{id}")] HttpRequest req, long id)
        {
            try
            {
                var username = _config.OsmUserName;
                var osmApiToken = _config.OsmApiToken;
                var osmApiUrl = _config.OsmApiUrl;

                if (string.IsNullOrEmpty(osmApiToken) || string.IsNullOrEmpty(osmApiUrl))
                {
                    _logger.LogWarning("No valid configuration available for eighter username, token or osmApiUrl");
                    return new ObjectResult(new { Error = "Configuration error. Contact API-Admins." })
                    {
                        StatusCode = StatusCodes.Status500InternalServerError,
                    };
                }

                var validationResult = await req.GetValidatedRequestAsync<DefibrillatorRequestV2, DefibrillatorRequestValidatorV2>();
                if (validationResult == null || validationResult.IsValid == false)
                {
                    _logger.LogInformation($"Invalid request data.");
                    return validationResult?.ToBadRequest() ?? new BadRequestObjectResult(new { Error = "Request cannot be parsed. Body is not a valid JSON or null." });
                }

                var body = validationResult.Value;
                var isInSwitzerland = await _localisationService.IsSwitzerlandAsync(body.Latitude, body.Longitude).ConfigureAwait(false);

                var clientFactory = new ClientsFactory(_logger, _httpClient, osmApiUrl);
                var osmClient = clientFactory.CreateOAuth2Client(osmApiToken);
                var currentNode = await osmClient.GetNode(id);
                var node = CreateNode(body, isInSwitzerland);
                node.Id = id;
                node.Version = currentNode.Version;

                var changeSetTags = new TagsCollection() { new Tag("created_by", username), new Tag("comment", "Update AED.") };
                var changeSetId = await osmClient.CreateChangeset(changeSetTags);

                node.ChangeSetId = changeSetId;
                await osmClient.UpdateElement(changeSetId, (OsmGeo)node);
                await osmClient.CloseChangeset(changeSetId);

                var updatedNode = await osmClient.GetNode(id);
                _logger.LogInformation($"Updated node {id}, isInSwitzerland:{isInSwitzerland}");
                var geoJsonResponse = GeoJsonConverter.Convert2GeoJson(updatedNode);
                await _updateGeoJsonCacheService.AddOrUpdateFeaturesInLocalCacheAsync(geoJsonResponse).ConfigureAwait(false);

                return new OkObjectResult(geoJsonResponse);
            }
            catch (JsonSerializationException ex)
            {
                _logger.LogError(ex.ToString());
                return new BadRequestObjectResult(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                return new ObjectResult(new { Error = ex.Message }) { StatusCode = StatusCodes.Status500InternalServerError };
            }
        }

        private Node CreateNode(DefibrillatorRequestV2 request, bool isInSwitzerland)
        {
            var emergencyPhone = isInSwitzerland
                ? "144"
                : string.Empty;

            var tags = new Dictionary<string, string?>
            {
                {
                    "emergency", "defibrillator"
                },
                {
                    "emergency:phone",  emergencyPhone
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
                    // Ensure no values are not set anymore, i.e. by older versions of the app
                    "access", request.Access == "no" ? null : request.Access
                },
                {
                    "indoor", request.Indoor
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

            var cleanTags = tags
                .Where(x => !string.IsNullOrEmpty(x.Value?.Trim()))
                .Select(x => new KeyValuePair<string, string?>(x.Key, x.Value?.Trim()))
                .ToDictionary(x => x.Key, x => x.Value);

            return new Node()
            {
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                Tags = new TagsCollection(cleanTags),
            };
        }
    }
}
