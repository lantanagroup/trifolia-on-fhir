import { CdaExample, OtherNonFhirResource } from '@trifolia-fhir/models';
import { HydratedDocument, Schema } from 'mongoose';



export type CdaExampleDocument = HydratedDocument<CdaExample>;
export const CdaExampleSchema = new Schema<CdaExample>();


export type OtherNonFhirResourceDocument = HydratedDocument<OtherNonFhirResource>;
export const OtherNonFhirResourceSchema = new Schema<OtherNonFhirResource>();