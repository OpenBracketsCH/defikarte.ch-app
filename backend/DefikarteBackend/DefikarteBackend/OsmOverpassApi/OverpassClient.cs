using DefikarteBackend.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace DefikarteBackend.OsmOverpassApi
{
    public class OverpassClient
    {
        private readonly HttpClient _overpassHttpClient;

        public OverpassClient(string overpassUrl)
        {
            _overpassHttpClient = new HttpClient
            {
                BaseAddress = new Uri(overpassUrl, UriKind.Absolute),
            };
        }

        public async Task<IList<OsmNode>> GetAllDefibrillatorsInSwitzerland()
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                Content = new StringContent(
                    "[out:json][timeout:25]; " +
                    "(area[\"ISO3166-1\" = \"CH\"][admin_level = 2]; area[\"ISO3166-1\" = \"LI\"][admin_level = 2];)->.searchArea;" +
                    "(node[\"emergency\" = \"defibrillator\"](area.searchArea);" +
                    "way[\"emergency\" = \"defibrillator\"](area.searchArea);" +
                    "relation[\"emergency\" = \"defibrillator\"](area.searchArea);" +
                    ");" +
                    "out body;>;out skel qt;"
                    ),
            };

            try
            {
                var response = await _overpassHttpClient.SendAsync(request, HttpCompletionOption.ResponseContentRead);
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var json = JObject.Parse(responseContent);
                    json.TryGetValue("elements", out var osmNodes);
                    var jArray = osmNodes as JArray;
                    return jArray.Select(x => JsonConvert.DeserializeObject<OsmNode>(x.ToString())).ToList();
                }
                else
                {
                    throw new Exception($"OverpassAPI ({this._overpassHttpClient.BaseAddress}) request was not successful. Could not get defibrillators.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }
    }
}
