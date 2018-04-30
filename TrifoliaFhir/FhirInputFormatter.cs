using Microsoft.AspNetCore.Mvc.Formatters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using Hl7.Fhir.Rest;
using Hl7.Fhir.Model;
using System.IO;
using Hl7.Fhir.Serialization;

namespace TrifoliaFhir
{
    public class FhirInputFormatter : InputFormatter
    {
        public FhirInputFormatter()
        {
            foreach (var mediaType in ContentType.JSON_CONTENT_HEADERS)
                SupportedMediaTypes.Add(new Microsoft.Net.Http.Headers.MediaTypeHeaderValue(mediaType));
            foreach (var mediaType in ContentType.XML_CONTENT_HEADERS)
                SupportedMediaTypes.Add(new Microsoft.Net.Http.Headers.MediaTypeHeaderValue(mediaType));
        }

        public override bool CanRead(InputFormatterContext context)
        {
            return base.CanRead(context);
        }

        protected override bool CanReadType(Type type)
        {
            if (typeof(Resource).IsAssignableFrom(type))
                return base.CanReadType(type);

            return false;
        }

        public override Task<InputFormatterResult> ReadRequestBodyAsync(InputFormatterContext context)
        {
            var type = context.ModelType;
            var request = context.HttpContext.Request;

            if (ContentType.GetResourceFormatFromContentType(request.ContentType) == ResourceFormat.Json)
            {
                using (StreamReader reader = new StreamReader(request.Body))
                {
                    FhirJsonParser parser = new FhirJsonParser(new ParserSettings()
                    {
                        AcceptUnknownMembers = true,
                        AllowUnrecognizedEnums = true,
                        DisallowXsiAttributesOnRoot = false
                    });
                    string json = reader.ReadToEnd();
                    var result = parser.Parse(json, type);
                    return InputFormatterResult.SuccessAsync(result);
                }
            }
            else
            {
                using (StreamReader reader = new StreamReader(request.Body))
                {
                    FhirXmlParser parser = new FhirXmlParser();
                    string xml = reader.ReadToEnd();
                    var result = parser.Parse(xml, type);
                    return InputFormatterResult.SuccessAsync(result);
                }
            }
        }
    }
}
