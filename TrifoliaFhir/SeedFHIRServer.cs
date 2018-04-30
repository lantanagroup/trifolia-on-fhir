using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace TrifoliaFhir
{
    public class SeedFHIRServer
    {
        FhirClient fhirClient;

        private SeedFHIRServer(string fhirBase)
        {
            this.fhirClient = new FhirClient(fhirBase);
        }

        public static Task Seed(string fhirBase)
        {
            SeedFHIRServer seedFHIRServer = new SeedFHIRServer(fhirBase);
            return seedFHIRServer.Seed();
        }

        public Task Seed()
        {
            return Task.Factory.StartNew(() =>
            {
                this.LoadCodeSystems();
            });
        }

        private void LoadCodeSystems()
        {
            var auth0Bundle = this.fhirClient.Search<CodeSystem>(new string[] { "url:exact=" + Constants.Auth0SystemUrl });

            if (auth0Bundle.Total == 0)
            {
                this.fhirClient.Create<CodeSystem>(new CodeSystem()
                {
                    Url = Constants.Auth0SystemUrl,
                    Name = Constants.Auth0Name
                });
            }
        }
    }
}
