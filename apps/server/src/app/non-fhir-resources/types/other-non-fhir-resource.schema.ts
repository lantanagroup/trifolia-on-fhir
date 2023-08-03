import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { NonFhirResourceBase } from "../non-fhir-resource.schema";
import { NonFhirResourceType } from "@trifolia-fhir/models";


export type OtherNonFhirResourceDocument = HydratedDocument<OtherNonFhirResource>;

@Schema()
export class OtherNonFhirResource extends NonFhirResourceBase { 
    readonly type: NonFhirResourceType = NonFhirResourceType.Other;
    get myOtherProperty() { return `myOtherProperty ${new Date().toISOString()}` }
}
export const OtherNonFhirResourceSchema = SchemaFactory.createForClass(OtherNonFhirResource);
OtherNonFhirResourceSchema.loadClass(OtherNonFhirResource);
