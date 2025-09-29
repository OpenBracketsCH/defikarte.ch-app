using DefikarteBackend.Interfaces;
using DefikarteBackend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System.Net;

namespace DefikarteBackend.Functions;

public class AddressSearchControllerV3
{
    private readonly IAddressSearchService _addressSearchService;
    private readonly ILogger<AddressSearchControllerV3> _logger;

    public AddressSearchControllerV3(IAddressSearchService addressSearchService, ILogger<AddressSearchControllerV3> logger)
    {
        _addressSearchService = addressSearchService;
        _logger = logger;
    }

    [Function("ADDRESS_SEARCH_V3")]
    [OpenApiOperation(operationId: "ADDRESS_SEARCH_V3", tags: ["ADDRESS_SEARCH_V3"], Summary = "Search for addresses")]
    [OpenApiParameter(name: "searchText", In = ParameterLocation.Path, Required = true, Type = typeof(string), Summary = "Search string to search for.")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/geo+json", bodyType: typeof(FeatureCollection), Description = "The OK response")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.NotFound, contentType: "application/json", bodyType: typeof(Dictionary<string, string>), Description = "The NotFound response.")]
    public async Task<IActionResult> SearchAddressAsync([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v3/search/{searchText}")] HttpRequest req, string searchText)
    {
        try
        {
            if (string.IsNullOrEmpty(searchText))
            {
                return new NotFoundObjectResult(new { Error = "searchText is null or empty" });
            }

            var result = await _addressSearchService.SearchAddressAsync(searchText).ConfigureAwait(false);
            return new GeoJsonContentResult(result ?? new FeatureCollection());
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
}