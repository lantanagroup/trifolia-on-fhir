import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { NonFhirResource } from "../non-fhir-resource.schema";
import { NonFhirResourceType } from "@trifolia-fhir/models";


export type OtherNonFhirResourceDocument = HydratedDocument<OtherNonFhirResource>;

@Schema()
export class OtherNonFhirResource extends NonFhirResource { 
    readonly type: NonFhirResourceType = NonFhirResourceType.Other;
}
export const OtherNonFhirResourceSchema = SchemaFactory.createForClass(OtherNonFhirResource);
OtherNonFhirResourceSchema.loadClass(OtherNonFhirResource);
