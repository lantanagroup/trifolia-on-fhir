import {CodeableConcept, Coding, ResourceReference} from './stu3/fhir';

export interface IResourceReference {
  reference?: string;
  display?: string;
}

export interface ICoding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export interface ICodeableConcept {
  coding?: ICoding[];
  text?: string;
}

export interface IExtension {
  url: string;
  valueBoolean?: boolean;
  valueString?: string;
  valueReference?: IResourceReference;
}
