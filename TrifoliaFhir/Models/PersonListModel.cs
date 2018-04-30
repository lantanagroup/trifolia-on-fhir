using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrifoliaFhir.Models
{
    public class PersonListModel
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public Hl7.Fhir.Model.HumanName Name { get; set; }

        [JsonProperty("email")]
        public Hl7.Fhir.Model.ContactPoint Email { get; set; }

        [JsonProperty("organization")]
        public Hl7.Fhir.Model.ResourceReference Organization { get; set; }
    }
}
