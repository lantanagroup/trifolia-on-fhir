using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;
using Hl7.Fhir.Serialization;
using Microsoft.AspNetCore.Mvc.Formatters;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace TrifoliaFhir
{
    public class FhirOutputFormatter : TextOutputFormatter
    {
        public FhirOutputFormatter()
        {
            foreach (var mediaType in ContentType.JSON_CONTENT_HEADERS)
                SupportedMediaTypes.Add(new Microsoft.Net.Http.Headers.MediaTypeHeaderValue(mediaType));
            foreach (var mediaType in ContentType.XML_CONTENT_HEADERS)
                SupportedMediaTypes.Add(new Microsoft.Net.Http.Headers.MediaTypeHeaderValue(mediaType));

            SupportedEncodings.Clear();
            SupportedEncodings.Add(Encoding.UTF8);
            SupportedEncodings.Add(Encoding.Unicode);
        }

        protected override bool CanWriteType(Type type)
        {
            if (typeof(Resource).IsAssignableFrom(type))
                return base.CanWriteType(type);

            return false;
        }

        public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            Type type = context.ObjectType;
            var response = context.HttpContext.Response;
            string acceptHeaders = context.HttpContext.Request.Headers["accept"];
            bool isXml = false;

            foreach (var acceptHeader in acceptHeaders.Split(','))
            {
                // Prioritize JSON
                if (ContentType.GetResourceFormatFromContentType(acceptHeader.Trim()) == ResourceFormat.Json)
                    break;

                if (ContentType.GetResourceFormatFromContentType(acceptHeader.Trim()) == ResourceFormat.Xml)
                {
                    isXml = true;
                    break;
                }
            }

            if (isXml)
            {
                string xml = FhirSerializer.SerializeResourceToXml((Resource)context.Object);
                using (StreamWriter writer = new StreamWriter(response.Body))
                {
                    await writer.WriteAsync(xml);
                    await writer.FlushAsync();
                }
            }
            else
            {
                string json = FhirSerializer.SerializeResourceToJson((Resource)context.Object);
                using (StreamWriter writer = new StreamWriter(response.Body))
                {
                    await writer.WriteAsync(json);
                    await writer.FlushAsync();
                }
            }
        }
    }
}
