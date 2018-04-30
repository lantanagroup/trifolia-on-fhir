using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrifoliaFhir
{
    public static class FhirTokenHelper
    {
        public static string GetToken(string value, string system = null)
        {
            if (!string.IsNullOrEmpty(system))
                return string.Format("{0}|{1}", system, value);

            return value;
        }
    }
}
