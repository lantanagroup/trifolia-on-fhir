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

export interface IElement {
  id?: string;
}

export interface IElementDefinitionType {
  code: string;
  profile?: string|string[];
  targetProfile?: string|string[];
}

export interface IElementDefinitionMapping {
  identity: string;
  language?: string;
  map: string;
  comment?: string;
}

export interface IElementDefinition extends IElement {
  path: string;
  sliceName?: string;
  slicing?: any;
  label?: string;
  short?: string;
  definition?: string;
  alias?: string[];
  type?: IElementDefinitionType[];
  min?: number;
  max?: string;
  contentReference?: string;
  binding?: {
    strength: string;
  }
  example?: any;
  mapping?: IElementDefinitionMapping[];
}

export interface IStructureDefinition extends IDomainResource {
  url: string;
  identifier?: IIdentifier[];
  name: string;
  title?: string;
  status: string;
  snapshot?: {
    element: IElementDefinition[]
  };
  differential?: {
    element: IElementDefinition[];
  };
}
