using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TrifoliaFhir.Models;
using Hl7.Fhir.Rest;
using Hl7.Fhir.Model;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace TrifoliaFhir.Controllers
{
    [Authorize]
    [Route("api/person")]
    public class PersonController : Controller
    {
        private ServerConfig config;
        FhirClient fhirClient;

        public PersonController(IOptions<ServerConfig> optionsAccessor)
        {
            this.config = optionsAccessor.Value;
            this.fhirClient = new FhirClient(this.config.FhirBase);
        }

        [HttpGet, Route("me")]
        public Person GetMe(bool shouldCreate = false)
        {
            return PersonExtension.GetMe(this.fhirClient, this.User.Identity, shouldCreate);
        }

        [HttpPut, Route("me")]
        public void SaveMe([FromBody] Person person)
        {
            Person current = PersonExtension.GetMe(this.fhirClient, this.User.Identity);

            if (person.Id != current.Id)
                throw new Exception("You are attempting to save a person that is not associated with your user");

            this.fhirClient.Update<Person>(person, true);
        }
        
        [HttpGet]
        public IEnumerable<PersonListModel> GetPeople()
        {
            var results = this.fhirClient.Search<Person>(new SearchParams()
            {
            });

            return results.Entry.Select(y => ((Person)y.Resource)).Select(y => new PersonListModel()
            {
                Id = y.Id,
                Name = y.Name.FirstOrDefault(),
                Email = y.Telecom.FirstOrDefault(x => x.System == ContactPoint.ContactPointSystem.Email),
                Organization = y.ManagingOrganization
            });
        }
    }
}
