import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type ICdaExample, IPermission, IProject, IProjectResourceReference, NonFhirResourceType } from "@trifolia-fhir/models";
import { HydratedDocument } from "mongoose";
import { NonFhirResource, NonFhirResourceBase } from "../non-fhir-resource.schema";

export type CdaExampleDocument = HydratedDocument<CdaExample>;

@Schema()
export class CdaExample extends NonFhirResourceBase implements ICdaExample {  //extends NonFhirResource implements ICdaExample {
    readonly type: NonFhirResourceType = NonFhirResourceType.CdaExample;

    @Prop()
    public cdaProperty: string = "just a test";
}

export const CdaExampleSchema = SchemaFactory.createForClass(CdaExample);
//CdaExampleSchema.loadClass(CdaExample);

//NonFhirResource.disciminator(CdaExampleSchema.eventNames, CdaExampleSchema);