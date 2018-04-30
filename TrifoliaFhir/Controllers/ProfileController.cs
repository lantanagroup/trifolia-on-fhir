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
    [Route("api/profile")]
    public class ProfileController : Controller
    {
        private ServerConfig config;

        public ProfileController(IOptions<ServerConfig> optionsAccessor)
        {
            this.config = optionsAccessor.Value;
        }

        [HttpGet]
        public IEnumerable<ProfileListModel> Get(string query = null, int count = 10, int page = 1)
        {
            int pageOffset = ((page - 1) * count);
            FhirClient client = new FhirClient(this.config.FhirBase);
            var results = client.Search<StructureDefinition>(new string[] { "_count=" + count, "_getpagesoffset=" + pageOffset });

            return results.Entry.Select(y => ((StructureDefinition)y.Resource)).Select(y => new ProfileListModel()
            {
                Id = y.Id,
                Name = y.Name,
                Identifier = y.Url,
                Description = y.Description != null ? y.Description.ToString() : null,
                Experimental = y.Experimental
            });
        }
    }
}
