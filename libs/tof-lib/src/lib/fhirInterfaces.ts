export interface IResourceReference {
  reference?: string;
  display?: string;
}

export interface INetworkComponent {
  address?: string;
  type?: ICoding;
}

export interface IAgentComponent{
  role?: ICodeableConcept[];
  altId?: string;
  name?: string;
  requestor: boolean;
  location?: IResourceReference;
  policy?: string[];
  media?: ICoding;
  network?: INetworkComponent;
  purposeOfUse?: ICodeableConcept[];
}

export interface ISourceComponent {
  site?: string;
  type?: ICoding[];
}

export interface IDetailComponent {
  type: string;
}

export interface IEntityComponent {
  type?: ICoding;
  role?: ICoding;
  lifecycle?: ICoding;
  securityLabel?: ICoding[];
  name?: string;
  description?: string;
  query?: string; //stored as base64
  detail?: IDetailComponent[];
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

export interface IContactDetail {
  name?: string;
  telecom?: IContactPoint[];
}

export interface IAuditEvent {
  type: ICoding;
  subtype?: ICoding[];
  action?: string;
  recorded: string;
  outcome?: ICoding;
  outcomeDesc?: string;
  purposeOfEvent?: ICodeableConcept[];
  agent: IAgentComponent[];
  source: ISourceComponent;
  entity?: IEntityComponent[];
}
