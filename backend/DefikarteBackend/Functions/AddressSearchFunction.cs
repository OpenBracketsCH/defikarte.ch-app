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

public class AddressSearchFunction
{
    private readonly IAddressSearchService _addressSearchService;
    private readonly ILogger<AddressSearchFunction> _logger;

    public AddressSearchFunction(IAddressSearchService addressSearchService, ILogger<AddressSearchFunction> logger)
    {
        _addressSearchService = addressSearchService;
        _logger = logger;
    }

    [Function("AddressSearch_V2")]
    [OpenApiOperation(operationId: "ADDRESS_SEARCH_V2", tags: ["AddressSearch-V2"], Summary = "Search for addresses")]
    [OpenApiParameter(name: "searchText", In = ParameterLocation.Path, Required = true, Type = typeof(string), Summary = "Search string to search for.")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(FeatureCollection), Description = "The OK response")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.NotFound, contentType: "application/json", bodyType: typeof(Dictionary<string, string>), Description = "The NotFound response.")]
    public async Task<IActionResult> SearchAddressAsync([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v2/search/{searchText}")] HttpRequest req, string searchText)
    {
        try
        {
            if (string.IsNullOrEmpty(searchText))
            {
                return new BadRequestObjectResult(new { Error = "searchText is null or empty" });
            }

            var result = await _addressSearchService.SearchAddressAsync(searchText).ConfigureAwait(false);
            return new OkObjectResult(result);
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