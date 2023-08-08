import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { NonFhirResourceType, type ICdaExample } from "@trifolia-fhir/models";
import { HydratedDocument } from "mongoose";
import { NonFhirResource } from "../non-fhir-resource.schema";

export type CdaExampleDocument = HydratedDocument<CdaExample>;

@Schema()
export class CdaExample extends NonFhirResource implements ICdaExample {
    readonly type: NonFhirResourceType = NonFhirResourceType.CdaExample;
}

export const CdaExampleSchema = SchemaFactory.createForClass(CdaExample);
CdaExampleSchema.loadClass(CdaExample);
