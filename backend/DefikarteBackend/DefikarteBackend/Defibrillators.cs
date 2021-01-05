using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace DefikarteBackend
{
    public class Defibrillators
    {
        [FunctionName("Defibrillators_GET")]
        public async Task<IActionResult> GetById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "defibrillator/{id}")] HttpRequestMessage req,
            int id,
            ILogger log)
        {

            log.LogInformation($"Get defibrillator::osmid:{id}");            
            return new OkObjectResult("in development");
        }

        [FunctionName("Defibrillators_GETALL")]
        public async Task<IActionResult> GetAll(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "defibrillator")] HttpRequestMessage req,
            ILogger log)
        {
            return new OkObjectResult("in development");
        }
    }
}
