using Hl7.Fhir.Rest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using TrifoliaFhir;

namespace Hl7.Fhir.Model
{
    public static class PersonExtension
    {
        public static Person GetMe(FhirClient fhirClient, IIdentity identity, bool shouldCreate = false)
        {
            string userId = identity.Name;
            userId = userId.StartsWith("auth0|") ? userId.Substring(6) : userId;
            var results = fhirClient.Search<Person>(new string[] { "identifier=" + FhirTokenHelper.GetToken(userId, Constants.Auth0SystemUrl) });

            if (results.Total > 1)
                throw new Exception("Found more than one Person with the same identifier");

            Person person = results.Total == 1 ? (Person)results.Entry[0].Resource : null;

            if (person == null && shouldCreate)
            {
                person = new Person();
                HumanName name = new HumanName();
                person.Name.Add(name);

                person.Identifier.Add(new Identifier()
                {
                    System = Constants.Auth0SystemUrl,
                    Value = userId
                });

                if (identity.Name.Split(' ').Length > 1)
                {
                    List<string> given = new List<string>();
                    given.Add(identity.Name.Split(' ')[0]);
                    name.Family = identity.Name.Split(' ')[1];
                }
                else
                {
                    name.Family = identity.Name;
                }

                if (identity.Name.Contains("@"))
                {
                    person.Telecom.Add(new ContactPoint()
                    {
                        System = ContactPoint.ContactPointSystem.Email,
                        Value = identity.Name
                    });
                }

                fhirClient.Create<Person>(person);
            }

            return person;
        }
    }
}
