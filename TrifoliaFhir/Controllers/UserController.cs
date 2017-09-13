using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace TrifoliaFhir.Controllers
{
    [Route("api/user")]
    public class UserController : Controller
    {
        // GET api/user
        [Authorize]
        [HttpGet]
        public IEnumerable<string> GetUsers()
        {
            return new string[] { "value1", "value2" };
        }
    }
}
