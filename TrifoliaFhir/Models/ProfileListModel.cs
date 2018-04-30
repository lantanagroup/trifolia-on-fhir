using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrifoliaFhir.Models
{
    public class ProfileListModel
    {
        public string Id { get; set; }
        public bool? Experimental { get; set; }
        public string Name { get; set; }
        public string Identifier { get; set; }
        public string Description { get; set; }
    }
}
