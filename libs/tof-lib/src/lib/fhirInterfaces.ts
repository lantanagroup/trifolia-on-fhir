import {DomainResource as STU3DomainResource, ResourceReference} from './stu3/fhir';
import {DomainResource as R4DomainResource, Resource as R4Resource} from './r4/fhir';

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
  valueMarkdown?: string;
}

export interface IBundleEntry {
  search?: {
    mode?: string;
    score?: number;
  };
  resource?: STU3DomainResource | R4DomainResource;
  request?: {
    method: string;
    url: string;
  };
  response?: {
    status: string;
    location?: string;
    etag?: string;
    lastModified?: Date;
    outcome?: STU3DomainResource | R4Resource;
  };
}

export interface IBundle {
  type?: string;
  total?: number;
  link?: {
    relation: string;
    url: string;
  }[];
  entry?: IBundleEntry[];
}
