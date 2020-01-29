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

export interface IResource {
  id?: string;
  meta?: any;
  implicitRules?: string;
  language?: string;
}

export interface IDomainResource extends IResource {
  resourceType: string;
  text?: any;
  contained?: IDomainResource[];
  extension?: IExtension[];
  modifierExtension?: IExtension[];
}

export interface IBundleEntry {
  search?: {
    mode?: string;
    score?: number;
  };
  resource?: IDomainResource;
  request?: {
    method: string;
    url: string;
  };
  response?: {
    status: string;
    location?: string;
    etag?: string;
    lastModified?: Date;
    outcome?: IDomainResource | IResource;
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

export interface IHumanName {
  use?: string;
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
}

export interface IIdentifier {
  use?: string;
  type?: ICodeableConcept;
  system?: string;
  value?: string;
}

export interface IContactPoint {
  system?: 'phone'|'fax'|'email'|'pager'|'url'|'sms'|'other';
  value?: string;
  use?: 'home'|'work'|'temp'|'old'|'mobile';
}

export interface IPractitioner extends IDomainResource {
  resourceType: string;
  identifier?: IIdentifier[];
  name?: IHumanName[];
  telecom?: IContactPoint[];
}
