export function setChoice(source: any, dest: any, choiceName: string, ... choices: string[]) {
  const primitives = ['base64Binary', 'boolean', 'canonical', 'code', 'date', 'dateTime', 'decimal', 'id', 'instant', 'integer', 'markdown', 'oid', 'positiveInt', 'string', 'time', 'unsignedInt', 'uri', 'url', 'uuid'];

  if (!choices || choices.length === 0) {
    throw new Error('No choices specified for setChoice()');
  }

  for (const choice of choices) {
    const propertyName = choiceName + choice.substring(0, 1).toUpperCase() + choice.substring(1);
    const sourceValue = source[propertyName];

    if (sourceValue) {
      if (primitives.indexOf(choice)) {
        dest[propertyName] = sourceValue;
      } else {
        let className = choice;

        if (className === 'Reference') {
          className = 'ResourceReference';
        }

        dest[propertyName] = new (<any>window)[className](sourceValue);
      }
    }
  }
}

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

export interface IContactDetail {
  name?: string;
  telecom?: IContactPoint[];
}

export interface IPractitioner extends IDomainResource {
  resourceType: string;
  identifier?: IIdentifier[];
  name?: IHumanName[];
  telecom?: IContactPoint[];
}

export interface IElement {
  id?: string;
  extension?: IExtension[];
}

export interface IElementDefinitionType extends IElement {
  code: string;
  profile?: string|string[];
  _profile?: IElement | IElement[];
  targetProfile?: string|string[];
}

export interface IElementDefinitionMapping {
  identity: string;
  language?: string;
  map: string;
  comment?: string;
}

export interface IElementDefinitionDiscriminator {
  type: string;
  path: string;
}

export interface IElementDefinitionConstraint {
  key: string;
  requirements?: string;
  severity: string;
  human: string;
  expression?: string;
  source?: string;
}

export interface IElementDefinitionSlicing {
  discriminator?: IElementDefinitionDiscriminator[];
  description?: string;
  ordered?: boolean;
  rules: 'closed'|'open'|'openAtEnd';
}

export interface IElementDefinition extends IElement {
  path: string;
  sliceName?: string;
  slicing?: IElementDefinitionSlicing;
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
  constraint?: IElementDefinitionConstraint[];
  isSummary?: boolean;
  isModifier?: boolean;
  mustSupport?: boolean;
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

export interface IImplementationGuide extends IDomainResource {
  url: string;
  version?: string;
  name: string;
  status: string;
  fhirVersion?: string|string[];
  description?: string;
  experimental?: boolean;
}
