import {CdaExample, CustomMenu, OtherNonFhirResource, Page, StructureDefinitionIntro, StructureDefinitionNotes} from '@trifolia-fhir/models';
import { HydratedDocument, Schema } from 'mongoose';


export type CdaExampleDocument = HydratedDocument<CdaExample>;
export const CdaExampleSchema = new Schema<CdaExample>();

export type StructureDefinitionIntroDocument = HydratedDocument<StructureDefinitionIntro>;
export const StructureDefinitionIntroSchema = new Schema<StructureDefinitionIntro>();

export type StructureDefinitionNotesDocument = HydratedDocument<StructureDefinitionNotes>;
export const StructureDefinitionNotesSchema = new Schema<StructureDefinitionNotes>();

export type OtherNonFhirResourceDocument = HydratedDocument<OtherNonFhirResource>;
export const OtherNonFhirResourceSchema = new Schema<OtherNonFhirResource>();

export const CustomMenuSchema = new Schema<CustomMenu>();

export const PageSchema = new Schema<Page>({
  navMenu: String,
  reuseDescription : Boolean
});


