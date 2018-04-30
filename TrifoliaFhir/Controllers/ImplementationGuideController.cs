using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrifoliaFhir.Models;

namespace TrifoliaFhir.Controllers
{
    [Route("api/implementationguide")]
    public class ImplementationGuideController : Controller
    {
        private ServerConfig config;

        public ImplementationGuideController(IOptions<ServerConfig> optionsAccessor)
        {
            this.config = optionsAccessor.Value;
        }

        [HttpGet]
        public IEnumerable<ImplementationGuideListModel> Search(string query = null)
        {
            FhirClient client = new FhirClient(this.config.FhirBase);
            var results = client.Search<ImplementationGuide>(new SearchParams()
            {
            });

            return results.Entry.Select(y => ((ImplementationGuide)y.Resource)).Select(y => new ImplementationGuideListModel()
            {
                Id = y.Id,
                Name = y.Name,
                Type = "FHIR STU3"
            });
        }

        [HttpGet, Route("{id}")]
        public StructureDefinition Get(string id)
        {

        }
    }
}
