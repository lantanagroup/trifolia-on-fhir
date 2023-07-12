import {
  IAgentComponent, IAttachment,
  IAuditEvent,
  IBundle, ICapabilityStatement, ICodeableConcept,
  ICodeSystem,
  IContactDetail,
  IContactPoint,
  IDetailComponent,
  IDomainResource,
  IElementDefinition,
  IElementDefinitionDiscriminator,
  IElementDefinitionSlicing,
  IElementDefinitionType,
  IEntityComponent,
  IExtension,
  IHumanName,
  IImplementationGuide, IMeta,
  INetworkComponent, IOperationOutcome,
  IPractitioner, IResourceReference,
  IStructureDefinition, IValueSet,
  setChoice
} from '../fhirInterfaces';
import {Globals} from '../globals';
import {Reference} from '../r5/fhir';

export class Base {
  public fhir_comments?: string[];

  constructor(obj?: any) {
    if (obj) {
      if (obj.hasOwnProperty('fhir_comments')) {
        this.fhir_comments = obj.fhir_comments;
      }
    }
  }

}

export class Extension implements IExtension {
  public id?: string;
  public extension?: Extension[];
  public url: string;
  public valueBoolean?: boolean;
  public valueString?: string;
  public valueUri?: string;
  public valueReference?: ResourceReference;
  public valueMarkdown?: string;

  constructor(obj?: any) {
    if (obj) {
      if (obj.hasOwnProperty('id')) {
        this.id = obj.id;
      }
      if (obj.hasOwnProperty('extension')) {
        this.extension = [];
        for (const o of obj.extension || []) {
          this.extension.push(new Extension(o));
        }
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('valueBoolean')) {
        this.valueBoolean = obj.valueBoolean;
      }
      if (obj.hasOwnProperty('valueString')) {
        this.valueString = obj.valueString;
      }
      if (obj.hasOwnProperty('valueUri')) {
        this.valueUri = obj.valueUri;
      }
      if (obj.hasOwnProperty('valueReference')) {
        this.valueReference = new ResourceReference(obj.valueReference);
      }
      if (obj.hasOwnProperty('valueMarkdown')) {
        this.valueMarkdown = obj.valueMarkdown;
      }

      // Add other properties as needed
    }
  }

}

export class Element extends Base {
  public id?: string;
  public extension?: Extension[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('id')) {
        this.id = obj.id;
      }
      if (obj.hasOwnProperty('extension')) {
        this.extension = [];
        for (const o of obj.extension || []) {
          this.extension.push(new Extension(o));
        }
      }
    }
  }

}

export class Coding extends Element {
  public system?: string;
  public version?: string;
  public code?: string;
  public display?: string;
  public userSelected?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('system')) {
        this.system = obj.system;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
      if (obj.hasOwnProperty('userSelected')) {
        this.userSelected = obj.userSelected;
      }
    }
  }

}

export class Meta extends Element implements IMeta {
  public versionId?: string;
  public lastUpdated?: string;
  public source?: string;
  public profile?: string[];
  public security?: Coding[];
  public tag?: Coding[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('versionId')) {
        this.versionId = obj.versionId;
      }
      if (obj.hasOwnProperty('lastUpdated')) {
        this.lastUpdated = obj.lastUpdated;
      }
      if (obj.hasOwnProperty('source')) {
        this.source = obj.source;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
      if (obj.hasOwnProperty('security')) {
        this.security = [];
        for (const o of obj.security || []) {
          this.security.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('tag')) {
        this.tag = [];
        for (const o of obj.tag || []) {
          this.tag.push(new Coding(o));
        }
      }
    }
  }

}

export class Resource extends Base {
  public id?: string;
  public meta?: Meta;
  public implicitRules?: string;
  public language?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('id')) {
        this.id = obj.id;
      }
      if (obj.hasOwnProperty('meta')) {
        this.meta = new Meta(obj.meta);
      }
      if (obj.hasOwnProperty('implicitRules')) {
        this.implicitRules = obj.implicitRules;
      }
      if (obj.hasOwnProperty('language')) {
        this.language = obj.language;
      }
    }
  }

}

export class CodeableConcept extends Element implements ICodeableConcept {
  public coding?: Coding[];
  public text?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('coding')) {
        this.coding = [];
        for (const o of obj.coding || []) {
          this.coding.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
    }
  }

}

export class Period extends Element {
  public start?: string;
  public end?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('start')) {
        this.start = obj.start;
      }
      if (obj.hasOwnProperty('end')) {
        this.end = obj.end;
      }
    }
  }

}

export class Identifier extends Element {
  public use?: string;
  public type?: CodeableConcept;
  public system?: string;
  public value?: string;
  public period?: Period;
  public assigner?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('system')) {
        this.system = obj.system;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('assigner')) {
        this.assigner = new ResourceReference(obj.assigner);
      }
    }
  }

}

export class ResourceReference extends Element implements IResourceReference {
  public reference?: string;
  public type?: string;
  public identifier?: Identifier;
  public display?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('reference')) {
        this.reference = obj.reference;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
    }
  }

}

export class Binary extends Resource {
  public resourceType = 'Binary';
  public contentType: string;
  public securityContext?: ResourceReference;
  public data?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('contentType')) {
        this.contentType = obj.contentType;
      }
      if (obj.hasOwnProperty('securityContext')) {
        this.securityContext = new ResourceReference(obj.securityContext);
      }
      if (obj.hasOwnProperty('data')) {
        this.data = obj.data;
      }
    }
  }

}

export class Narrative extends Element {
  public status: string;
  public div: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('div')) {
        this.div = obj.div;
      }
    }
  }

}

export class DomainResource extends Resource implements IDomainResource {
  public resourceType = 'DomainResource';
  public text?: Narrative;
  public contained?: DomainResource[];
  public extension?: Extension[];
  public modifierExtension?: Extension[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('resourceType')) {
        this.resourceType = obj.resourceType;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = new Narrative(obj.text);
      }
      if (obj.hasOwnProperty('contained')) {
        this.contained = [];
        for (const o of obj.contained || []) {
          if (o.resourceType && classMapping[o.resourceType]) {
            const contained = new classMapping[o.resourceType](o);
            this.contained.push(<DomainResource> contained);
          }
        }
      }
      if (obj.hasOwnProperty('extension')) {
        this.extension = [];
        for (const o of obj.extension || []) {
          this.extension.push(new Extension(o));
        }
      }
      if (obj.hasOwnProperty('modifierExtension')) {
        this.modifierExtension = [];
        for (const o of obj.modifierExtension || []) {
          this.modifierExtension.push(new Extension(o));
        }
      }
    }
  }
}

export class ContactPoint extends Element implements IContactPoint {
  public system?: 'phone'|'fax'|'email'|'pager'|'url'|'sms'|'other';
  public value?: string;
  public use?: 'home'|'work'|'temp'|'old'|'mobile';
  public rank?: number;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('system')) {
        this.system = obj.system;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('rank')) {
        this.rank = obj.rank;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class ContactDetail extends Element implements IContactDetail {
  public name?: string;
  public telecom?: ContactPoint[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
    }
  }

}

export class UsageContext extends Element {
  public code: Coding;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueReference?: Reference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new Coding(obj.code);
      }

      if (obj.hasOwnProperty('valueCodeableConcept')) {
        this.valueCodeableConcept = obj.valueCodeableConcept;
      }

      if (obj.hasOwnProperty('valueQuantity')) {
        this.valueQuantity = obj.valueQuantity;
      }

      if (obj.hasOwnProperty('valueRange')) {
        this.valueRange = obj.valueRange;
      }

      if (obj.hasOwnProperty('valueReference')) {
        this.valueReference = obj.valueReference;
      }
    }
  }

}

export class BackboneElement extends Element {
  public modifierExtension?: Extension[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('modifierExtension')) {
        this.modifierExtension = [];
        for (const o of obj.modifierExtension || []) {
          this.modifierExtension.push(new Extension(o));
        }
      }
    }
  }

}

export class StructureDefinitionMappingComponent extends BackboneElement {
  public identity: string;
  public uri?: string;
  public name?: string;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identity')) {
        this.identity = obj.identity;
      }
      if (obj.hasOwnProperty('uri')) {
        this.uri = obj.uri;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
    }
  }

}

export class ElementDefinitionDiscriminatorComponent extends Element implements IElementDefinitionDiscriminator {
  public type: string;
  public path: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
    }
  }

}

export class ElementDefinitionSlicingComponent extends Element implements IElementDefinitionSlicing {
  public discriminator?: ElementDefinitionDiscriminatorComponent[];
  public description?: string;
  public ordered?: boolean;
  public rules: 'closed'|'open'|'openAtEnd';

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('discriminator')) {
        this.discriminator = [];
        for (const o of obj.discriminator || []) {
          this.discriminator.push(new ElementDefinitionDiscriminatorComponent(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('ordered')) {
        this.ordered = obj.ordered;
      }
      if (obj.hasOwnProperty('rules')) {
        this.rules = obj.rules;
      }
    }
  }

}

export class ElementDefinitionBaseComponent extends Element {
  public path: string;
  public min: number;
  public max: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('min')) {
        this.min = obj.min;
      }
      if (obj.hasOwnProperty('max')) {
        this.max = obj.max;
      }
    }
  }

}

export class ElementDefinitionTypeRefComponent extends Element implements IElementDefinitionType {
  public code: string;
  public profile?: string[];
  public _profile?: Element|Element[];
  public targetProfile?: string[];
  public aggregation?: string[];
  public versioning?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
      if (obj.hasOwnProperty('targetProfile')) {
        this.targetProfile = obj.targetProfile;
      }
      if (obj.hasOwnProperty('aggregation')) {
        this.aggregation = obj.aggregation;
      }
      if (obj.hasOwnProperty('versioning')) {
        this.versioning = obj.versioning;
      }
      if (obj.hasOwnProperty('_profile')) {
        if (obj._profile instanceof Array) {
          this._profile = [];
          for (const profileInfo of obj._profile) {
            this._profile.push(profileInfo ? new Element(profileInfo) : profileInfo);
          }
        } else {
          this._profile = new Element(obj._profile);
        }
      }
    }
  }

}

export class ElementDefinitionExampleComponent extends Element {
  public label: string;

  // Value Choices
  public valueBase64Binary?: string;
  public valueBoolean?: boolean;
  public valueCanonical?: string;
  public valueCode?: string;
  public valueDate?: string;
  public valueDateTime?: string;
  public valueDecimal?: number;
  public valueId?: string;
  public valueInstant?: number;
  public valueInteger?: number;
  public valueMarkdown?: string;
  public valueOid?: string;
  public valuePositiveInt?: number;
  public valueString?: string;
  public valueTime?: string;
  public valueUnsignedInt?: number;
  public valueUri?: string;
  public valueUrl?: string;
  public valueUuid?: string;
  public valueAddress?: Address;
  public valueAge?: Age;
  public valueAnnotation?: Annotation;
  public valueAttachment?: Attachment;
  public valueCodeableConcept?: CodeableConcept;
  public valueCoding?: Coding;
  public valueContactPoint?: ContactPoint;
  public valueCount?: Count;
  public valueDistance?: Distance;
  public valueDuration?: Duration;
  public valueHumanName?: HumanName;
  public valueIdentifier?: Identifier;
  public valueMoney?: Money;
  public valuePeriod?: Period;
  public valueQuantity?: Quantity;
  public valueRange?: Range;
  public valueRatio?: Ratio;
  public valueReference?: ResourceReference;
  public valueSampledData?: SampledData;
  public valueSignature?: Signature;
  public valueTiming?: Timing;
  public valueContactDetail?: ContactDetail;
  public valueContributor?: Contributor;
  public valueDataRequirement?: DataRequirement;
  public valueExpression?: Expression;
  public valueParameterDefinition?: ParameterDefinition;
  public valueRelatedArtifact?: RelatedArtifact;
  public valueTriggerDefinition?: TriggerDefinition;
  public valueUsageContext?: UsageContext;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('label')) {
        this.label = obj.label;
      }

      setChoice(obj, this, 'value', 'base64Binary', 'boolean', 'canonical', 'code', 'date', 'dateTime', 'decimal', 'id', 'instant', 'integer', 'markdown', 'oid', 'positiveInt', 'string', 'time', 'unsignedInt', 'uri', 'url', 'uuid', 'Address', 'Age', 'Annotation', 'Attachment', 'CodeableConcept', 'Coding', 'ContactPoint', 'Count', 'Distance', 'Duration', 'HumanName', 'Identifier', 'Money', 'Period', 'Quantity', 'Range', 'Ratio', 'Reference', 'SampledData', 'Signature', 'Timing', 'ContactDetail', 'Contributor', 'DataRequirement', 'Expression', 'ParameterDefinition', 'RelatedArtifact', 'TriggerDefinition');
    }
  }
}

export class ElementDefinitionConstraintComponent extends Element {
  public key: string;
  public requirements?: string;
  public severity: string;
  public human: string;
  public expression?: string;
  public xpath?: string;
  public source?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('key')) {
        this.key = obj.key;
      }
      if (obj.hasOwnProperty('requirements')) {
        this.requirements = obj.requirements;
      }
      if (obj.hasOwnProperty('severity')) {
        this.severity = obj.severity;
      }
      if (obj.hasOwnProperty('human')) {
        this.human = obj.human;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
      if (obj.hasOwnProperty('xpath')) {
        this.xpath = obj.xpath;
      }
      if (obj.hasOwnProperty('source')) {
        this.source = obj.source;
      }
    }
  }

}

export class ElementDefinitionElementDefinitionBindingComponent extends Element {
  public strength: string;
  public description?: string;
  public valueSet?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('strength')) {
        this.strength = obj.strength;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('valueSet')) {
        this.valueSet = obj.valueSet;
      }
    }
  }

}

export class ElementDefinitionMappingComponent extends Element {
  public identity: string;
  public language?: string;
  public map: string;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identity')) {
        this.identity = obj.identity;
      }
      if (obj.hasOwnProperty('language')) {
        this.language = obj.language;
      }
      if (obj.hasOwnProperty('map')) {
        this.map = obj.map;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
    }
  }

}

export class ElementDefinition extends BackboneElement implements IElementDefinition {
  public path: string;
  public representation?: string[];
  public sliceName?: string;
  public sliceIsConstraining?: boolean;
  public label?: string;
  public code?: Coding[];
  public slicing?: ElementDefinitionSlicingComponent;
  public short?: string;
  public definition?: string;
  public comment?: string;
  public requirements?: string;
  public alias?: string[];
  public min?: number;
  public max?: string;
  public base?: ElementDefinitionBaseComponent;
  public contentReference?: string;
  public type?: ElementDefinitionTypeRefComponent[];
  public meaningWhenMissing?: string;
  public orderMeaning?: string;
  public example?: ElementDefinitionExampleComponent[];
  public minValue?: Element;
  public maxValue?: Element;
  public maxLength?: number;
  public condition?: string[];
  public constraint?: ElementDefinitionConstraintComponent[];
  public mustSupport?: boolean;
  public isModifier?: boolean;
  public isModifierReason?: string;
  public isSummary?: boolean;
  public binding?: ElementDefinitionElementDefinitionBindingComponent;
  public mapping?: ElementDefinitionMappingComponent[];

  // Fixed Choices
  public fixedBase64Binary?: string;
  public fixedBoolean?: boolean;
  public fixedCanonical?: string;
  public fixedCode?: string;
  public fixedDate?: string;
  public fixedDateTime?: string;
  public fixedDecimal?: number;
  public fixedId?: string;
  public fixedInstant?: number;
  public fixedInteger?: number;
  public fixedMarkdown?: string;
  public fixedOid?: string;
  public fixedPositiveInt?: number;
  public fixedString?: string;
  public fixedTime?: string;
  public fixedUnsignedInt?: number;
  public fixedUri?: string;
  public fixedUrl?: string;
  public fixedUuid?: string;
  public fixedAddress?: Address;
  public fixedAge?: Age;
  public fixedAnnotation?: Annotation;
  public fixedAttachment?: Attachment;
  public fixedCodeableConcept?: CodeableConcept;
  public fixedCoding?: Coding;
  public fixedContactPoint?: ContactPoint;
  public fixedCount?: Count;
  public fixedDistance?: Distance;
  public fixedDuration?: Duration;
  public fixedHumanName?: HumanName;
  public fixedIdentifier?: Identifier;
  public fixedMoney?: Money;
  public fixedPeriod?: Period;
  public fixedQuantity?: Quantity;
  public fixedRange?: Range;
  public fixedRatio?: Ratio;
  public fixedReference?: ResourceReference;
  public fixedSampledData?: SampledData;
  public fixedSignature?: Signature;
  public fixedTiming?: Timing;
  public fixedContactDetail?: ContactDetail;
  public fixedContributor?: Contributor;
  public fixedDataRequirement?: DataRequirement;
  public fixedExpression?: Expression;
  public fixedParameterDefinition?: ParameterDefinition;
  public fixedRelatedArtifact?: RelatedArtifact;
  public fixedTriggerDefinition?: TriggerDefinition;
  public fixedUsageContext?: UsageContext;

  // Pattern Choices
  public patternBase64Binary?: string;
  public patternBoolean?: boolean;
  public patternCanonical?: string;
  public patternCode?: string;
  public patternDate?: string;
  public patternDateTime?: string;
  public patternDecimal?: number;
  public patternId?: string;
  public patternInstant?: number;
  public patternInteger?: number;
  public patternMarkdown?: string;
  public patternOid?: string;
  public patternPositiveInt?: number;
  public patternString?: string;
  public patternTime?: string;
  public patternUnsignedInt?: number;
  public patternUri?: string;
  public patternUrl?: string;
  public patternUuid?: string;
  public patternAddress?: Address;
  public patternAge?: Age;
  public patternAnnotation?: Annotation;
  public patternAttachment?: Attachment;
  public patternCodeableConcept?: CodeableConcept;
  public patternCoding?: Coding;
  public patternContactPoint?: ContactPoint;
  public patternCount?: Count;
  public patternDistance?: Distance;
  public patternDuration?: Duration;
  public patternHumanName?: HumanName;
  public patternIdentifier?: Identifier;
  public patternMoney?: Money;
  public patternPeriod?: Period;
  public patternQuantity?: Quantity;
  public patternRange?: Range;
  public patternRatio?: Ratio;
  public patternReference?: ResourceReference;
  public patternSampledData?: SampledData;
  public patternSignature?: Signature;
  public patternTiming?: Timing;
  public patternContactDetail?: ContactDetail;
  public patternContributor?: Contributor;
  public patternDataRequirement?: DataRequirement;
  public patternExpression?: Expression;
  public patternParameterDefinition?: ParameterDefinition;
  public patternRelatedArtifact?: RelatedArtifact;
  public patternTriggerDefinition?: TriggerDefinition;
  public patternUsageContext?: UsageContext;

  // Default Value Choice
  public defaultValueBase64Binary?: string;
  public defaultValueBoolean?: boolean;
  public defaultValueCanonical?: string;
  public defaultValueCode?: string;
  public defaultValueDate?: string;
  public defaultValueDateTime?: string;
  public defaultValueDecimal?: number;
  public defaultValueId?: string;
  public defaultValueInstant?: number;
  public defaultValueInteger?: number;
  public defaultValueMarkdown?: string;
  public defaultValueOid?: string;
  public defaultValuePositiveInt?: number;
  public defaultValueString?: string;
  public defaultValueTime?: string;
  public defaultValueUnsignedInt?: number;
  public defaultValueUri?: string;
  public defaultValueUrl?: string;
  public defaultValueUuid?: string;
  public defaultValueAddress?: Address;
  public defaultValueAge?: Age;
  public defaultValueAnnotation?: Annotation;
  public defaultValueAttachment?: Attachment;
  public defaultValueCodeableConcept?: CodeableConcept;
  public defaultValueCoding?: Coding;
  public defaultValueContactPoint?: ContactPoint;
  public defaultValueCount?: Count;
  public defaultValueDistance?: Distance;
  public defaultValueDuration?: Duration;
  public defaultValueHumanName?: HumanName;
  public defaultValueIdentifier?: Identifier;
  public defaultValueMoney?: Money;
  public defaultValuePeriod?: Period;
  public defaultValueQuantity?: Quantity;
  public defaultValueRange?: Range;
  public defaultValueRatio?: Ratio;
  public defaultValueReference?: ResourceReference;
  public defaultValueSampledData?: SampledData;
  public defaultValueSignature?: Signature;
  public defaultValueTiming?: Timing;
  public defaultValueContactDetail?: ContactDetail;
  public defaultValueContributor?: Contributor;
  public defaultValueDataRequirement?: DataRequirement;
  public defaultValueExpression?: Expression;
  public defaultValueParameterDefinition?: ParameterDefinition;
  public defaultValueRelatedArtifact?: RelatedArtifact;
  public defaultValueTriggerDefinition?: TriggerDefinition;
  public defaultValueUsageContext?: UsageContext;

  // Min Value Choices
  public minValueDate?: string;
  public minValueDateTime?: string;
  public minValueInstant?: number;
  public minValueTime?: string;
  public minValueDecimal?: number;
  public minValueInteger?: number;
  public minValuePositiveInt?: number;
  public minValueUnsignedInt?: number;
  public minValueQuantity?: Quantity;

  // Max Value Choices
  public maxValueDate?: string;
  public maxValueDateTime?: string;
  public maxValueInstant?: number;
  public maxValueTime?: string;
  public maxValueDecimal?: number;
  public maxValueInteger?: number;
  public maxValuePositiveInt?: number;
  public maxValueUnsignedInt?: number;
  public maxValueQuantity?: Quantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('representation')) {
        this.representation = obj.representation;
      }
      if (obj.hasOwnProperty('sliceName')) {
        this.sliceName = obj.sliceName;
      }
      if (obj.hasOwnProperty('sliceIsConstraining')) {
        this.sliceIsConstraining = obj.sliceIsConstraining;
      }
      if (obj.hasOwnProperty('label')) {
        this.label = obj.label;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('slicing')) {
        this.slicing = new ElementDefinitionSlicingComponent(obj.slicing);
      }
      if (obj.hasOwnProperty('short')) {
        this.short = obj.short;
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('requirements')) {
        this.requirements = obj.requirements;
      }
      if (obj.hasOwnProperty('alias')) {
        this.alias = obj.alias;
      }
      if (obj.hasOwnProperty('min')) {
        this.min = obj.min;
      }
      if (obj.hasOwnProperty('max')) {
        this.max = obj.max;
      }
      if (obj.hasOwnProperty('base')) {
        this.base = new ElementDefinitionBaseComponent(obj.base);
      }
      if (obj.hasOwnProperty('contentReference')) {
        this.contentReference = obj.contentReference;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new ElementDefinitionTypeRefComponent(o));
        }
      }
      if (obj.hasOwnProperty('meaningWhenMissing')) {
        this.meaningWhenMissing = obj.meaningWhenMissing;
      }
      if (obj.hasOwnProperty('orderMeaning')) {
        this.orderMeaning = obj.orderMeaning;
      }
      if (obj.hasOwnProperty('example')) {
        this.example = [];
        for (const o of obj.example || []) {
          this.example.push(new ElementDefinitionExampleComponent(o));
        }
      }
      if (obj.hasOwnProperty('minValue')) {
        this.minValue = new Element(obj.minValue);
      }
      if (obj.hasOwnProperty('maxValue')) {
        this.maxValue = new Element(obj.maxValue);
      }
      if (obj.hasOwnProperty('maxLength')) {
        this.maxLength = obj.maxLength;
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = obj.condition;
      }
      if (obj.hasOwnProperty('constraint')) {
        this.constraint = [];
        for (const o of obj.constraint || []) {
          this.constraint.push(new ElementDefinitionConstraintComponent(o));
        }
      }
      if (obj.hasOwnProperty('mustSupport')) {
        this.mustSupport = obj.mustSupport;
      }
      if (obj.hasOwnProperty('isModifier')) {
        this.isModifier = obj.isModifier;
      }
      if (obj.hasOwnProperty('isModifierReason')) {
        this.isModifierReason = obj.isModifierReason;
      }
      if (obj.hasOwnProperty('isSummary')) {
        this.isSummary = obj.isSummary;
      }
      if (obj.hasOwnProperty('binding')) {
        this.binding = new ElementDefinitionElementDefinitionBindingComponent(obj.binding);
      }
      if (obj.hasOwnProperty('mapping')) {
        this.mapping = [];
        for (const o of obj.mapping || []) {
          this.mapping.push(new ElementDefinitionMappingComponent(o));
        }
      }

      setChoice(obj, this, 'fixed', 'base64Binary', 'boolean', 'canonical', 'code', 'date', 'dateTime', 'decimal', 'id', 'instant', 'integer', 'markdown', 'oid', 'positiveInt', 'string', 'time', 'unsignedInt', 'uri', 'url', 'uuid', 'Address', 'Age', 'Annotation', 'Attachment', 'CodeableConcept', 'Coding', 'ContactPoint', 'Count', 'Distance', 'Duration', 'HumanName', 'Identifier', 'Money', 'Period', 'Quantity', 'Range', 'Ratio', 'Reference', 'SampledData', 'Signature', 'Timing', 'ContactDetail', 'Contributor', 'DataRequirement', 'Expression', 'ParameterDefinition', 'RelatedArtifact', 'TriggerDefinition');
      setChoice(obj, this, 'pattern', 'base64Binary', 'boolean', 'canonical', 'code', 'date', 'dateTime', 'decimal', 'id', 'instant', 'integer', 'markdown', 'oid', 'positiveInt', 'string', 'time', 'unsignedInt', 'uri', 'url', 'uuid', 'Address', 'Age', 'Annotation', 'Attachment', 'CodeableConcept', 'Coding', 'ContactPoint', 'Count', 'Distance', 'Duration', 'HumanName', 'Identifier', 'Money', 'Period', 'Quantity', 'Range', 'Ratio', 'Reference', 'SampledData', 'Signature', 'Timing', 'ContactDetail', 'Contributor', 'DataRequirement', 'Expression', 'ParameterDefinition', 'RelatedArtifact', 'TriggerDefinition');
      setChoice(obj, this, 'defaultValue', 'base64Binary', 'boolean', 'canonical', 'code', 'date', 'dateTime', 'decimal', 'id', 'instant', 'integer', 'markdown', 'oid', 'positiveInt', 'string', 'time', 'unsignedInt', 'uri', 'url', 'uuid', 'Address', 'Age', 'Annotation', 'Attachment', 'CodeableConcept', 'Coding', 'ContactPoint', 'Count', 'Distance', 'Duration', 'HumanName', 'Identifier', 'Money', 'Period', 'Quantity', 'Range', 'Ratio', 'Reference', 'SampledData', 'Signature', 'Timing', 'ContactDetail', 'Contributor', 'DataRequirement', 'Expression', 'ParameterDefinition', 'RelatedArtifact', 'TriggerDefinition');
      setChoice(obj, this, 'minValue', 'date', 'dateTime', 'instant', 'time', 'decimal', 'integer', 'positiveInt', 'unsignedInt', 'Quantity');
      setChoice(obj, this, 'maxValue', 'date', 'dateTime', 'instant', 'time', 'decimal', 'integer', 'positiveInt', 'unsignedInt', 'Quantity');
    }
  }

  public toString() {
    return this.id || this.path;
  }
}

export class StructureDefinitionSnapshotComponent extends BackboneElement {
  public element: ElementDefinition[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('element')) {
        this.element = [];
        for (const o of obj.element || []) {
          this.element.push(new ElementDefinition(o));
        }
      }
    }
  }

}

export class StructureDefinitionDifferentialComponent extends BackboneElement {
  public element: ElementDefinition[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('element')) {
        this.element = [];
        for (const o of obj.element || []) {
          this.element.push(new ElementDefinition(o));
        }
      }
    }
  }

}

export class StructureDefinitionContextComponent extends BackboneElement {
  public type: string;
  public expression: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
    }
  }

}

export class StructureDefinition extends DomainResource implements IStructureDefinition {
  public resourceType = 'StructureDefinition';
  public url: string;
  public identifier?: Identifier[];
  public version?: string;
  public name: string;
  public title?: string;
  public status: 'draft' | 'active' | 'retired' | 'unknown' = 'active';
  public experimental?: boolean;
  public date?: string;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public keyword?: Coding[];
  public fhirVersion?: string;
  public mapping?: StructureDefinitionMappingComponent[];
  public kind: 'primitive-type'|'complex-type'|'resource'|'logical' = 'resource';
  public abstract: boolean;
  public context?: StructureDefinitionContextComponent[];
  public contextInvariant?: string[];
  public type: string;
  public baseDefinition?: string;
  public derivation? = 'constraint';
  public snapshot?: StructureDefinitionSnapshotComponent;
  public differential?: StructureDefinitionDifferentialComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('keyword')) {
        this.keyword = [];
        for (const o of obj.keyword || []) {
          this.keyword.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('fhirVersion')) {
        this.fhirVersion = obj.fhirVersion;
      }
      if (obj.hasOwnProperty('mapping')) {
        this.mapping = [];
        for (const o of obj.mapping || []) {
          this.mapping.push(new StructureDefinitionMappingComponent(o));
        }
      }
      if (obj.hasOwnProperty('kind')) {
        this.kind = obj.kind;
      }
      if (obj.hasOwnProperty('abstract')) {
        this.abstract = obj.abstract;
      }
      if (obj.hasOwnProperty('context')) {
        this.context = [];
        for (const o of obj.context || []) {
          this.context.push(new StructureDefinitionContextComponent(o));
        }
      }
      if (obj.hasOwnProperty('contextInvariant')) {
        this.contextInvariant = obj.contextInvariant;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('baseDefinition')) {
        this.baseDefinition = obj.baseDefinition;
      }
      if (obj.hasOwnProperty('derivation')) {
        this.derivation = obj.derivation;
      }
      if (obj.hasOwnProperty('snapshot')) {
        this.snapshot = new StructureDefinitionSnapshotComponent(obj.snapshot);
      }
      if (obj.hasOwnProperty('differential')) {
        this.differential = new StructureDefinitionDifferentialComponent(obj.differential);
      }
    }
  }

  get notes() {
    if (!this.extension) return '';
    const extensions: IExtension[] = this.extension;
    const notes = extensions.find(e => e.url === Globals.extensionUrls['extension-sd-notes']);
    return notes ? notes.valueMarkdown || '' : '';
  }

  set notes(value: string) {
    this.extension = this.extension || [];
    const extensions: IExtension[] = this.extension;
    let notes = extensions.find(e => e.url === Globals.extensionUrls['extension-sd-notes']);

    if (!notes && value) {
      notes = {
        url: Globals.extensionUrls['extension-sd-notes'],
        valueMarkdown: value
      };
      extensions.push(notes);
    } else if (notes && !value) {
      const index = extensions.indexOf(notes);
      extensions.splice(index, index >= 0 ? 1 : 0);
    } else if (notes && value) {
      notes.valueMarkdown = value;
    }
  }

  get intro() {
    if (!this.extension) return '';
    const extensions: IExtension[] = this.extension;
    const intro = extensions.find(e => e.url === Globals.extensionUrls['extension-sd-intro']);
    return intro ? intro.valueMarkdown || '' : '';
  }

  set intro(value: string) {
    this.extension = this.extension || [];
    const extensions: IExtension[] = this.extension;
    let intro = extensions.find(e => e.url === Globals.extensionUrls['extension-sd-intro']);

    if (!intro && value) {
      intro = {
        url: Globals.extensionUrls['extension-sd-intro'],
        valueMarkdown: value
      };
      extensions.push(intro);
    } else if (intro && !value) {
      const index = extensions.indexOf(intro);
      extensions.splice(index, index >= 0 ? 1 : 0);
    } else if (intro && value) {
      intro.valueMarkdown = value;
    }
  }
}

export class ParametersParameterComponent extends BackboneElement {
  public name: string;
  public value?: Element;
  public resource?: Resource;
  public part?: ParametersParameterComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = new Resource(obj.resource);
      }
      if (obj.hasOwnProperty('part')) {
        this.part = [];
        for (const o of obj.part || []) {
          this.part.push(new ParametersParameterComponent(o));
        }
      }
    }
  }

}

export class Parameters extends Resource {
  public resourceType = 'Parameters';
  public parameter?: ParametersParameterComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('parameter')) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new ParametersParameterComponent(o));
        }
      }
    }
  }

}

export class Query extends Parameters {
  public resourceType = 'Query';

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class Flag extends DomainResource {
  public resourceType = 'Flag';
  public identifier?: Identifier[];
  public status: string;
  public category?: CodeableConcept[];
  public code: CodeableConcept;
  public subject: ResourceReference;
  public period?: Period;
  public encounter?: ResourceReference;
  public author?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
    }
  }

}

export class Alert extends Flag {
  public resourceType = 'Alert';

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class Quantity extends Element {
  public value?: number;
  public comparator?: string;
  public unit?: string;
  public system?: string;
  public code?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
      if (obj.hasOwnProperty('comparator')) {
        this.comparator = obj.comparator;
      }
      if (obj.hasOwnProperty('unit')) {
        this.unit = obj.unit;
      }
      if (obj.hasOwnProperty('system')) {
        this.system = obj.system;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
    }
  }

}

export class SimpleQuantity extends Quantity {

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class Range extends Element {
  public low?: Quantity;
  public high?: Quantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('low')) {
        this.low = new Quantity(obj.low);
      }
      if (obj.hasOwnProperty('high')) {
        this.high = new Quantity(obj.high);
      }
    }
  }

}

export class ObservationReferenceRangeComponent extends BackboneElement {
  public low?: SimpleQuantity;
  public high?: SimpleQuantity;
  public type?: CodeableConcept;
  public appliesTo?: CodeableConcept[];
  public age?: Range;
  public text?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('low')) {
        this.low = new SimpleQuantity(obj.low);
      }
      if (obj.hasOwnProperty('high')) {
        this.high = new SimpleQuantity(obj.high);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('appliesTo')) {
        this.appliesTo = [];
        for (const o of obj.appliesTo || []) {
          this.appliesTo.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('age')) {
        this.age = new Range(obj.age);
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
    }
  }

}

export class ObservationComponentComponent extends BackboneElement {
  public code: CodeableConcept;
  public value?: Element;
  public dataAbsentReason?: CodeableConcept;
  public interpretation?: CodeableConcept[];
  public referenceRange?: ObservationReferenceRangeComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
      if (obj.hasOwnProperty('dataAbsentReason')) {
        this.dataAbsentReason = new CodeableConcept(obj.dataAbsentReason);
      }
      if (obj.hasOwnProperty('interpretation')) {
        this.interpretation = [];
        for (const o of obj.interpretation || []) {
          this.interpretation.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('referenceRange')) {
        this.referenceRange = [];
        for (const o of obj.referenceRange || []) {
          this.referenceRange.push(new ObservationReferenceRangeComponent(o));
        }
      }
    }
  }

}

export class Observation extends DomainResource {
  public resourceType = 'Observation';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status: string;
  public category?: CodeableConcept[];
  public code: CodeableConcept;
  public subject?: ResourceReference;
  public focus?: ResourceReference[];
  public encounter?: ResourceReference;
  public effective?: Element;
  public issued?: Date;
  public performer?: ResourceReference[];
  public value?: Element;
  public dataAbsentReason?: CodeableConcept;
  public interpretation?: CodeableConcept[];
  public comment?: string;
  public bodySite?: CodeableConcept;
  public method?: CodeableConcept;
  public specimen?: ResourceReference;
  public device?: ResourceReference;
  public referenceRange?: ObservationReferenceRangeComponent[];
  public hasMember?: ResourceReference[];
  public derivedFrom?: ResourceReference[];
  public component?: ObservationComponentComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('focus')) {
        this.focus = [];
        for (const o of obj.focus || []) {
          this.focus.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.hasOwnProperty('effective')) {
        this.effective = new Element(obj.effective);
      }
      if (obj.hasOwnProperty('issued')) {
        this.issued = obj.issued;
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
      if (obj.hasOwnProperty('dataAbsentReason')) {
        this.dataAbsentReason = new CodeableConcept(obj.dataAbsentReason);
      }
      if (obj.hasOwnProperty('interpretation')) {
        this.interpretation = [];
        for (const o of obj.interpretation || []) {
          this.interpretation.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.hasOwnProperty('specimen')) {
        this.specimen = new ResourceReference(obj.specimen);
      }
      if (obj.hasOwnProperty('device')) {
        this.device = new ResourceReference(obj.device);
      }
      if (obj.hasOwnProperty('referenceRange')) {
        this.referenceRange = [];
        for (const o of obj.referenceRange || []) {
          this.referenceRange.push(new ObservationReferenceRangeComponent(o));
        }
      }
      if (obj.hasOwnProperty('hasMember')) {
        this.hasMember = [];
        for (const o of obj.hasMember || []) {
          this.hasMember.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('derivedFrom')) {
        this.derivedFrom = [];
        for (const o of obj.derivedFrom || []) {
          this.derivedFrom.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('component')) {
        this.component = [];
        for (const o of obj.component || []) {
          this.component.push(new ObservationComponentComponent(o));
        }
      }
    }
  }

}

export class BundleLinkComponent extends BackboneElement {
  public relation: string;
  public url: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('relation')) {
        this.relation = obj.relation;
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
    }
  }

}

export class BundleSearchComponent extends BackboneElement {
  public mode?: string;
  public score?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('score')) {
        this.score = obj.score;
      }
    }
  }

}

export class BundleRequestComponent extends BackboneElement {
  public method: string;
  public url: string;
  public ifNoneMatch?: string;
  public ifModifiedSince?: Date;
  public ifMatch?: string;
  public ifNoneExist?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('method')) {
        this.method = obj.method;
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('ifNoneMatch')) {
        this.ifNoneMatch = obj.ifNoneMatch;
      }
      if (obj.hasOwnProperty('ifModifiedSince')) {
        this.ifModifiedSince = obj.ifModifiedSince;
      }
      if (obj.hasOwnProperty('ifMatch')) {
        this.ifMatch = obj.ifMatch;
      }
      if (obj.hasOwnProperty('ifNoneExist')) {
        this.ifNoneExist = obj.ifNoneExist;
      }
    }
  }

}

export class BundleResponseComponent extends BackboneElement {
  public status: string;
  public location?: string;
  public etag?: string;
  public lastModified?: string;
  public outcome?: Resource;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('location')) {
        this.location = obj.location;
      }
      if (obj.hasOwnProperty('etag')) {
        this.etag = obj.etag;
      }
      if (obj.hasOwnProperty('lastModified')) {
        this.lastModified = obj.lastModified;
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = new Resource(obj.outcome);
      }
    }
  }

}

export class BundleEntryComponent extends BackboneElement {
  public link?: BundleLinkComponent[];
  public fullUrl?: string;
  public resource?: DomainResource;
  public search?: BundleSearchComponent;
  public request?: BundleRequestComponent;
  public response?: BundleResponseComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('link')) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new BundleLinkComponent(o));
        }
      }
      if (obj.hasOwnProperty('fullUrl')) {
        this.fullUrl = obj.fullUrl;
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = new DomainResource(obj.resource);
      }
      if (obj.hasOwnProperty('search')) {
        this.search = new BundleSearchComponent(obj.search);
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new BundleRequestComponent(obj.request);
      }
      if (obj.hasOwnProperty('response')) {
        this.response = new BundleResponseComponent(obj.response);
      }
    }
  }

}

export class Signature extends Element {
  public type: Coding[];
  public when: string;
  public who: ResourceReference;
  public onBehalfOf?: ResourceReference;
  public targetFormat?: string;
  public sigFormat?: string;
  public data?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('when')) {
        this.when = obj.when;
      }
      if (obj.hasOwnProperty('who')) {
        this.who = new ResourceReference(obj.who);
      }
      if (obj.hasOwnProperty('onBehalfOf')) {
        this.onBehalfOf = new ResourceReference(obj.onBehalfOf);
      }
      if (obj.hasOwnProperty('targetFormat')) {
        this.targetFormat = obj.targetFormat;
      }
      if (obj.hasOwnProperty('sigFormat')) {
        this.sigFormat = obj.sigFormat;
      }
      if (obj.hasOwnProperty('data')) {
        this.data = obj.data;
      }
    }
  }

}

export type BundleTypes = 'document'|'message'|'transaction'|'transaction-response'|'batch'|'batch-response'|'history'|'searchset'|'collection';

export class Bundle extends Resource implements IBundle {
  public resourceType = 'Bundle';
  public identifier?: Identifier;
  public type: BundleTypes;
  public timestamp?: string;
  public total?: number;
  public link?: BundleLinkComponent[];
  public entry?: BundleEntryComponent[];
  public signature?: Signature;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('timestamp')) {
        this.timestamp = obj.timestamp;
      }
      if (obj.hasOwnProperty('total')) {
        this.total = obj.total;
      }
      if (obj.hasOwnProperty('link')) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new BundleLinkComponent(o));
        }
      }
      if (obj.hasOwnProperty('entry')) {
        this.entry = [];
        for (const o of obj.entry || []) {
          this.entry.push(new BundleEntryComponent(o));
        }
      }
      if (obj.hasOwnProperty('signature')) {
        this.signature = new Signature(obj.signature);
      }
    }
  }

}

export class BundleExtensions {

  constructor(obj?: any) {
    if (obj) {
    }
  }

}

export class CodeSystemFilterComponent extends BackboneElement {
  public code: string;
  public description?: string;
  public operator: string[];
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('operator')) {
        this.operator = obj.operator;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class CodeSystemPropertyComponent extends BackboneElement {
  public code: string;
  public uri?: string;
  public description?: string;
  public type: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('uri')) {
        this.uri = obj.uri;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
    }
  }

}

export class CodeSystemDesignationComponent extends BackboneElement {
  public language?: string;
  public use?: Coding;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('language')) {
        this.language = obj.language;
      }
      if (obj.hasOwnProperty('use')) {
        this.use = new Coding(obj.use);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class CodeSystemConceptPropertyComponent extends BackboneElement {
  public code: string;
  public valueCode?: string;
  public valueCoding?: Coding;
  public valueString?: string;
  public valueInteger?: number;
  public valueBoolean?: boolean;
  public valueDateTime?: string;
  public valueDecimal?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }

      if (obj.hasOwnProperty('valueCode')) {
        this.valueCode = obj.valueCode;
      }

      if (obj.hasOwnProperty('valueCoding')) {
        this.valueCoding = new Coding(obj.valueCoding);
      }

      if (obj.hasOwnProperty('valueString')) {
        this.valueString = obj.valueString;
      }

      if (obj.hasOwnProperty('valueInteger')) {
        this.valueInteger = obj.valueInteger;
      }

      if (obj.hasOwnProperty('valueBoolean')) {
        this.valueBoolean = obj.valueBoolean;
      }

      if (obj.hasOwnProperty('valueDateTime')) {
        this.valueDateTime = obj.valueDateTime;
      }

      if (obj.hasOwnProperty('valueDecimal')) {
        this.valueDecimal = obj.valueDecimal;
      }
    }
  }

}

export class CodeSystemConceptDefinitionComponent extends BackboneElement {
  public code: string;
  public display?: string;
  public definition?: string;
  public designation?: CodeSystemDesignationComponent[];
  public property?: CodeSystemConceptPropertyComponent[];
  public concept?: CodeSystemConceptDefinitionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('designation')) {
        this.designation = [];
        for (const o of obj.designation || []) {
          this.designation.push(new CodeSystemDesignationComponent(o));
        }
      }
      if (obj.hasOwnProperty('property')) {
        this.property = [];
        for (const o of obj.property || []) {
          this.property.push(new CodeSystemConceptPropertyComponent(o));
        }
      }
      if (obj.hasOwnProperty('concept')) {
        this.concept = [];
        for (const o of obj.concept || []) {
          this.concept.push(new CodeSystemConceptDefinitionComponent(o));
        }
      }
    }
  }

}

export class CodeSystem extends DomainResource implements ICodeSystem {
  public resourceType = 'CodeSystem';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public caseSensitive?: boolean;
  public valueSet?: string;
  public hierarchyMeaning?: string;
  public compositional?: boolean;
  public versionNeeded?: boolean;
  public content = 'complete';
  public supplements?: string;
  public count?: number;
  public filter?: CodeSystemFilterComponent[];
  public property?: CodeSystemPropertyComponent[];
  public concept?: CodeSystemConceptDefinitionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('caseSensitive')) {
        this.caseSensitive = obj.caseSensitive;
      }
      if (obj.hasOwnProperty('valueSet')) {
        this.valueSet = obj.valueSet;
      }
      if (obj.hasOwnProperty('hierarchyMeaning')) {
        this.hierarchyMeaning = obj.hierarchyMeaning;
      }
      if (obj.hasOwnProperty('compositional')) {
        this.compositional = obj.compositional;
      }
      if (obj.hasOwnProperty('versionNeeded')) {
        this.versionNeeded = obj.versionNeeded;
      }
      if (obj.hasOwnProperty('content')) {
        this.content = obj.content;
      }
      if (obj.hasOwnProperty('supplements')) {
        this.supplements = obj.supplements;
      }
      if (obj.hasOwnProperty('count')) {
        this.count = obj.count;
      }
      if (obj.hasOwnProperty('filter')) {
        this.filter = [];
        for (const o of obj.filter || []) {
          this.filter.push(new CodeSystemFilterComponent(o));
        }
      }
      if (obj.hasOwnProperty('property')) {
        this.property = [];
        for (const o of obj.property || []) {
          this.property.push(new CodeSystemPropertyComponent(o));
        }
      }
      if (obj.hasOwnProperty('concept')) {
        this.concept = [];
        for (const o of obj.concept || []) {
          this.concept.push(new CodeSystemConceptDefinitionComponent(o));
        }
      }
    }
  }

}

export class CodeSystemExtensions {

  constructor(obj?: any) {
    if (obj) {
    }
  }

}

export class ConceptMapOtherElementComponent extends BackboneElement {
  public property: string;
  public system?: string;
  public value: string;
  public display?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('property')) {
        this.property = obj.property;
      }
      if (obj.hasOwnProperty('system')) {
        this.system = obj.system;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
    }
  }

}

export class ConceptMapTargetElementComponent extends BackboneElement {
  public code?: string;
  public display?: string;
  public equivalence: string;
  public comment?: string;
  public dependsOn?: ConceptMapOtherElementComponent[];
  public product?: ConceptMapOtherElementComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
      if (obj.hasOwnProperty('equivalence')) {
        this.equivalence = obj.equivalence;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('dependsOn')) {
        this.dependsOn = [];
        for (const o of obj.dependsOn || []) {
          this.dependsOn.push(new ConceptMapOtherElementComponent(o));
        }
      }
      if (obj.hasOwnProperty('product')) {
        this.product = [];
        for (const o of obj.product || []) {
          this.product.push(new ConceptMapOtherElementComponent(o));
        }
      }
    }
  }

}

export class ConceptMapSourceElementComponent extends BackboneElement {
  public code?: string;
  public display?: string;
  public target?: ConceptMapTargetElementComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
      if (obj.hasOwnProperty('target')) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new ConceptMapTargetElementComponent(o));
        }
      }
    }
  }

}

export class ConceptMapUnmappedComponent extends BackboneElement {
  public mode: string;
  public code?: string;
  public display?: string;
  public url?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
    }
  }

}

export class ConceptMapGroupComponent extends BackboneElement {
  public source?: string;
  public sourceVersion?: string;
  public target?: string;
  public targetVersion?: string;
  public element: ConceptMapSourceElementComponent[];
  public unmapped?: ConceptMapUnmappedComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('source')) {
        this.source = obj.source;
      }
      if (obj.hasOwnProperty('sourceVersion')) {
        this.sourceVersion = obj.sourceVersion;
      }
      if (obj.hasOwnProperty('target')) {
        this.target = obj.target;
      }
      if (obj.hasOwnProperty('targetVersion')) {
        this.targetVersion = obj.targetVersion;
      }
      if (obj.hasOwnProperty('element')) {
        this.element = [];
        for (const o of obj.element || []) {
          this.element.push(new ConceptMapSourceElementComponent(o));
        }
      }
      if (obj.hasOwnProperty('unmapped')) {
        this.unmapped = new ConceptMapUnmappedComponent(obj.unmapped);
      }
    }
  }

}

export class ConceptMap extends DomainResource {
  public resourceType = 'ConceptMap';
  public url?: string;
  public identifier?: Identifier;
  public version?: string;
  public name?: string;
  public title?: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public source?: Element;
  public target?: Element;
  public group?: ConceptMapGroupComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new Element(obj.source);
      }
      if (obj.hasOwnProperty('target')) {
        this.target = new Element(obj.target);
      }
      if (obj.hasOwnProperty('group')) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new ConceptMapGroupComponent(o));
        }
      }
    }
  }

}

export class ElementDefinitionExtensions {

  constructor(obj?: any) {
    if (obj) {
    }
  }

}

export class AccountCoverageComponent extends BackboneElement {
  public coverage: ResourceReference;
  public priority?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('coverage')) {
        this.coverage = new ResourceReference(obj.coverage);
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
    }
  }

}

export class AccountGuarantorComponent extends BackboneElement {
  public party: ResourceReference;
  public onHold?: boolean;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('party')) {
        this.party = new ResourceReference(obj.party);
      }
      if (obj.hasOwnProperty('onHold')) {
        this.onHold = obj.onHold;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class Account extends DomainResource {
  public resourceType = 'Account';
  public identifier?: Identifier[];
  public status: string;
  public type?: CodeableConcept;
  public name?: string;
  public subject?: ResourceReference[];
  public servicePeriod?: Period;
  public coverage?: AccountCoverageComponent[];
  public owner?: ResourceReference;
  public description?: string;
  public guarantor?: AccountGuarantorComponent[];
  public partOf?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = [];
        for (const o of obj.subject || []) {
          this.subject.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('servicePeriod')) {
        this.servicePeriod = new Period(obj.servicePeriod);
      }
      if (obj.hasOwnProperty('coverage')) {
        this.coverage = [];
        for (const o of obj.coverage || []) {
          this.coverage.push(new AccountCoverageComponent(o));
        }
      }
      if (obj.hasOwnProperty('owner')) {
        this.owner = new ResourceReference(obj.owner);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('guarantor')) {
        this.guarantor = [];
        for (const o of obj.guarantor || []) {
          this.guarantor.push(new AccountGuarantorComponent(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = new ResourceReference(obj.partOf);
      }
    }
  }

}

export class Attachment extends Element implements IAttachment {
  public contentType?: string;
  public language?: string;
  public data?: string;
  public url?: string;
  public size?: number;
  public hash?: string;
  public title?: string;
  public creation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('contentType')) {
        this.contentType = obj.contentType;
      }
      if (obj.hasOwnProperty('language')) {
        this.language = obj.language;
      }
      if (obj.hasOwnProperty('data')) {
        this.data = obj.data;
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('size')) {
        this.size = obj.size;
      }
      if (obj.hasOwnProperty('hash')) {
        this.hash = obj.hash;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('creation')) {
        this.creation = obj.creation;
      }
    }
  }

}

export class RelatedArtifact extends Element {
  public type: string;
  public display?: string;
  public citation?: string;
  public url?: string;
  public document?: Attachment;
  public resource?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
      if (obj.hasOwnProperty('citation')) {
        this.citation = obj.citation;
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('document')) {
        this.document = new Attachment(obj.document);
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = obj.resource;
      }
    }
  }

}

export class ActivityDefinitionParticipantComponent extends BackboneElement {
  public type: string;
  public role?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
    }
  }

}

export class TimingRepeatComponent extends Element {
  public bounds?: Element;
  public count?: number;
  public countMax?: number;
  public duration?: number;
  public durationMax?: number;
  public durationUnit?: string;
  public frequency?: number;
  public frequencyMax?: number;
  public period?: number;
  public periodMax?: number;
  public periodUnit?: string;
  public dayOfWeek?: string[];
  public timeOfDay?: string[];
  public when?: string[];
  public offset?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('bounds')) {
        this.bounds = new Element(obj.bounds);
      }
      if (obj.hasOwnProperty('count')) {
        this.count = obj.count;
      }
      if (obj.hasOwnProperty('countMax')) {
        this.countMax = obj.countMax;
      }
      if (obj.hasOwnProperty('duration')) {
        this.duration = obj.duration;
      }
      if (obj.hasOwnProperty('durationMax')) {
        this.durationMax = obj.durationMax;
      }
      if (obj.hasOwnProperty('durationUnit')) {
        this.durationUnit = obj.durationUnit;
      }
      if (obj.hasOwnProperty('frequency')) {
        this.frequency = obj.frequency;
      }
      if (obj.hasOwnProperty('frequencyMax')) {
        this.frequencyMax = obj.frequencyMax;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = obj.period;
      }
      if (obj.hasOwnProperty('periodMax')) {
        this.periodMax = obj.periodMax;
      }
      if (obj.hasOwnProperty('periodUnit')) {
        this.periodUnit = obj.periodUnit;
      }
      if (obj.hasOwnProperty('dayOfWeek')) {
        this.dayOfWeek = obj.dayOfWeek;
      }
      if (obj.hasOwnProperty('timeOfDay')) {
        this.timeOfDay = obj.timeOfDay;
      }
      if (obj.hasOwnProperty('when')) {
        this.when = obj.when;
      }
      if (obj.hasOwnProperty('offset')) {
        this.offset = obj.offset;
      }
    }
  }

}

export class Timing extends BackboneElement {
  public event?: string[];
  public repeat?: TimingRepeatComponent;
  public code?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('event')) {
        this.event = obj.event;
      }
      if (obj.hasOwnProperty('repeat')) {
        this.repeat = new TimingRepeatComponent(obj.repeat);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
    }
  }

}

export class DosageDoseAndRateComponent extends Element {
  public type: CodeableConcept;
  public dose?: Element;
  public rate?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('dose')) {
        this.dose = new Element(obj.dose);
      }
      if (obj.hasOwnProperty('rate')) {
        this.rate = new Element(obj.rate);
      }
    }
  }

}

export class Ratio extends Element {
  public numerator?: Quantity;
  public denominator?: Quantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('numerator')) {
        this.numerator = new Quantity(obj.numerator);
      }
      if (obj.hasOwnProperty('denominator')) {
        this.denominator = new Quantity(obj.denominator);
      }
    }
  }

}

export class Dosage extends BackboneElement {
  public sequence?: number;
  public text?: string;
  public additionalInstruction?: CodeableConcept[];
  public patientInstruction?: string;
  public timing?: Timing;
  public asNeeded?: Element;
  public site?: CodeableConcept;
  public route?: CodeableConcept;
  public method?: CodeableConcept;
  public doseAndRate?: DosageDoseAndRateComponent[];
  public maxDosePerPeriod?: Ratio;
  public maxDosePerAdministration?: Quantity;
  public maxDosePerLifetime?: Quantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('additionalInstruction')) {
        this.additionalInstruction = [];
        for (const o of obj.additionalInstruction || []) {
          this.additionalInstruction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('patientInstruction')) {
        this.patientInstruction = obj.patientInstruction;
      }
      if (obj.hasOwnProperty('timing')) {
        this.timing = new Timing(obj.timing);
      }
      if (obj.hasOwnProperty('asNeeded')) {
        this.asNeeded = new Element(obj.asNeeded);
      }
      if (obj.hasOwnProperty('site')) {
        this.site = new CodeableConcept(obj.site);
      }
      if (obj.hasOwnProperty('route')) {
        this.route = new CodeableConcept(obj.route);
      }
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.hasOwnProperty('doseAndRate')) {
        this.doseAndRate = [];
        for (const o of obj.doseAndRate || []) {
          this.doseAndRate.push(new DosageDoseAndRateComponent(o));
        }
      }
      if (obj.hasOwnProperty('maxDosePerPeriod')) {
        this.maxDosePerPeriod = new Ratio(obj.maxDosePerPeriod);
      }
      if (obj.hasOwnProperty('maxDosePerAdministration')) {
        this.maxDosePerAdministration = new Quantity(obj.maxDosePerAdministration);
      }
      if (obj.hasOwnProperty('maxDosePerLifetime')) {
        this.maxDosePerLifetime = new Quantity(obj.maxDosePerLifetime);
      }
    }
  }

}

export class Expression extends Element {
  public description?: string;
  public name?: string;
  public language: string;
  public expression?: string;
  public reference?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('language')) {
        this.language = obj.language;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = obj.reference;
      }
    }
  }

}

export class ActivityDefinitionDynamicValueComponent extends BackboneElement {
  public path: string;
  public expression: Expression;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = new Expression(obj.expression);
      }
    }
  }

}

export class ActivityDefinition extends DomainResource {
  public resourceType = 'ActivityDefinition';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public subtitle?: string;
  public status: string;
  public experimental?: boolean;
  public subject?: Element;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public usage?: string;
  public copyright?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public topic?: CodeableConcept[];
  public author?: ContactDetail[];
  public editor?: ContactDetail[];
  public reviewer?: ContactDetail[];
  public endorser?: ContactDetail[];
  public relatedArtifact?: RelatedArtifact[];
  public library?: string[];
  public kind?: string;
  public profile?: string;
  public code?: CodeableConcept;
  public intent?: string;
  public priority?: string;
  public doNotPerform?: boolean;
  public timing?: Element;
  public location?: ResourceReference;
  public participant?: ActivityDefinitionParticipantComponent[];
  public product?: Element;
  public quantity?: SimpleQuantity;
  public dosage?: Dosage[];
  public bodySite?: CodeableConcept[];
  public specimenRequirement?: ResourceReference[];
  public observationRequirement?: ResourceReference[];
  public observationResultRequirement?: ResourceReference[];
  public transform?: string;
  public dynamicValue?: ActivityDefinitionDynamicValueComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('subtitle')) {
        this.subtitle = obj.subtitle;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new Element(obj.subject);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('usage')) {
        this.usage = obj.usage;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('approvalDate')) {
        this.approvalDate = obj.approvalDate;
      }
      if (obj.hasOwnProperty('lastReviewDate')) {
        this.lastReviewDate = obj.lastReviewDate;
      }
      if (obj.hasOwnProperty('effectivePeriod')) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.hasOwnProperty('topic')) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('author')) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('editor')) {
        this.editor = [];
        for (const o of obj.editor || []) {
          this.editor.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('reviewer')) {
        this.reviewer = [];
        for (const o of obj.reviewer || []) {
          this.reviewer.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('endorser')) {
        this.endorser = [];
        for (const o of obj.endorser || []) {
          this.endorser.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('relatedArtifact')) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.hasOwnProperty('library')) {
        this.library = obj.library;
      }
      if (obj.hasOwnProperty('kind')) {
        this.kind = obj.kind;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('intent')) {
        this.intent = obj.intent;
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('doNotPerform')) {
        this.doNotPerform = obj.doNotPerform;
      }
      if (obj.hasOwnProperty('timing')) {
        this.timing = new Element(obj.timing);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('participant')) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new ActivityDefinitionParticipantComponent(o));
        }
      }
      if (obj.hasOwnProperty('product')) {
        this.product = new Element(obj.product);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('dosage')) {
        this.dosage = [];
        for (const o of obj.dosage || []) {
          this.dosage.push(new Dosage(o));
        }
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = [];
        for (const o of obj.bodySite || []) {
          this.bodySite.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specimenRequirement')) {
        this.specimenRequirement = [];
        for (const o of obj.specimenRequirement || []) {
          this.specimenRequirement.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('observationRequirement')) {
        this.observationRequirement = [];
        for (const o of obj.observationRequirement || []) {
          this.observationRequirement.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('observationResultRequirement')) {
        this.observationResultRequirement = [];
        for (const o of obj.observationResultRequirement || []) {
          this.observationResultRequirement.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('transform')) {
        this.transform = obj.transform;
      }
      if (obj.hasOwnProperty('dynamicValue')) {
        this.dynamicValue = [];
        for (const o of obj.dynamicValue || []) {
          this.dynamicValue.push(new ActivityDefinitionDynamicValueComponent(o));
        }
      }
    }
  }

}

export class Address extends Element {
  public use?: string;
  public type?: string;
  public text?: string;
  public line?: string[];
  public city?: string;
  public district?: string;
  public state?: string;
  public postalCode?: string;
  public country?: string;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('line')) {
        this.line = obj.line;
      }
      if (obj.hasOwnProperty('city')) {
        this.city = obj.city;
      }
      if (obj.hasOwnProperty('district')) {
        this.district = obj.district;
      }
      if (obj.hasOwnProperty('state')) {
        this.state = obj.state;
      }
      if (obj.hasOwnProperty('postalCode')) {
        this.postalCode = obj.postalCode;
      }
      if (obj.hasOwnProperty('country')) {
        this.country = obj.country;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class AdverseEventCausalityComponent extends BackboneElement {
  public assessment?: CodeableConcept;
  public productRelatedness?: string;
  public author?: ResourceReference;
  public method?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('assessment')) {
        this.assessment = new CodeableConcept(obj.assessment);
      }
      if (obj.hasOwnProperty('productRelatedness')) {
        this.productRelatedness = obj.productRelatedness;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
    }
  }

}

export class AdverseEventSuspectEntityComponent extends BackboneElement {
  public instance: ResourceReference;
  public causality?: AdverseEventCausalityComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('instance')) {
        this.instance = new ResourceReference(obj.instance);
      }
      if (obj.hasOwnProperty('causality')) {
        this.causality = [];
        for (const o of obj.causality || []) {
          this.causality.push(new AdverseEventCausalityComponent(o));
        }
      }
    }
  }

}

export class AdverseEvent extends DomainResource {
  public resourceType = 'AdverseEvent';
  public identifier?: Identifier;
  public actuality: string;
  public category?: CodeableConcept[];
  public event?: CodeableConcept;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public date?: Date;
  public detected?: Date;
  public recordedDate?: Date;
  public resultingCondition?: ResourceReference[];
  public location?: ResourceReference;
  public seriousness?: CodeableConcept;
  public severity?: CodeableConcept;
  public outcome?: CodeableConcept;
  public recorder?: ResourceReference;
  public contributor?: ResourceReference[];
  public suspectEntity?: AdverseEventSuspectEntityComponent[];
  public subjectMedicalHistory?: ResourceReference[];
  public referenceDocument?: ResourceReference[];
  public study?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('actuality')) {
        this.actuality = obj.actuality;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('event')) {
        this.event = new CodeableConcept(obj.event);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('detected')) {
        this.detected = obj.detected;
      }
      if (obj.hasOwnProperty('recordedDate')) {
        this.recordedDate = obj.recordedDate;
      }
      if (obj.hasOwnProperty('resultingCondition')) {
        this.resultingCondition = [];
        for (const o of obj.resultingCondition || []) {
          this.resultingCondition.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('seriousness')) {
        this.seriousness = new CodeableConcept(obj.seriousness);
      }
      if (obj.hasOwnProperty('severity')) {
        this.severity = new CodeableConcept(obj.severity);
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.hasOwnProperty('recorder')) {
        this.recorder = new ResourceReference(obj.recorder);
      }
      if (obj.hasOwnProperty('contributor')) {
        this.contributor = [];
        for (const o of obj.contributor || []) {
          this.contributor.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('suspectEntity')) {
        this.suspectEntity = [];
        for (const o of obj.suspectEntity || []) {
          this.suspectEntity.push(new AdverseEventSuspectEntityComponent(o));
        }
      }
      if (obj.hasOwnProperty('subjectMedicalHistory')) {
        this.subjectMedicalHistory = [];
        for (const o of obj.subjectMedicalHistory || []) {
          this.subjectMedicalHistory.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('referenceDocument')) {
        this.referenceDocument = [];
        for (const o of obj.referenceDocument || []) {
          this.referenceDocument.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('study')) {
        this.study = [];
        for (const o of obj.study || []) {
          this.study.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class Age extends Quantity {

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class Annotation extends Element {
  public author?: Element;
  public time?: string;
  public text: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('author')) {
        this.author = new Element(obj.author);
      }
      if (obj.hasOwnProperty('time')) {
        this.time = obj.time;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
    }
  }

}

export class AllergyIntoleranceReactionComponent extends BackboneElement {
  public substance?: CodeableConcept;
  public manifestation: CodeableConcept[];
  public description?: string;
  public onset?: Date;
  public severity?: string;
  public exposureRoute?: CodeableConcept;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('substance')) {
        this.substance = new CodeableConcept(obj.substance);
      }
      if (obj.hasOwnProperty('manifestation')) {
        this.manifestation = [];
        for (const o of obj.manifestation || []) {
          this.manifestation.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('onset')) {
        this.onset = obj.onset;
      }
      if (obj.hasOwnProperty('severity')) {
        this.severity = obj.severity;
      }
      if (obj.hasOwnProperty('exposureRoute')) {
        this.exposureRoute = new CodeableConcept(obj.exposureRoute);
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class AllergyIntolerance extends DomainResource {
  public resourceType = 'AllergyIntolerance';
  public identifier?: Identifier[];
  public clinicalStatus?: string;
  public verificationStatus?: string;
  public type?: string;
  public category?: string[];
  public criticality?: string;
  public code?: CodeableConcept;
  public patient: ResourceReference;
  public encounter?: ResourceReference;
  public onset?: Element;
  public recordedDate?: Date;
  public recorder?: ResourceReference;
  public asserter?: ResourceReference;
  public lastOccurrence?: Date;
  public note?: Annotation[];
  public reaction?: AllergyIntoleranceReactionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('clinicalStatus')) {
        this.clinicalStatus = obj.clinicalStatus;
      }
      if (obj.hasOwnProperty('verificationStatus')) {
        this.verificationStatus = obj.verificationStatus;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = obj.category;
      }
      if (obj.hasOwnProperty('criticality')) {
        this.criticality = obj.criticality;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.hasOwnProperty('onset')) {
        this.onset = new Element(obj.onset);
      }
      if (obj.hasOwnProperty('recordedDate')) {
        this.recordedDate = obj.recordedDate;
      }
      if (obj.hasOwnProperty('recorder')) {
        this.recorder = new ResourceReference(obj.recorder);
      }
      if (obj.hasOwnProperty('asserter')) {
        this.asserter = new ResourceReference(obj.asserter);
      }
      if (obj.hasOwnProperty('lastOccurrence')) {
        this.lastOccurrence = obj.lastOccurrence;
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('reaction')) {
        this.reaction = [];
        for (const o of obj.reaction || []) {
          this.reaction.push(new AllergyIntoleranceReactionComponent(o));
        }
      }
    }
  }

}

export class AppointmentParticipantComponent extends BackboneElement {
  public type?: CodeableConcept[];
  public actor?: ResourceReference;
  public required?: string;
  public status: string;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = new ResourceReference(obj.actor);
      }
      if (obj.hasOwnProperty('required')) {
        this.required = obj.required;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class Appointment extends DomainResource {
  public resourceType = 'Appointment';
  public identifier?: Identifier[];
  public status: string;
  public serviceCategory?: CodeableConcept[];
  public serviceType?: CodeableConcept[];
  public specialty?: CodeableConcept[];
  public appointmentType?: CodeableConcept;
  public reason?: CodeableConcept[];
  public indication?: ResourceReference[];
  public priority?: number;
  public description?: string;
  public supportingInformation?: ResourceReference[];
  public start?: Date;
  public end?: Date;
  public minutesDuration?: number;
  public slot?: ResourceReference[];
  public created?: Date;
  public comment?: string;
  public patientInstruction?: string;
  public basedOn?: ResourceReference[];
  public participant: AppointmentParticipantComponent[];
  public requestedPeriod?: Period[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('serviceCategory')) {
        this.serviceCategory = [];
        for (const o of obj.serviceCategory || []) {
          this.serviceCategory.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('serviceType')) {
        this.serviceType = [];
        for (const o of obj.serviceType || []) {
          this.serviceType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specialty')) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('appointmentType')) {
        this.appointmentType = new CodeableConcept(obj.appointmentType);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('indication')) {
        this.indication = [];
        for (const o of obj.indication || []) {
          this.indication.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('supportingInformation')) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('start')) {
        this.start = obj.start;
      }
      if (obj.hasOwnProperty('end')) {
        this.end = obj.end;
      }
      if (obj.hasOwnProperty('minutesDuration')) {
        this.minutesDuration = obj.minutesDuration;
      }
      if (obj.hasOwnProperty('slot')) {
        this.slot = [];
        for (const o of obj.slot || []) {
          this.slot.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('patientInstruction')) {
        this.patientInstruction = obj.patientInstruction;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('participant')) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new AppointmentParticipantComponent(o));
        }
      }
      if (obj.hasOwnProperty('requestedPeriod')) {
        this.requestedPeriod = [];
        for (const o of obj.requestedPeriod || []) {
          this.requestedPeriod.push(new Period(o));
        }
      }
    }
  }

}

export class AppointmentResponse extends DomainResource {
  public resourceType = 'AppointmentResponse';
  public identifier?: Identifier[];
  public appointment: ResourceReference;
  public start?: Date;
  public end?: Date;
  public participantType?: CodeableConcept[];
  public actor?: ResourceReference;
  public participantStatus: string;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('appointment')) {
        this.appointment = new ResourceReference(obj.appointment);
      }
      if (obj.hasOwnProperty('start')) {
        this.start = obj.start;
      }
      if (obj.hasOwnProperty('end')) {
        this.end = obj.end;
      }
      if (obj.hasOwnProperty('participantType')) {
        this.participantType = [];
        for (const o of obj.participantType || []) {
          this.participantType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = new ResourceReference(obj.actor);
      }
      if (obj.hasOwnProperty('participantStatus')) {
        this.participantStatus = obj.participantStatus;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
    }
  }

}

export class AuditEventNetworkComponent extends BackboneElement implements INetworkComponent {
  public address?: string;
  public type?: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('address')) {
        this.address = obj.address;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new Coding(obj.type);
      }
    }
  }

}

export class AuditEventAgentComponent extends BackboneElement implements IAgentComponent {
  public type?: CodeableConcept;
  public role?: CodeableConcept[];
  public who?: ResourceReference;
  public altId?: string;
  public name?: string;
  public requestor: boolean;
  public location?: ResourceReference;
  public policy?: string[];
  public media?: Coding;
  public network?: AuditEventNetworkComponent;
  public purposeOfUse?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('role')) {
        this.role = [];
        for (const o of obj.role || []) {
          this.role.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('who')) {
        this.who = new ResourceReference(obj.who);
      }
      if (obj.hasOwnProperty('altId')) {
        this.altId = obj.altId;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('requestor')) {
        this.requestor = obj.requestor;
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('policy')) {
        this.policy = obj.policy;
      }
      if (obj.hasOwnProperty('media')) {
        this.media = new Coding(obj.media);
      }
      if (obj.hasOwnProperty('network')) {
        this.network = new AuditEventNetworkComponent(obj.network);
      }
      if (obj.hasOwnProperty('purposeOfUse')) {
        this.purposeOfUse = [];
        for (const o of obj.purposeOfUse || []) {
          this.purposeOfUse.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class AuditEventSourceComponent extends BackboneElement {
  public site?: string;
  public observer: ResourceReference;
  public type?: Coding[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('site')) {
        this.site = obj.site;
      }
      if (obj.hasOwnProperty('observer')) {
        this.observer = new ResourceReference(obj.observer);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new Coding(o));
        }
      }
    }
  }

}

export class AuditEventDetailComponent extends BackboneElement implements IDetailComponent {
  public type: string;
  public valueString: string;
  public valueBase64Binary: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('valueString')) {
        this.valueString = obj.valueString;
      }
      if (obj.hasOwnProperty('valueBase64Binary')) {
        this.valueBase64Binary = obj.valueBase64Binary;
      }
    }
  }

}

export class AuditEventEntityComponent extends BackboneElement implements IEntityComponent {
  public what?: ResourceReference;
  public type?: Coding;
  public role?: Coding;
  public lifecycle?: Coding;
  public securityLabel?: Coding[];
  public name?: string;
  public description?: string;
  public query?: string;
  public detail?: AuditEventDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('what')) {
        this.what = new ResourceReference(obj.what);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new Coding(obj.type);
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new Coding(obj.role);
      }
      if (obj.hasOwnProperty('lifecycle')) {
        this.lifecycle = new Coding(obj.lifecycle);
      }
      if (obj.hasOwnProperty('securityLabel')) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('query')) {
        this.query = obj.query;
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new AuditEventDetailComponent(o));
        }
      }
    }
  }

}

export class AuditEvent extends DomainResource implements IAuditEvent {
  public resourceType = 'AuditEvent';
  public type: Coding;
  public subtype?: Coding[];
  public action?: string;
  public period?: Period;
  public recorded: string;
  public outcome?: Coding;
  public outcomeDesc?: string;
  public purposeOfEvent?: CodeableConcept[];
  public agent: AuditEventAgentComponent[];
  public source: AuditEventSourceComponent;
  public entity?: AuditEventEntityComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new Coding(obj.type);
      }
      if (obj.hasOwnProperty('subtype')) {
        this.subtype = [];
        for (const o of obj.subtype || []) {
          this.subtype.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('action')) {
        this.action = obj.action;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('recorded')) {
        this.recorded = obj.recorded;
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = obj.outcome;
      }
      if (obj.hasOwnProperty('outcomeDesc')) {
        this.outcomeDesc = obj.outcomeDesc;
      }
      if (obj.hasOwnProperty('purposeOfEvent')) {
        this.purposeOfEvent = [];
        for (const o of obj.purposeOfEvent || []) {
          this.purposeOfEvent.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('agent')) {
        this.agent = [];
        for (const o of obj.agent || []) {
          this.agent.push(new AuditEventAgentComponent(o));
        }
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new AuditEventSourceComponent(obj.source);
      }
      if (obj.hasOwnProperty('entity')) {
        this.entity = [];
        for (const o of obj.entity || []) {
          this.entity.push(new AuditEventEntityComponent(o));
        }
      }
    }
  }

}

export class Basic extends DomainResource {
  public resourceType = 'Basic';
  public identifier?: Identifier[];
  public code: CodeableConcept;
  public subject?: ResourceReference;
  public created?: Date;
  public author?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
    }
  }

}

export class BiologicallyDerivedProductCollectionComponent extends BackboneElement {
  public collector?: ResourceReference;
  public source?: ResourceReference;
  public collected?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('collector')) {
        this.collector = new ResourceReference(obj.collector);
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.hasOwnProperty('collected')) {
        this.collected = new Element(obj.collected);
      }
    }
  }

}

export class BiologicallyDerivedProductProcessingComponent extends BackboneElement {
  public description?: string;
  public procedure?: CodeableConcept;
  public additive?: ResourceReference;
  public time?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('procedure')) {
        this.procedure = new CodeableConcept(obj.procedure);
      }
      if (obj.hasOwnProperty('additive')) {
        this.additive = new ResourceReference(obj.additive);
      }
      if (obj.hasOwnProperty('time')) {
        this.time = new Element(obj.time);
      }
    }
  }

}

export class BiologicallyDerivedProductManipulationComponent extends BackboneElement {
  public description?: string;
  public time?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('time')) {
        this.time = new Element(obj.time);
      }
    }
  }

}

export class BiologicallyDerivedProductStorageComponent extends BackboneElement {
  public description?: string;
  public temperature?: number;
  public scale?: string;
  public duration?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('temperature')) {
        this.temperature = obj.temperature;
      }
      if (obj.hasOwnProperty('scale')) {
        this.scale = obj.scale;
      }
      if (obj.hasOwnProperty('duration')) {
        this.duration = new Period(obj.duration);
      }
    }
  }

}

export class BiologicallyDerivedProduct extends DomainResource {
  public resourceType = 'BiologicallyDerivedProduct';
  public identifier?: Identifier[];
  public productCategory?: string;
  public productCode?: CodeableConcept;
  public status?: string;
  public request?: ResourceReference[];
  public quantity?: number;
  public parent?: ResourceReference;
  public collection?: BiologicallyDerivedProductCollectionComponent;
  public processing?: BiologicallyDerivedProductProcessingComponent[];
  public manipulation?: BiologicallyDerivedProductManipulationComponent;
  public storage?: BiologicallyDerivedProductStorageComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('productCategory')) {
        this.productCategory = obj.productCategory;
      }
      if (obj.hasOwnProperty('productCode')) {
        this.productCode = new CodeableConcept(obj.productCode);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('request')) {
        this.request = [];
        for (const o of obj.request || []) {
          this.request.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = obj.quantity;
      }
      if (obj.hasOwnProperty('parent')) {
        this.parent = new ResourceReference(obj.parent);
      }
      if (obj.hasOwnProperty('collection')) {
        this.collection = new BiologicallyDerivedProductCollectionComponent(obj.collection);
      }
      if (obj.hasOwnProperty('processing')) {
        this.processing = [];
        for (const o of obj.processing || []) {
          this.processing.push(new BiologicallyDerivedProductProcessingComponent(o));
        }
      }
      if (obj.hasOwnProperty('manipulation')) {
        this.manipulation = new BiologicallyDerivedProductManipulationComponent(obj.manipulation);
      }
      if (obj.hasOwnProperty('storage')) {
        this.storage = [];
        for (const o of obj.storage || []) {
          this.storage.push(new BiologicallyDerivedProductStorageComponent(o));
        }
      }
    }
  }

}

export class BodySite {

  constructor(obj?: any) {
    if (obj) {
    }
  }

}

export class BodyStructure extends DomainResource {
  public resourceType = 'BodyStructure';
  public identifier?: Identifier[];
  public active?: boolean;
  public morphology?: CodeableConcept;
  public location?: CodeableConcept;
  public locationQualifier?: CodeableConcept[];
  public description?: string;
  public image?: Attachment[];
  public patient: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('morphology')) {
        this.morphology = new CodeableConcept(obj.morphology);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new CodeableConcept(obj.location);
      }
      if (obj.hasOwnProperty('locationQualifier')) {
        this.locationQualifier = [];
        for (const o of obj.locationQualifier || []) {
          this.locationQualifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('image')) {
        this.image = [];
        for (const o of obj.image || []) {
          this.image.push(new Attachment(o));
        }
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
    }
  }

}

export class CapabilityStatementSoftwareComponent extends BackboneElement {
  public name: string;
  public version?: string;
  public releaseDate?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('releaseDate')) {
        this.releaseDate = obj.releaseDate;
      }
    }
  }

}

export class CapabilityStatementImplementationComponent extends BackboneElement {
  public description: string;
  public url?: string;
  public custodian?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('custodian')) {
        this.custodian = new ResourceReference(obj.custodian);
      }
    }
  }

}

export class CapabilityStatementSecurityComponent extends BackboneElement {
  public cors?: boolean;
  public service?: CodeableConcept[];
  public description?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('cors')) {
        this.cors = obj.cors;
      }
      if (obj.hasOwnProperty('service')) {
        this.service = [];
        for (const o of obj.service || []) {
          this.service.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
    }
  }

}

export class CapabilityStatementResourceInteractionComponent extends BackboneElement {
  public code: string;
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class CapabilityStatementSearchParamComponent extends BackboneElement {
  public name: string;
  public definition?: string;
  public type: 'number'|'date'|'string'|'token'|'reference'|'composite'|'quantity'|'uri'|'special';
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class CapabilityStatementOperationComponent extends BackboneElement {
  public name: string;
  public definition: string;
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class CapabilityStatementResourceComponent extends BackboneElement {
  public type: string;
  public profile?: string;
  public supportedProfile?: string[];
  public documentation?: string;
  public interaction?: CapabilityStatementResourceInteractionComponent[];
  public versioning?: string;
  public readHistory?: boolean;
  public updateCreate?: boolean;
  public conditionalCreate?: boolean;
  public conditionalRead?: string;
  public conditionalUpdate?: boolean;
  public conditionalDelete?: string;
  public referencePolicy?: string[];
  public searchInclude?: string[];
  public searchRevInclude?: string[];
  public searchParam?: CapabilityStatementSearchParamComponent[];
  public operation?: CapabilityStatementOperationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
      if (obj.hasOwnProperty('supportedProfile')) {
        this.supportedProfile = obj.supportedProfile;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
      if (obj.hasOwnProperty('interaction')) {
        this.interaction = [];
        for (const o of obj.interaction || []) {
          this.interaction.push(new CapabilityStatementResourceInteractionComponent(o));
        }
      }
      if (obj.hasOwnProperty('versioning')) {
        this.versioning = obj.versioning;
      }
      if (obj.hasOwnProperty('readHistory')) {
        this.readHistory = obj.readHistory;
      }
      if (obj.hasOwnProperty('updateCreate')) {
        this.updateCreate = obj.updateCreate;
      }
      if (obj.hasOwnProperty('conditionalCreate')) {
        this.conditionalCreate = obj.conditionalCreate;
      }
      if (obj.hasOwnProperty('conditionalRead')) {
        this.conditionalRead = obj.conditionalRead;
      }
      if (obj.hasOwnProperty('conditionalUpdate')) {
        this.conditionalUpdate = obj.conditionalUpdate;
      }
      if (obj.hasOwnProperty('conditionalDelete')) {
        this.conditionalDelete = obj.conditionalDelete;
      }
      if (obj.hasOwnProperty('referencePolicy')) {
        this.referencePolicy = obj.referencePolicy;
      }
      if (obj.hasOwnProperty('searchInclude')) {
        this.searchInclude = obj.searchInclude;
      }
      if (obj.hasOwnProperty('searchRevInclude')) {
        this.searchRevInclude = obj.searchRevInclude;
      }
      if (obj.hasOwnProperty('searchParam')) {
        this.searchParam = [];
        for (const o of obj.searchParam || []) {
          this.searchParam.push(new CapabilityStatementSearchParamComponent(o));
        }
      }
      if (obj.hasOwnProperty('operation')) {
        this.operation = [];
        for (const o of obj.operation || []) {
          this.operation.push(new CapabilityStatementOperationComponent(o));
        }
      }
    }
  }

}

export class CapabilityStatementSystemInteractionComponent extends BackboneElement {
  public code: 'read'|'vread'|'update'|'patch'|'delete'|'history-instance'|'history-type'|'create'|'search-type';
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class CapabilityStatementRestComponent extends BackboneElement {
  public mode: string;
  public documentation?: string;
  public security?: CapabilityStatementSecurityComponent;
  public resource?: CapabilityStatementResourceComponent[];
  public interaction?: CapabilityStatementSystemInteractionComponent[];
  public searchParam?: CapabilityStatementSearchParamComponent[];
  public operation?: CapabilityStatementOperationComponent[];
  public compartment?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
      if (obj.hasOwnProperty('security')) {
        this.security = new CapabilityStatementSecurityComponent(obj.security);
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = [];
        for (const o of obj.resource || []) {
          this.resource.push(new CapabilityStatementResourceComponent(o));
        }
      }
      if (obj.hasOwnProperty('interaction')) {
        this.interaction = [];
        for (const o of obj.interaction || []) {
          this.interaction.push(new CapabilityStatementSystemInteractionComponent(o));
        }
      }
      if (obj.hasOwnProperty('searchParam')) {
        this.searchParam = [];
        for (const o of obj.searchParam || []) {
          this.searchParam.push(new CapabilityStatementSearchParamComponent(o));
        }
      }
      if (obj.hasOwnProperty('operation')) {
        this.operation = [];
        for (const o of obj.operation || []) {
          this.operation.push(new CapabilityStatementOperationComponent(o));
        }
      }
      if (obj.hasOwnProperty('compartment')) {
        this.compartment = obj.compartment;
      }
    }
  }

}

export class CapabilityStatementEndpointComponent extends BackboneElement {
  public protocol: Coding;
  public address: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('protocol')) {
        this.protocol = new Coding(obj.protocol);
      }
      if (obj.hasOwnProperty('address')) {
        this.address = obj.address;
      }
    }
  }

}

export class CapabilityStatementSupportedMessageComponent extends BackboneElement {
  public mode: string;
  public definition: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
    }
  }

}

export class CapabilityStatementMessagingComponent extends BackboneElement {
  public endpoint?: CapabilityStatementEndpointComponent[];
  public reliableCache?: number;
  public documentation?: string;
  public supportedMessage?: CapabilityStatementSupportedMessageComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new CapabilityStatementEndpointComponent(o));
        }
      }
      if (obj.hasOwnProperty('reliableCache')) {
        this.reliableCache = obj.reliableCache;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
      if (obj.hasOwnProperty('supportedMessage')) {
        this.supportedMessage = [];
        for (const o of obj.supportedMessage || []) {
          this.supportedMessage.push(new CapabilityStatementSupportedMessageComponent(o));
        }
      }
    }
  }

}

export class CapabilityStatementDocumentComponent extends BackboneElement {
  public mode: string;
  public documentation?: string;
  public profile: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
    }
  }

}

export class CapabilityStatement extends DomainResource implements ICapabilityStatement {
  public resourceType = 'CapabilityStatement';
  public url?: string;
  public version?: string;
  public name?: string;
  public title?: string;
  public status: string;
  public experimental?: boolean;
  public date: string = new Date().formatFhir();
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public kind: string;
  public instantiates?: string[];
  public imports?: string[];
  public software?: CapabilityStatementSoftwareComponent;
  public implementation?: CapabilityStatementImplementationComponent;
  public fhirVersion: string;
  public format: string[];
  public patchFormat?: string[];
  public implementationGuide?: string[];
  public rest?: CapabilityStatementRestComponent[];
  public messaging?: CapabilityStatementMessagingComponent[];
  public document?: CapabilityStatementDocumentComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('kind')) {
        this.kind = obj.kind;
      }
      if (obj.hasOwnProperty('instantiates')) {
        this.instantiates = obj.instantiates;
      }
      if (obj.hasOwnProperty('imports')) {
        this.imports = obj.imports;
      }
      if (obj.hasOwnProperty('software')) {
        this.software = new CapabilityStatementSoftwareComponent(obj.software);
      }
      if (obj.hasOwnProperty('implementation')) {
        this.implementation = new CapabilityStatementImplementationComponent(obj.implementation);
      }
      if (obj.hasOwnProperty('fhirVersion')) {
        this.fhirVersion = obj.fhirVersion;
      }
      if (obj.hasOwnProperty('format')) {
        this.format = obj.format;
      }
      if (obj.hasOwnProperty('patchFormat')) {
        this.patchFormat = obj.patchFormat;
      }
      if (obj.hasOwnProperty('implementationGuide')) {
        this.implementationGuide = obj.implementationGuide;
      }
      if (obj.hasOwnProperty('rest')) {
        this.rest = [];
        for (const o of obj.rest || []) {
          this.rest.push(new CapabilityStatementRestComponent(o));
        }
      }
      if (obj.hasOwnProperty('messaging')) {
        this.messaging = [];
        for (const o of obj.messaging || []) {
          this.messaging.push(new CapabilityStatementMessagingComponent(o));
        }
      }
      if (obj.hasOwnProperty('document')) {
        this.document = [];
        for (const o of obj.document || []) {
          this.document.push(new CapabilityStatementDocumentComponent(o));
        }
      }
    }
  }

}

export class CarePlanDetailComponent extends BackboneElement {
  public kind?: string;
  public instantiatesCanonical?: string[];
  public instantiatesUri?: string[];
  public code?: CodeableConcept;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public goal?: ResourceReference[];
  public status: string;
  public statusReason?: CodeableConcept;
  public doNotPerform?: boolean;
  public scheduled?: Element;
  public location?: ResourceReference;
  public performer?: ResourceReference[];
  public product?: Element;
  public dailyAmount?: SimpleQuantity;
  public quantity?: SimpleQuantity;
  public description?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('kind')) {
        this.kind = obj.kind;
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('goal')) {
        this.goal = [];
        for (const o of obj.goal || []) {
          this.goal.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = new CodeableConcept(obj.statusReason);
      }
      if (obj.hasOwnProperty('doNotPerform')) {
        this.doNotPerform = obj.doNotPerform;
      }
      if (obj.hasOwnProperty('scheduled')) {
        this.scheduled = new Element(obj.scheduled);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('product')) {
        this.product = new Element(obj.product);
      }
      if (obj.hasOwnProperty('dailyAmount')) {
        this.dailyAmount = new SimpleQuantity(obj.dailyAmount);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
    }
  }

}

export class CarePlanActivityComponent extends BackboneElement {
  public outcomeCodeableConcept?: CodeableConcept[];
  public outcomeReference?: ResourceReference[];
  public progress?: Annotation[];
  public reference?: ResourceReference;
  public detail?: CarePlanDetailComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('outcomeCodeableConcept')) {
        this.outcomeCodeableConcept = [];
        for (const o of obj.outcomeCodeableConcept || []) {
          this.outcomeCodeableConcept.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('outcomeReference')) {
        this.outcomeReference = [];
        for (const o of obj.outcomeReference || []) {
          this.outcomeReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('progress')) {
        this.progress = [];
        for (const o of obj.progress || []) {
          this.progress.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = new ResourceReference(obj.reference);
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = new CarePlanDetailComponent(obj.detail);
      }
    }
  }

}

export class CarePlan extends DomainResource {
  public resourceType = 'CarePlan';
  public identifier?: Identifier[];
  public instantiatesCanonical?: string[];
  public instantiatesUri?: string[];
  public basedOn?: ResourceReference[];
  public replaces?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status: string;
  public intent: string;
  public category?: CodeableConcept[];
  public title?: string;
  public description?: string;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public period?: Period;
  public created?: Date;
  public author?: ResourceReference;
  public contributor?: ResourceReference[];
  public careTeam?: ResourceReference[];
  public addresses?: ResourceReference[];
  public supportingInfo?: ResourceReference[];
  public goal?: ResourceReference[];
  public activity?: CarePlanActivityComponent[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('replaces')) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('intent')) {
        this.intent = obj.intent;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.hasOwnProperty('contributor')) {
        this.contributor = [];
        for (const o of obj.contributor || []) {
          this.contributor.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('careTeam')) {
        this.careTeam = [];
        for (const o of obj.careTeam || []) {
          this.careTeam.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('addresses')) {
        this.addresses = [];
        for (const o of obj.addresses || []) {
          this.addresses.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('supportingInfo')) {
        this.supportingInfo = [];
        for (const o of obj.supportingInfo || []) {
          this.supportingInfo.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('goal')) {
        this.goal = [];
        for (const o of obj.goal || []) {
          this.goal.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('activity')) {
        this.activity = [];
        for (const o of obj.activity || []) {
          this.activity.push(new CarePlanActivityComponent(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class CareTeamParticipantComponent extends BackboneElement {
  public role?: CodeableConcept[];
  public member?: ResourceReference;
  public onBehalfOf?: ResourceReference;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('role')) {
        this.role = [];
        for (const o of obj.role || []) {
          this.role.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('member')) {
        this.member = new ResourceReference(obj.member);
      }
      if (obj.hasOwnProperty('onBehalfOf')) {
        this.onBehalfOf = new ResourceReference(obj.onBehalfOf);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class CareTeam extends DomainResource {
  public resourceType = 'CareTeam';
  public identifier?: Identifier[];
  public status?: string;
  public category?: CodeableConcept[];
  public name?: string;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public period?: Period;
  public participant?: CareTeamParticipantComponent[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public managingOrganization?: ResourceReference[];
  public telecom?: ContactPoint[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('participant')) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new CareTeamParticipantComponent(o));
        }
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('managingOrganization')) {
        this.managingOrganization = [];
        for (const o of obj.managingOrganization || []) {
          this.managingOrganization.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class ChargeItemPerformerComponent extends BackboneElement {
  public function?: CodeableConcept;
  public actor: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('function')) {
        this.function = new CodeableConcept(obj.function);
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = new ResourceReference(obj.actor);
      }
    }
  }

}

export class Money extends Element {
  public value?: number;
  public currency?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
      if (obj.hasOwnProperty('currency')) {
        this.currency = obj.currency;
      }
    }
  }

}

export class ChargeItem extends DomainResource {
  public resourceType = 'ChargeItem';
  public identifier?: Identifier[];
  public definition?: string[];
  public status: string;
  public partOf?: ResourceReference[];
  public code: CodeableConcept;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public performer?: ChargeItemPerformerComponent[];
  public performingOrganization?: ResourceReference;
  public requestingOrganization?: ResourceReference;
  public costCenter?: ResourceReference;
  public quantity?: Quantity;
  public bodysite?: CodeableConcept[];
  public factorOverride?: number;
  public priceOverride?: Money;
  public overrideReason?: string;
  public enterer?: ResourceReference;
  public enteredDate?: Date;
  public reason?: CodeableConcept[];
  public service?: ResourceReference[];
  public product?: Element;
  public account?: ResourceReference[];
  public note?: Annotation[];
  public supportingInformation?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('occurrence')) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ChargeItemPerformerComponent(o));
        }
      }
      if (obj.hasOwnProperty('performingOrganization')) {
        this.performingOrganization = new ResourceReference(obj.performingOrganization);
      }
      if (obj.hasOwnProperty('requestingOrganization')) {
        this.requestingOrganization = new ResourceReference(obj.requestingOrganization);
      }
      if (obj.hasOwnProperty('costCenter')) {
        this.costCenter = new ResourceReference(obj.costCenter);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.hasOwnProperty('bodysite')) {
        this.bodysite = [];
        for (const o of obj.bodysite || []) {
          this.bodysite.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('factorOverride')) {
        this.factorOverride = obj.factorOverride;
      }
      if (obj.hasOwnProperty('priceOverride')) {
        this.priceOverride = new Money(obj.priceOverride);
      }
      if (obj.hasOwnProperty('overrideReason')) {
        this.overrideReason = obj.overrideReason;
      }
      if (obj.hasOwnProperty('enterer')) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.hasOwnProperty('enteredDate')) {
        this.enteredDate = obj.enteredDate;
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('service')) {
        this.service = [];
        for (const o of obj.service || []) {
          this.service.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('product')) {
        this.product = new Element(obj.product);
      }
      if (obj.hasOwnProperty('account')) {
        this.account = [];
        for (const o of obj.account || []) {
          this.account.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('supportingInformation')) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class ChargeItemDefinitionApplicabilityComponent extends BackboneElement {
  public description?: string;
  public language?: string;
  public expression?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('language')) {
        this.language = obj.language;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
    }
  }

}

export class ChargeItemDefinitionPriceComponentComponent extends BackboneElement {
  public type: string;
  public code?: CodeableConcept;
  public factor?: number;
  public amount?: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Money(obj.amount);
      }
    }
  }

}

export class ChargeItemDefinitionPropertyGroupComponent extends BackboneElement {
  public applicability?: ChargeItemDefinitionApplicabilityComponent[];
  public priceComponent?: ChargeItemDefinitionPriceComponentComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('applicability')) {
        this.applicability = [];
        for (const o of obj.applicability || []) {
          this.applicability.push(new ChargeItemDefinitionApplicabilityComponent(o));
        }
      }
      if (obj.hasOwnProperty('priceComponent')) {
        this.priceComponent = [];
        for (const o of obj.priceComponent || []) {
          this.priceComponent.push(new ChargeItemDefinitionPriceComponentComponent(o));
        }
      }
    }
  }

}

export class ChargeItemDefinition extends DomainResource {
  public resourceType = 'ChargeItemDefinition';
  public url: string;
  public identifier?: Identifier[];
  public version?: string;
  public title?: string;
  public derivedFromUri?: string[];
  public partOf?: string[];
  public replaces?: string[];
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public copyright?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public code?: CodeableConcept;
  public instance?: ResourceReference[];
  public applicability?: ChargeItemDefinitionApplicabilityComponent[];
  public propertyGroup?: ChargeItemDefinitionPropertyGroupComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('derivedFromUri')) {
        this.derivedFromUri = obj.derivedFromUri;
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = obj.partOf;
      }
      if (obj.hasOwnProperty('replaces')) {
        this.replaces = obj.replaces;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('approvalDate')) {
        this.approvalDate = obj.approvalDate;
      }
      if (obj.hasOwnProperty('lastReviewDate')) {
        this.lastReviewDate = obj.lastReviewDate;
      }
      if (obj.hasOwnProperty('effectivePeriod')) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('instance')) {
        this.instance = [];
        for (const o of obj.instance || []) {
          this.instance.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('applicability')) {
        this.applicability = [];
        for (const o of obj.applicability || []) {
          this.applicability.push(new ChargeItemDefinitionApplicabilityComponent(o));
        }
      }
      if (obj.hasOwnProperty('propertyGroup')) {
        this.propertyGroup = [];
        for (const o of obj.propertyGroup || []) {
          this.propertyGroup.push(new ChargeItemDefinitionPropertyGroupComponent(o));
        }
      }
    }
  }

}

export class ClaimRelatedClaimComponent extends BackboneElement {
  public claim?: ResourceReference;
  public relationship?: CodeableConcept;
  public reference?: Identifier;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('claim')) {
        this.claim = new ResourceReference(obj.claim);
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = new CodeableConcept(obj.relationship);
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = new Identifier(obj.reference);
      }
    }
  }

}

export class ClaimPayeeComponent extends BackboneElement {
  public type: CodeableConcept;
  public resource?: Coding;
  public party?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = new Coding(obj.resource);
      }
      if (obj.hasOwnProperty('party')) {
        this.party = new ResourceReference(obj.party);
      }
    }
  }

}

export class ClaimCareTeamComponent extends BackboneElement {
  public sequence: number;
  public provider: ResourceReference;
  public responsible?: boolean;
  public role?: CodeableConcept;
  public qualification?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('responsible')) {
        this.responsible = obj.responsible;
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.hasOwnProperty('qualification')) {
        this.qualification = new CodeableConcept(obj.qualification);
      }
    }
  }

}

export class ClaimSpecialConditionComponent extends BackboneElement {
  public sequence: number;
  public category: CodeableConcept;
  public code?: CodeableConcept;
  public timing?: Element;
  public value?: Element;
  public reason?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('timing')) {
        this.timing = new Element(obj.timing);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = new CodeableConcept(obj.reason);
      }
    }
  }

}

export class ClaimDiagnosisComponent extends BackboneElement {
  public sequence: number;
  public diagnosis: Element;
  public type?: CodeableConcept[];
  public onAdmission?: CodeableConcept;
  public packageCode?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('diagnosis')) {
        this.diagnosis = new Element(obj.diagnosis);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('onAdmission')) {
        this.onAdmission = new CodeableConcept(obj.onAdmission);
      }
      if (obj.hasOwnProperty('packageCode')) {
        this.packageCode = new CodeableConcept(obj.packageCode);
      }
    }
  }

}

export class ClaimProcedureComponent extends BackboneElement {
  public sequence: number;
  public date?: Date;
  public procedure: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('procedure')) {
        this.procedure = new Element(obj.procedure);
      }
    }
  }

}

export class ClaimInsuranceComponent extends BackboneElement {
  public sequence: number;
  public focal: boolean;
  public identifier?: Identifier;
  public coverage: ResourceReference;
  public businessArrangement?: string;
  public preAuthRef?: string[];
  public claimResponse?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('focal')) {
        this.focal = obj.focal;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('coverage')) {
        this.coverage = new ResourceReference(obj.coverage);
      }
      if (obj.hasOwnProperty('businessArrangement')) {
        this.businessArrangement = obj.businessArrangement;
      }
      if (obj.hasOwnProperty('preAuthRef')) {
        this.preAuthRef = obj.preAuthRef;
      }
      if (obj.hasOwnProperty('claimResponse')) {
        this.claimResponse = new ResourceReference(obj.claimResponse);
      }
    }
  }

}

export class ClaimAccidentComponent extends BackboneElement {
  public date: Date;
  public type?: CodeableConcept;
  public location?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new Element(obj.location);
      }
    }
  }

}

export class ClaimSubDetailComponent extends BackboneElement {
  public sequence: number;
  public revenue?: CodeableConcept;
  public category?: CodeableConcept;
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public programCode?: CodeableConcept[];
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public udi?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('revenue')) {
        this.revenue = new CodeableConcept(obj.revenue);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('programCode')) {
        this.programCode = [];
        for (const o of obj.programCode || []) {
          this.programCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('udi')) {
        this.udi = [];
        for (const o of obj.udi || []) {
          this.udi.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class ClaimDetailComponent extends BackboneElement {
  public sequence: number;
  public revenue?: CodeableConcept;
  public category?: CodeableConcept;
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public programCode?: CodeableConcept[];
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public udi?: ResourceReference[];
  public subDetail?: ClaimSubDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('revenue')) {
        this.revenue = new CodeableConcept(obj.revenue);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('programCode')) {
        this.programCode = [];
        for (const o of obj.programCode || []) {
          this.programCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('udi')) {
        this.udi = [];
        for (const o of obj.udi || []) {
          this.udi.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('subDetail')) {
        this.subDetail = [];
        for (const o of obj.subDetail || []) {
          this.subDetail.push(new ClaimSubDetailComponent(o));
        }
      }
    }
  }

}

export class ClaimItemComponent extends BackboneElement {
  public sequence: number;
  public careTeamSequence?: number[];
  public diagnosisSequence?: number[];
  public procedureSequence?: number[];
  public informationSequence?: number[];
  public revenue?: CodeableConcept;
  public category?: CodeableConcept;
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public programCode?: CodeableConcept[];
  public serviced?: Element;
  public location?: Element;
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public udi?: ResourceReference[];
  public bodySite?: CodeableConcept;
  public subSite?: CodeableConcept[];
  public encounter?: ResourceReference[];
  public detail?: ClaimDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('careTeamSequence')) {
        this.careTeamSequence = obj.careTeamSequence;
      }
      if (obj.hasOwnProperty('diagnosisSequence')) {
        this.diagnosisSequence = obj.diagnosisSequence;
      }
      if (obj.hasOwnProperty('procedureSequence')) {
        this.procedureSequence = obj.procedureSequence;
      }
      if (obj.hasOwnProperty('informationSequence')) {
        this.informationSequence = obj.informationSequence;
      }
      if (obj.hasOwnProperty('revenue')) {
        this.revenue = new CodeableConcept(obj.revenue);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('programCode')) {
        this.programCode = [];
        for (const o of obj.programCode || []) {
          this.programCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('serviced')) {
        this.serviced = new Element(obj.serviced);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new Element(obj.location);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('udi')) {
        this.udi = [];
        for (const o of obj.udi || []) {
          this.udi.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.hasOwnProperty('subSite')) {
        this.subSite = [];
        for (const o of obj.subSite || []) {
          this.subSite.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = [];
        for (const o of obj.encounter || []) {
          this.encounter.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new ClaimDetailComponent(o));
        }
      }
    }
  }

}

export class Claim extends DomainResource {
  public resourceType = 'Claim';
  public identifier?: Identifier[];
  public status?: string;
  public type?: CodeableConcept;
  public subType?: CodeableConcept;
  public use?: string;
  public patient?: ResourceReference;
  public billablePeriod?: Period;
  public created?: Date;
  public enterer?: ResourceReference;
  public insurer?: ResourceReference;
  public provider?: ResourceReference;
  public priority?: CodeableConcept;
  public fundsReserve?: CodeableConcept;
  public related?: ClaimRelatedClaimComponent[];
  public prescription?: ResourceReference;
  public originalPrescription?: ResourceReference;
  public payee?: ClaimPayeeComponent;
  public referral?: ResourceReference;
  public facility?: ResourceReference;
  public careTeam?: ClaimCareTeamComponent[];
  public information?: ClaimSpecialConditionComponent[];
  public diagnosis?: ClaimDiagnosisComponent[];
  public procedure?: ClaimProcedureComponent[];
  public insurance?: ClaimInsuranceComponent[];
  public accident?: ClaimAccidentComponent;
  public item?: ClaimItemComponent[];
  public total?: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subType')) {
        this.subType = new CodeableConcept(obj.subType);
      }
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('billablePeriod')) {
        this.billablePeriod = new Period(obj.billablePeriod);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('enterer')) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.hasOwnProperty('insurer')) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.hasOwnProperty('fundsReserve')) {
        this.fundsReserve = new CodeableConcept(obj.fundsReserve);
      }
      if (obj.hasOwnProperty('related')) {
        this.related = [];
        for (const o of obj.related || []) {
          this.related.push(new ClaimRelatedClaimComponent(o));
        }
      }
      if (obj.hasOwnProperty('prescription')) {
        this.prescription = new ResourceReference(obj.prescription);
      }
      if (obj.hasOwnProperty('originalPrescription')) {
        this.originalPrescription = new ResourceReference(obj.originalPrescription);
      }
      if (obj.hasOwnProperty('payee')) {
        this.payee = new ClaimPayeeComponent(obj.payee);
      }
      if (obj.hasOwnProperty('referral')) {
        this.referral = new ResourceReference(obj.referral);
      }
      if (obj.hasOwnProperty('facility')) {
        this.facility = new ResourceReference(obj.facility);
      }
      if (obj.hasOwnProperty('careTeam')) {
        this.careTeam = [];
        for (const o of obj.careTeam || []) {
          this.careTeam.push(new ClaimCareTeamComponent(o));
        }
      }
      if (obj.hasOwnProperty('information')) {
        this.information = [];
        for (const o of obj.information || []) {
          this.information.push(new ClaimSpecialConditionComponent(o));
        }
      }
      if (obj.hasOwnProperty('diagnosis')) {
        this.diagnosis = [];
        for (const o of obj.diagnosis || []) {
          this.diagnosis.push(new ClaimDiagnosisComponent(o));
        }
      }
      if (obj.hasOwnProperty('procedure')) {
        this.procedure = [];
        for (const o of obj.procedure || []) {
          this.procedure.push(new ClaimProcedureComponent(o));
        }
      }
      if (obj.hasOwnProperty('insurance')) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new ClaimInsuranceComponent(o));
        }
      }
      if (obj.hasOwnProperty('accident')) {
        this.accident = new ClaimAccidentComponent(obj.accident);
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ClaimItemComponent(o));
        }
      }
      if (obj.hasOwnProperty('total')) {
        this.total = new Money(obj.total);
      }
    }
  }

}

export class ClaimResponseAdjudicationComponent extends BackboneElement {
  public category: CodeableConcept;
  public reason?: CodeableConcept;
  public amount?: Money;
  public value?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = new CodeableConcept(obj.reason);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Money(obj.amount);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class ClaimResponseSubDetailComponent extends BackboneElement {
  public subDetailSequence: number;
  public noteNumber?: number[];
  public adjudication?: ClaimResponseAdjudicationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('subDetailSequence')) {
        this.subDetailSequence = obj.subDetailSequence;
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ClaimResponseAdjudicationComponent(o));
        }
      }
    }
  }

}

export class ClaimResponseItemDetailComponent extends BackboneElement {
  public detailSequence: number;
  public noteNumber?: number[];
  public adjudication?: ClaimResponseAdjudicationComponent[];
  public subDetail?: ClaimResponseSubDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('detailSequence')) {
        this.detailSequence = obj.detailSequence;
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ClaimResponseAdjudicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('subDetail')) {
        this.subDetail = [];
        for (const o of obj.subDetail || []) {
          this.subDetail.push(new ClaimResponseSubDetailComponent(o));
        }
      }
    }
  }

}

export class ClaimResponseItemComponent extends BackboneElement {
  public itemSequence: number;
  public noteNumber?: number[];
  public adjudication?: ClaimResponseAdjudicationComponent[];
  public detail?: ClaimResponseItemDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('itemSequence')) {
        this.itemSequence = obj.itemSequence;
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ClaimResponseAdjudicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new ClaimResponseItemDetailComponent(o));
        }
      }
    }
  }

}

export class ClaimResponseAddedItemSubDetailComponent extends BackboneElement {
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public noteNumber?: number[];
  public adjudication?: ClaimResponseAdjudicationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ClaimResponseAdjudicationComponent(o));
        }
      }
    }
  }

}

export class ClaimResponseAddedItemDetailComponent extends BackboneElement {
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public noteNumber?: number[];
  public adjudication?: ClaimResponseAdjudicationComponent[];
  public subDetail?: ClaimResponseAddedItemSubDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ClaimResponseAdjudicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('subDetail')) {
        this.subDetail = [];
        for (const o of obj.subDetail || []) {
          this.subDetail.push(new ClaimResponseAddedItemSubDetailComponent(o));
        }
      }
    }
  }

}

export class ClaimResponseAddedItemComponent extends BackboneElement {
  public itemSequence?: number[];
  public detailSequence?: number[];
  public subdetailSequence?: number[];
  public provider?: ResourceReference[];
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public programCode?: CodeableConcept[];
  public serviced?: Element;
  public location?: Element;
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public bodySite?: CodeableConcept;
  public subSite?: CodeableConcept[];
  public noteNumber?: number[];
  public adjudication?: ClaimResponseAdjudicationComponent[];
  public detail?: ClaimResponseAddedItemDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('itemSequence')) {
        this.itemSequence = obj.itemSequence;
      }
      if (obj.hasOwnProperty('detailSequence')) {
        this.detailSequence = obj.detailSequence;
      }
      if (obj.hasOwnProperty('subdetailSequence')) {
        this.subdetailSequence = obj.subdetailSequence;
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = [];
        for (const o of obj.provider || []) {
          this.provider.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('programCode')) {
        this.programCode = [];
        for (const o of obj.programCode || []) {
          this.programCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('serviced')) {
        this.serviced = new Element(obj.serviced);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new Element(obj.location);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.hasOwnProperty('subSite')) {
        this.subSite = [];
        for (const o of obj.subSite || []) {
          this.subSite.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ClaimResponseAdjudicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new ClaimResponseAddedItemDetailComponent(o));
        }
      }
    }
  }

}

export class ClaimResponseErrorComponent extends BackboneElement {
  public itemSequence?: number;
  public detailSequence?: number;
  public subDetailSequence?: number;
  public code: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('itemSequence')) {
        this.itemSequence = obj.itemSequence;
      }
      if (obj.hasOwnProperty('detailSequence')) {
        this.detailSequence = obj.detailSequence;
      }
      if (obj.hasOwnProperty('subDetailSequence')) {
        this.subDetailSequence = obj.subDetailSequence;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
    }
  }

}

export class ClaimResponseTotalComponent extends BackboneElement {
  public category: CodeableConcept;
  public amount: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Money(obj.amount);
      }
    }
  }

}

export class ClaimResponsePaymentComponent extends BackboneElement {
  public type?: CodeableConcept;
  public adjustment?: Money;
  public adjustmentReason?: CodeableConcept;
  public date?: Date;
  public amount?: Money;
  public identifier?: Identifier;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('adjustment')) {
        this.adjustment = new Money(obj.adjustment);
      }
      if (obj.hasOwnProperty('adjustmentReason')) {
        this.adjustmentReason = new CodeableConcept(obj.adjustmentReason);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Money(obj.amount);
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
    }
  }

}

export class ClaimResponseNoteComponent extends BackboneElement {
  public number?: number;
  public type?: string;
  public text?: string;
  public language?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('number')) {
        this.number = obj.number;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('language')) {
        this.language = new CodeableConcept(obj.language);
      }
    }
  }

}

export class ClaimResponseInsuranceComponent extends BackboneElement {
  public sequence: number;
  public focal: boolean;
  public coverage: ResourceReference;
  public businessArrangement?: string;
  public claimResponse?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('focal')) {
        this.focal = obj.focal;
      }
      if (obj.hasOwnProperty('coverage')) {
        this.coverage = new ResourceReference(obj.coverage);
      }
      if (obj.hasOwnProperty('businessArrangement')) {
        this.businessArrangement = obj.businessArrangement;
      }
      if (obj.hasOwnProperty('claimResponse')) {
        this.claimResponse = new ResourceReference(obj.claimResponse);
      }
    }
  }

}

export class ClaimResponse extends DomainResource {
  public resourceType = 'ClaimResponse';
  public identifier?: Identifier[];
  public status?: string;
  public type?: CodeableConcept;
  public subType?: CodeableConcept;
  public use?: string;
  public patient?: ResourceReference;
  public created?: Date;
  public insurer?: ResourceReference;
  public requestProvider?: ResourceReference;
  public request?: ResourceReference;
  public outcome?: string;
  public disposition?: string;
  public preAuthRef?: string;
  public payeeType?: CodeableConcept;
  public item?: ClaimResponseItemComponent[];
  public addItem?: ClaimResponseAddedItemComponent[];
  public error?: ClaimResponseErrorComponent[];
  public total?: ClaimResponseTotalComponent[];
  public payment?: ClaimResponsePaymentComponent;
  public reserved?: Coding;
  public form?: CodeableConcept;
  public processNote?: ClaimResponseNoteComponent[];
  public communicationRequest?: ResourceReference[];
  public insurance?: ClaimResponseInsuranceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subType')) {
        this.subType = new CodeableConcept(obj.subType);
      }
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('insurer')) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.hasOwnProperty('requestProvider')) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = obj.outcome;
      }
      if (obj.hasOwnProperty('disposition')) {
        this.disposition = obj.disposition;
      }
      if (obj.hasOwnProperty('preAuthRef')) {
        this.preAuthRef = obj.preAuthRef;
      }
      if (obj.hasOwnProperty('payeeType')) {
        this.payeeType = new CodeableConcept(obj.payeeType);
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ClaimResponseItemComponent(o));
        }
      }
      if (obj.hasOwnProperty('addItem')) {
        this.addItem = [];
        for (const o of obj.addItem || []) {
          this.addItem.push(new ClaimResponseAddedItemComponent(o));
        }
      }
      if (obj.hasOwnProperty('error')) {
        this.error = [];
        for (const o of obj.error || []) {
          this.error.push(new ClaimResponseErrorComponent(o));
        }
      }
      if (obj.hasOwnProperty('total')) {
        this.total = [];
        for (const o of obj.total || []) {
          this.total.push(new ClaimResponseTotalComponent(o));
        }
      }
      if (obj.hasOwnProperty('payment')) {
        this.payment = new ClaimResponsePaymentComponent(obj.payment);
      }
      if (obj.hasOwnProperty('reserved')) {
        this.reserved = new Coding(obj.reserved);
      }
      if (obj.hasOwnProperty('form')) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.hasOwnProperty('processNote')) {
        this.processNote = [];
        for (const o of obj.processNote || []) {
          this.processNote.push(new ClaimResponseNoteComponent(o));
        }
      }
      if (obj.hasOwnProperty('communicationRequest')) {
        this.communicationRequest = [];
        for (const o of obj.communicationRequest || []) {
          this.communicationRequest.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('insurance')) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new ClaimResponseInsuranceComponent(o));
        }
      }
    }
  }

}

export class ClinicalImpressionInvestigationComponent extends BackboneElement {
  public code: CodeableConcept;
  public item?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class ClinicalImpressionFindingComponent extends BackboneElement {
  public itemCodeableConcept?: CodeableConcept;
  public itemReference?: ResourceReference;
  public basis?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('itemCodeableConcept')) {
        this.itemCodeableConcept = new CodeableConcept(obj.itemCodeableConcept);
      }
      if (obj.hasOwnProperty('itemReference')) {
        this.itemReference = new ResourceReference(obj.itemReference);
      }
      if (obj.hasOwnProperty('basis')) {
        this.basis = obj.basis;
      }
    }
  }

}

export class ClinicalImpression extends DomainResource {
  public resourceType = 'ClinicalImpression';
  public identifier?: Identifier[];
  public status: string;
  public statusReason?: CodeableConcept;
  public code?: CodeableConcept;
  public description?: string;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public effective?: Element;
  public date?: Date;
  public assessor?: ResourceReference;
  public previous?: ResourceReference;
  public problem?: ResourceReference[];
  public investigation?: ClinicalImpressionInvestigationComponent[];
  public protocol?: string[];
  public summary?: string;
  public finding?: ClinicalImpressionFindingComponent[];
  public prognosisCodeableConcept?: CodeableConcept[];
  public prognosisReference?: ResourceReference[];
  public supportingInfo?: ResourceReference[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = new CodeableConcept(obj.statusReason);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('effective')) {
        this.effective = new Element(obj.effective);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('assessor')) {
        this.assessor = new ResourceReference(obj.assessor);
      }
      if (obj.hasOwnProperty('previous')) {
        this.previous = new ResourceReference(obj.previous);
      }
      if (obj.hasOwnProperty('problem')) {
        this.problem = [];
        for (const o of obj.problem || []) {
          this.problem.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('investigation')) {
        this.investigation = [];
        for (const o of obj.investigation || []) {
          this.investigation.push(new ClinicalImpressionInvestigationComponent(o));
        }
      }
      if (obj.hasOwnProperty('protocol')) {
        this.protocol = obj.protocol;
      }
      if (obj.hasOwnProperty('summary')) {
        this.summary = obj.summary;
      }
      if (obj.hasOwnProperty('finding')) {
        this.finding = [];
        for (const o of obj.finding || []) {
          this.finding.push(new ClinicalImpressionFindingComponent(o));
        }
      }
      if (obj.hasOwnProperty('prognosisCodeableConcept')) {
        this.prognosisCodeableConcept = [];
        for (const o of obj.prognosisCodeableConcept || []) {
          this.prognosisCodeableConcept.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('prognosisReference')) {
        this.prognosisReference = [];
        for (const o of obj.prognosisReference || []) {
          this.prognosisReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('supportingInfo')) {
        this.supportingInfo = [];
        for (const o of obj.supportingInfo || []) {
          this.supportingInfo.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class CommunicationPayloadComponent extends BackboneElement {
  public content: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('content')) {
        this.content = new Element(obj.content);
      }
    }
  }

}

export class Communication extends DomainResource {
  public resourceType = 'Communication';
  public identifier?: Identifier[];
  public instantiatesCanonical?: string[];
  public instantiatesUri?: string[];
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public inResponseTo?: ResourceReference[];
  public status: string;
  public statusReason?: CodeableConcept;
  public category?: CodeableConcept[];
  public priority?: string;
  public medium?: CodeableConcept[];
  public subject?: ResourceReference;
  public topic?: CodeableConcept;
  public about?: ResourceReference[];
  public context?: ResourceReference;
  public sent?: Date;
  public received?: Date;
  public recipient?: ResourceReference[];
  public sender?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public payload?: CommunicationPayloadComponent[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('inResponseTo')) {
        this.inResponseTo = [];
        for (const o of obj.inResponseTo || []) {
          this.inResponseTo.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = new CodeableConcept(obj.statusReason);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('medium')) {
        this.medium = [];
        for (const o of obj.medium || []) {
          this.medium.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('topic')) {
        this.topic = new CodeableConcept(obj.topic);
      }
      if (obj.hasOwnProperty('about')) {
        this.about = [];
        for (const o of obj.about || []) {
          this.about.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('sent')) {
        this.sent = obj.sent;
      }
      if (obj.hasOwnProperty('received')) {
        this.received = obj.received;
      }
      if (obj.hasOwnProperty('recipient')) {
        this.recipient = [];
        for (const o of obj.recipient || []) {
          this.recipient.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('sender')) {
        this.sender = new ResourceReference(obj.sender);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('payload')) {
        this.payload = [];
        for (const o of obj.payload || []) {
          this.payload.push(new CommunicationPayloadComponent(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class CommunicationRequestPayloadComponent extends BackboneElement {
  public content: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('content')) {
        this.content = new Element(obj.content);
      }
    }
  }

}

export class CommunicationRequest extends DomainResource {
  public resourceType = 'CommunicationRequest';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference[];
  public replaces?: ResourceReference[];
  public groupIdentifier?: Identifier;
  public status: string;
  public statusReason?: CodeableConcept;
  public category?: CodeableConcept[];
  public priority?: string;
  public doNotPerform?: boolean;
  public medium?: CodeableConcept[];
  public subject?: ResourceReference;
  public about?: ResourceReference[];
  public context?: ResourceReference;
  public payload?: CommunicationRequestPayloadComponent[];
  public occurrence?: Element;
  public authoredOn?: Date;
  public requester?: ResourceReference;
  public recipient?: ResourceReference[];
  public sender?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('replaces')) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('groupIdentifier')) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = new CodeableConcept(obj.statusReason);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('doNotPerform')) {
        this.doNotPerform = obj.doNotPerform;
      }
      if (obj.hasOwnProperty('medium')) {
        this.medium = [];
        for (const o of obj.medium || []) {
          this.medium.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('about')) {
        this.about = [];
        for (const o of obj.about || []) {
          this.about.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('payload')) {
        this.payload = [];
        for (const o of obj.payload || []) {
          this.payload.push(new CommunicationRequestPayloadComponent(o));
        }
      }
      if (obj.hasOwnProperty('occurrence')) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.hasOwnProperty('authoredOn')) {
        this.authoredOn = obj.authoredOn;
      }
      if (obj.hasOwnProperty('requester')) {
        this.requester = new ResourceReference(obj.requester);
      }
      if (obj.hasOwnProperty('recipient')) {
        this.recipient = [];
        for (const o of obj.recipient || []) {
          this.recipient.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('sender')) {
        this.sender = new ResourceReference(obj.sender);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class CompartmentDefinitionResourceComponent extends BackboneElement {
  public code: string;
  public param?: string[];
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('param')) {
        this.param = obj.param;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class CompartmentDefinition extends DomainResource {
  public resourceType = 'CompartmentDefinition';
  public url: string;
  public version?: string;
  public name: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public purpose?: string;
  public code: string;
  public search: boolean;
  public resource?: CompartmentDefinitionResourceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('search')) {
        this.search = obj.search;
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = [];
        for (const o of obj.resource || []) {
          this.resource.push(new CompartmentDefinitionResourceComponent(o));
        }
      }
    }
  }

}

export class CompositionAttesterComponent extends BackboneElement {
  public mode: string;
  public time?: Date;
  public party?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('time')) {
        this.time = obj.time;
      }
      if (obj.hasOwnProperty('party')) {
        this.party = new ResourceReference(obj.party);
      }
    }
  }

}

export class CompositionRelatesToComponent extends BackboneElement {
  public code: string;
  public target: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('target')) {
        this.target = new Element(obj.target);
      }
    }
  }

}

export class CompositionEventComponent extends BackboneElement {
  public code?: CodeableConcept[];
  public period?: Period;
  public detail?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class CompositionSectionComponent extends BackboneElement {
  public title?: string;
  public code?: CodeableConcept;
  public author?: ResourceReference[];
  public text?: Narrative;
  public mode?: string;
  public orderedBy?: CodeableConcept;
  public entry?: ResourceReference[];
  public emptyReason?: CodeableConcept;
  public section?: CompositionSectionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('author')) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('text')) {
        this.text = new Narrative(obj.text);
      }
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('orderedBy')) {
        this.orderedBy = new CodeableConcept(obj.orderedBy);
      }
      if (obj.hasOwnProperty('entry')) {
        this.entry = [];
        for (const o of obj.entry || []) {
          this.entry.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('emptyReason')) {
        this.emptyReason = new CodeableConcept(obj.emptyReason);
      }
      if (obj.hasOwnProperty('section')) {
        this.section = [];
        for (const o of obj.section || []) {
          this.section.push(new CompositionSectionComponent(o));
        }
      }
    }
  }

}

export class Composition extends DomainResource {
  public resourceType = 'Composition';
  public identifier?: Identifier;
  public status: string;
  public type: CodeableConcept;
  public category?: CodeableConcept[];
  public subject?: ResourceReference;
  public encounter?: ResourceReference;
  public date: Date;
  public author: ResourceReference[];
  public title: string;
  public confidentiality?: string;
  public attester?: CompositionAttesterComponent[];
  public custodian?: ResourceReference;
  public relatesTo?: CompositionRelatesToComponent[];
  public event?: CompositionEventComponent[];
  public section?: CompositionSectionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('confidentiality')) {
        this.confidentiality = obj.confidentiality;
      }
      if (obj.hasOwnProperty('attester')) {
        this.attester = [];
        for (const o of obj.attester || []) {
          this.attester.push(new CompositionAttesterComponent(o));
        }
      }
      if (obj.hasOwnProperty('custodian')) {
        this.custodian = new ResourceReference(obj.custodian);
      }
      if (obj.hasOwnProperty('relatesTo')) {
        this.relatesTo = [];
        for (const o of obj.relatesTo || []) {
          this.relatesTo.push(new CompositionRelatesToComponent(o));
        }
      }
      if (obj.hasOwnProperty('event')) {
        this.event = [];
        for (const o of obj.event || []) {
          this.event.push(new CompositionEventComponent(o));
        }
      }
      if (obj.hasOwnProperty('section')) {
        this.section = [];
        for (const o of obj.section || []) {
          this.section.push(new CompositionSectionComponent(o));
        }
      }
    }
  }

}

export class ConditionStageComponent extends BackboneElement {
  public summary?: CodeableConcept;
  public assessment?: ResourceReference[];
  public type?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('summary')) {
        this.summary = new CodeableConcept(obj.summary);
      }
      if (obj.hasOwnProperty('assessment')) {
        this.assessment = [];
        for (const o of obj.assessment || []) {
          this.assessment.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
    }
  }

}

export class ConditionEvidenceComponent extends BackboneElement {
  public code?: CodeableConcept[];
  public detail?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class Condition extends DomainResource {
  public resourceType = 'Condition';
  public identifier?: Identifier[];
  public clinicalStatus?: CodeableConcept;
  public verificationStatus?: CodeableConcept;
  public category?: CodeableConcept[];
  public severity?: CodeableConcept;
  public code?: CodeableConcept;
  public bodySite?: CodeableConcept[];
  public subject: ResourceReference;
  public context?: ResourceReference;
  public onset?: Element;
  public abatement?: Element;
  public recordedDate?: Date;
  public recorder?: ResourceReference;
  public asserter?: ResourceReference;
  public stage?: ConditionStageComponent[];
  public evidence?: ConditionEvidenceComponent[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('clinicalStatus')) {
        this.clinicalStatus = new CodeableConcept(obj.clinicalStatus);
      }
      if (obj.hasOwnProperty('verificationStatus')) {
        this.verificationStatus = new CodeableConcept(obj.verificationStatus);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('severity')) {
        this.severity = new CodeableConcept(obj.severity);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = [];
        for (const o of obj.bodySite || []) {
          this.bodySite.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('onset')) {
        this.onset = new Element(obj.onset);
      }
      if (obj.hasOwnProperty('abatement')) {
        this.abatement = new Element(obj.abatement);
      }
      if (obj.hasOwnProperty('recordedDate')) {
        this.recordedDate = obj.recordedDate;
      }
      if (obj.hasOwnProperty('recorder')) {
        this.recorder = new ResourceReference(obj.recorder);
      }
      if (obj.hasOwnProperty('asserter')) {
        this.asserter = new ResourceReference(obj.asserter);
      }
      if (obj.hasOwnProperty('stage')) {
        this.stage = [];
        for (const o of obj.stage || []) {
          this.stage.push(new ConditionStageComponent(o));
        }
      }
      if (obj.hasOwnProperty('evidence')) {
        this.evidence = [];
        for (const o of obj.evidence || []) {
          this.evidence.push(new ConditionEvidenceComponent(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class ConsentPolicyComponent extends BackboneElement {
  public authority?: string;
  public uri?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('authority')) {
        this.authority = obj.authority;
      }
      if (obj.hasOwnProperty('uri')) {
        this.uri = obj.uri;
      }
    }
  }

}

export class ConsentVerificationComponent extends BackboneElement {
  public verified: boolean;
  public verifiedWith?: ResourceReference;
  public verificationDate?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('verified')) {
        this.verified = obj.verified;
      }
      if (obj.hasOwnProperty('verifiedWith')) {
        this.verifiedWith = new ResourceReference(obj.verifiedWith);
      }
      if (obj.hasOwnProperty('verificationDate')) {
        this.verificationDate = obj.verificationDate;
      }
    }
  }

}

export class ConsentprovisionActorComponent extends BackboneElement {
  public role: CodeableConcept;
  public reference: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = new ResourceReference(obj.reference);
      }
    }
  }

}

export class ConsentprovisionDataComponent extends BackboneElement {
  public meaning: string;
  public reference: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('meaning')) {
        this.meaning = obj.meaning;
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = new ResourceReference(obj.reference);
      }
    }
  }

}

export class ConsentprovisionComponent extends BackboneElement {
  public type?: string;
  public period?: Period;
  public actor?: ConsentprovisionActorComponent[];
  public action?: CodeableConcept[];
  public securityLabel?: Coding[];
  public purpose?: Coding[];
  public class?: Coding[];
  public code?: CodeableConcept[];
  public dataPeriod?: Period;
  public data?: ConsentprovisionDataComponent[];
  public provision?: ConsentprovisionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = [];
        for (const o of obj.actor || []) {
          this.actor.push(new ConsentprovisionActorComponent(o));
        }
      }
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('securityLabel')) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = [];
        for (const o of obj.purpose || []) {
          this.purpose.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('class')) {
        this.class = [];
        for (const o of obj.class || []) {
          this.class.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('dataPeriod')) {
        this.dataPeriod = new Period(obj.dataPeriod);
      }
      if (obj.hasOwnProperty('data')) {
        this.data = [];
        for (const o of obj.data || []) {
          this.data.push(new ConsentprovisionDataComponent(o));
        }
      }
      if (obj.hasOwnProperty('provision')) {
        this.provision = [];
        for (const o of obj.provision || []) {
          this.provision.push(new ConsentprovisionComponent(o));
        }
      }
    }
  }

}

export class Consent extends DomainResource {
  public resourceType = 'Consent';
  public identifier?: Identifier[];
  public status: string;
  public scope: CodeableConcept;
  public category: CodeableConcept[];
  public patient?: ResourceReference;
  public dateTime?: Date;
  public performer?: ResourceReference[];
  public organization?: ResourceReference[];
  public source?: Element;
  public policy?: ConsentPolicyComponent[];
  public policyRule?: CodeableConcept;
  public verification?: ConsentVerificationComponent[];
  public provision?: ConsentprovisionComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('scope')) {
        this.scope = new CodeableConcept(obj.scope);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('dateTime')) {
        this.dateTime = obj.dateTime;
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('organization')) {
        this.organization = [];
        for (const o of obj.organization || []) {
          this.organization.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new Element(obj.source);
      }
      if (obj.hasOwnProperty('policy')) {
        this.policy = [];
        for (const o of obj.policy || []) {
          this.policy.push(new ConsentPolicyComponent(o));
        }
      }
      if (obj.hasOwnProperty('policyRule')) {
        this.policyRule = new CodeableConcept(obj.policyRule);
      }
      if (obj.hasOwnProperty('verification')) {
        this.verification = [];
        for (const o of obj.verification || []) {
          this.verification.push(new ConsentVerificationComponent(o));
        }
      }
      if (obj.hasOwnProperty('provision')) {
        this.provision = new ConsentprovisionComponent(obj.provision);
      }
    }
  }

}

export class ContractContentDefinitionComponent extends BackboneElement {
  public type: CodeableConcept;
  public subType?: CodeableConcept;
  public publisher?: ResourceReference;
  public publicationDate?: Date;
  public publicationStatus: string;
  public copyright?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subType')) {
        this.subType = new CodeableConcept(obj.subType);
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = new ResourceReference(obj.publisher);
      }
      if (obj.hasOwnProperty('publicationDate')) {
        this.publicationDate = obj.publicationDate;
      }
      if (obj.hasOwnProperty('publicationStatus')) {
        this.publicationStatus = obj.publicationStatus;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
    }
  }

}

export class ContractSecurityLabelComponent extends BackboneElement {
  public number?: number[];
  public classification: Coding;
  public category?: Coding[];
  public control?: Coding[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('number')) {
        this.number = obj.number;
      }
      if (obj.hasOwnProperty('classification')) {
        this.classification = new Coding(obj.classification);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('control')) {
        this.control = [];
        for (const o of obj.control || []) {
          this.control.push(new Coding(o));
        }
      }
    }
  }

}

export class ContractContractPartyComponent extends BackboneElement {
  public reference: ResourceReference[];
  public role: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('reference')) {
        this.reference = [];
        for (const o of obj.reference || []) {
          this.reference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
    }
  }

}

export class ContractAnswerComponent extends BackboneElement {
  public value: Element;        // TODO: Replace with parameters for each option

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class ContractContractOfferComponent extends BackboneElement {
  public identifier?: Identifier[];
  public party?: ContractContractPartyComponent[];
  public topic?: ResourceReference;
  public type?: CodeableConcept;
  public decision?: CodeableConcept;
  public decisionMode?: CodeableConcept[];
  public answer?: ContractAnswerComponent[];
  public text?: string;
  public linkId?: string[];
  public securityLabelNumber?: number[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('party')) {
        this.party = [];
        for (const o of obj.party || []) {
          this.party.push(new ContractContractPartyComponent(o));
        }
      }
      if (obj.hasOwnProperty('topic')) {
        this.topic = new ResourceReference(obj.topic);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('decision')) {
        this.decision = new CodeableConcept(obj.decision);
      }
      if (obj.hasOwnProperty('decisionMode')) {
        this.decisionMode = [];
        for (const o of obj.decisionMode || []) {
          this.decisionMode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('answer')) {
        this.answer = [];
        for (const o of obj.answer || []) {
          this.answer.push(new ContractAnswerComponent(o));
        }
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('linkId')) {
        this.linkId = obj.linkId;
      }
      if (obj.hasOwnProperty('securityLabelNumber')) {
        this.securityLabelNumber = obj.securityLabelNumber;
      }
    }
  }

}

export class ContractAssetContextComponent extends BackboneElement {
  public reference?: ResourceReference;
  public code?: CodeableConcept[];
  public text?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('reference')) {
        this.reference = new ResourceReference(obj.reference);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
    }
  }

}

export class ContractValuedItemComponent extends BackboneElement {
  public entity?: Element;
  public identifier?: Identifier;
  public effectiveTime?: Date;
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public points?: number;
  public net?: Money;
  public payment?: string;
  public paymentDate?: Date;
  public responsible?: ResourceReference;
  public recipient?: ResourceReference;
  public linkId?: string[];
  public securityLabelNumber?: number[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('entity')) {
        this.entity = new Element(obj.entity);
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('effectiveTime')) {
        this.effectiveTime = obj.effectiveTime;
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('points')) {
        this.points = obj.points;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('payment')) {
        this.payment = obj.payment;
      }
      if (obj.hasOwnProperty('paymentDate')) {
        this.paymentDate = obj.paymentDate;
      }
      if (obj.hasOwnProperty('responsible')) {
        this.responsible = new ResourceReference(obj.responsible);
      }
      if (obj.hasOwnProperty('recipient')) {
        this.recipient = new ResourceReference(obj.recipient);
      }
      if (obj.hasOwnProperty('linkId')) {
        this.linkId = obj.linkId;
      }
      if (obj.hasOwnProperty('securityLabelNumber')) {
        this.securityLabelNumber = obj.securityLabelNumber;
      }
    }
  }

}

export class ContractContractAssetComponent extends BackboneElement {
  public scope?: CodeableConcept;
  public type?: CodeableConcept[];
  public typeReference?: ResourceReference[];
  public subtype?: CodeableConcept[];
  public relationship?: Coding;
  public context?: ContractAssetContextComponent[];
  public condition?: string;
  public periodType?: CodeableConcept[];
  public period?: Period[];
  public usePeriod?: Period[];
  public text?: string;
  public linkId?: string[];
  public answer?: ContractAnswerComponent[];
  public securityLabelNumber?: number[];
  public valuedItem?: ContractValuedItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('scope')) {
        this.scope = new CodeableConcept(obj.scope);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('typeReference')) {
        this.typeReference = [];
        for (const o of obj.typeReference || []) {
          this.typeReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('subtype')) {
        this.subtype = [];
        for (const o of obj.subtype || []) {
          this.subtype.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = new Coding(obj.relationship);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = [];
        for (const o of obj.context || []) {
          this.context.push(new ContractAssetContextComponent(o));
        }
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = obj.condition;
      }
      if (obj.hasOwnProperty('periodType')) {
        this.periodType = [];
        for (const o of obj.periodType || []) {
          this.periodType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('period')) {
        this.period = [];
        for (const o of obj.period || []) {
          this.period.push(new Period(o));
        }
      }
      if (obj.hasOwnProperty('usePeriod')) {
        this.usePeriod = [];
        for (const o of obj.usePeriod || []) {
          this.usePeriod.push(new Period(o));
        }
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('linkId')) {
        this.linkId = obj.linkId;
      }
      if (obj.hasOwnProperty('answer')) {
        this.answer = [];
        for (const o of obj.answer || []) {
          this.answer.push(new ContractAnswerComponent(o));
        }
      }
      if (obj.hasOwnProperty('securityLabelNumber')) {
        this.securityLabelNumber = obj.securityLabelNumber;
      }
      if (obj.hasOwnProperty('valuedItem')) {
        this.valuedItem = [];
        for (const o of obj.valuedItem || []) {
          this.valuedItem.push(new ContractValuedItemComponent(o));
        }
      }
    }
  }

}

export class ContractActionSubjectComponent extends BackboneElement {
  public reference: ResourceReference[];
  public role?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('reference')) {
        this.reference = [];
        for (const o of obj.reference || []) {
          this.reference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
    }
  }

}

export class ContractActionComponent extends BackboneElement {
  public doNotPerform?: boolean;
  public type: CodeableConcept;
  public subject?: ContractActionSubjectComponent[];
  public intent: CodeableConcept;
  public linkId?: string[];
  public status: CodeableConcept;
  public context?: ResourceReference;
  public contextLinkId?: string[];
  public occurrence?: Element;
  public requester?: ResourceReference[];
  public requesterLinkId?: string[];
  public performerType?: CodeableConcept[];
  public performerRole?: CodeableConcept;
  public performer?: ResourceReference;
  public performerLinkId?: string[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public reason?: string[];
  public reasonLinkId?: string[];
  public note?: Annotation[];
  public securityLabelNumber?: number[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('doNotPerform')) {
        this.doNotPerform = obj.doNotPerform;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = [];
        for (const o of obj.subject || []) {
          this.subject.push(new ContractActionSubjectComponent(o));
        }
      }
      if (obj.hasOwnProperty('intent')) {
        this.intent = new CodeableConcept(obj.intent);
      }
      if (obj.hasOwnProperty('linkId')) {
        this.linkId = obj.linkId;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = new CodeableConcept(obj.status);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('contextLinkId')) {
        this.contextLinkId = obj.contextLinkId;
      }
      if (obj.hasOwnProperty('occurrence')) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.hasOwnProperty('requester')) {
        this.requester = [];
        for (const o of obj.requester || []) {
          this.requester.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('requesterLinkId')) {
        this.requesterLinkId = obj.requesterLinkId;
      }
      if (obj.hasOwnProperty('performerType')) {
        this.performerType = [];
        for (const o of obj.performerType || []) {
          this.performerType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('performerRole')) {
        this.performerRole = new CodeableConcept(obj.performerRole);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.hasOwnProperty('performerLinkId')) {
        this.performerLinkId = obj.performerLinkId;
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = obj.reason;
      }
      if (obj.hasOwnProperty('reasonLinkId')) {
        this.reasonLinkId = obj.reasonLinkId;
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('securityLabelNumber')) {
        this.securityLabelNumber = obj.securityLabelNumber;
      }
    }
  }

}

export class ContractTermComponent extends BackboneElement {
  public identifier?: Identifier;
  public issued?: Date;
  public applies?: Period;
  public topic?: Element;
  public type?: CodeableConcept;
  public subType?: CodeableConcept;
  public text?: string;
  public securityLabel?: ContractSecurityLabelComponent[];
  public offer: ContractContractOfferComponent;
  public asset?: ContractContractAssetComponent[];
  public action?: ContractActionComponent[];
  public group?: ContractTermComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('issued')) {
        this.issued = obj.issued;
      }
      if (obj.hasOwnProperty('applies')) {
        this.applies = new Period(obj.applies);
      }
      if (obj.hasOwnProperty('topic')) {
        this.topic = new Element(obj.topic);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subType')) {
        this.subType = new CodeableConcept(obj.subType);
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('securityLabel')) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new ContractSecurityLabelComponent(o));
        }
      }
      if (obj.hasOwnProperty('offer')) {
        this.offer = new ContractContractOfferComponent(obj.offer);
      }
      if (obj.hasOwnProperty('asset')) {
        this.asset = [];
        for (const o of obj.asset || []) {
          this.asset.push(new ContractContractAssetComponent(o));
        }
      }
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new ContractActionComponent(o));
        }
      }
      if (obj.hasOwnProperty('group')) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new ContractTermComponent(o));
        }
      }
    }
  }

}

export class ContractSignatoryComponent extends BackboneElement {
  public type: Coding;
  public party: ResourceReference;
  public signature: Signature[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new Coding(obj.type);
      }
      if (obj.hasOwnProperty('party')) {
        this.party = new ResourceReference(obj.party);
      }
      if (obj.hasOwnProperty('signature')) {
        this.signature = [];
        for (const o of obj.signature || []) {
          this.signature.push(new Signature(o));
        }
      }
    }
  }

}

export class ContractFriendlyLanguageComponent extends BackboneElement {
  public content: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('content')) {
        this.content = new Element(obj.content);
      }
    }
  }

}

export class ContractLegalLanguageComponent extends BackboneElement {
  public content: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('content')) {
        this.content = new Element(obj.content);
      }
    }
  }

}

export class ContractComputableLanguageComponent extends BackboneElement {
  public content: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('content')) {
        this.content = new Element(obj.content);
      }
    }
  }

}

export class Contract extends DomainResource {
  public resourceType = 'Contract';
  public identifier?: Identifier[];
  public url?: string;
  public version?: string;
  public status?: string;
  public legalState?: CodeableConcept;
  public instantiatesCanonical?: ResourceReference;
  public instantiatesUri?: string;
  public contentDerivative?: CodeableConcept;
  public issued?: Date;
  public applies?: Period;
  public expirationType?: CodeableConcept;
  public subject?: ResourceReference[];
  public authority?: ResourceReference[];
  public domain?: ResourceReference[];
  public site?: ResourceReference[];
  public name?: string;
  public title?: string;
  public subtitle?: string;
  public alias?: string[];
  public author?: ResourceReference;
  public scope?: CodeableConcept;
  public topic?: Element;
  public type?: CodeableConcept;
  public subType?: CodeableConcept[];
  public contentDefinition?: ContractContentDefinitionComponent;
  public term?: ContractTermComponent[];
  public supportingInfo?: ResourceReference[];
  public relevantHistory?: ResourceReference[];
  public signer?: ContractSignatoryComponent[];
  public friendly?: ContractFriendlyLanguageComponent[];
  public legal?: ContractLegalLanguageComponent[];
  public rule?: ContractComputableLanguageComponent[];
  public legallyBinding?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('legalState')) {
        this.legalState = new CodeableConcept(obj.legalState);
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = new ResourceReference(obj.instantiatesCanonical);
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('contentDerivative')) {
        this.contentDerivative = new CodeableConcept(obj.contentDerivative);
      }
      if (obj.hasOwnProperty('issued')) {
        this.issued = obj.issued;
      }
      if (obj.hasOwnProperty('applies')) {
        this.applies = new Period(obj.applies);
      }
      if (obj.hasOwnProperty('expirationType')) {
        this.expirationType = new CodeableConcept(obj.expirationType);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = [];
        for (const o of obj.subject || []) {
          this.subject.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('authority')) {
        this.authority = [];
        for (const o of obj.authority || []) {
          this.authority.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('domain')) {
        this.domain = [];
        for (const o of obj.domain || []) {
          this.domain.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('site')) {
        this.site = [];
        for (const o of obj.site || []) {
          this.site.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('subtitle')) {
        this.subtitle = obj.subtitle;
      }
      if (obj.hasOwnProperty('alias')) {
        this.alias = obj.alias;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.hasOwnProperty('scope')) {
        this.scope = new CodeableConcept(obj.scope);
      }
      if (obj.hasOwnProperty('topic')) {
        this.topic = new Element(obj.topic);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subType')) {
        this.subType = [];
        for (const o of obj.subType || []) {
          this.subType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('contentDefinition')) {
        this.contentDefinition = new ContractContentDefinitionComponent(obj.contentDefinition);
      }
      if (obj.hasOwnProperty('term')) {
        this.term = [];
        for (const o of obj.term || []) {
          this.term.push(new ContractTermComponent(o));
        }
      }
      if (obj.hasOwnProperty('supportingInfo')) {
        this.supportingInfo = [];
        for (const o of obj.supportingInfo || []) {
          this.supportingInfo.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('relevantHistory')) {
        this.relevantHistory = [];
        for (const o of obj.relevantHistory || []) {
          this.relevantHistory.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('signer')) {
        this.signer = [];
        for (const o of obj.signer || []) {
          this.signer.push(new ContractSignatoryComponent(o));
        }
      }
      if (obj.hasOwnProperty('friendly')) {
        this.friendly = [];
        for (const o of obj.friendly || []) {
          this.friendly.push(new ContractFriendlyLanguageComponent(o));
        }
      }
      if (obj.hasOwnProperty('legal')) {
        this.legal = [];
        for (const o of obj.legal || []) {
          this.legal.push(new ContractLegalLanguageComponent(o));
        }
      }
      if (obj.hasOwnProperty('rule')) {
        this.rule = [];
        for (const o of obj.rule || []) {
          this.rule.push(new ContractComputableLanguageComponent(o));
        }
      }
      if (obj.hasOwnProperty('legallyBinding')) {
        this.legallyBinding = new Element(obj.legallyBinding);
      }
    }
  }

}

export class Contributor extends Element {
  public type: string;
  public name: string;
  public contact?: ContactDetail[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
    }
  }

}

export class Count extends Quantity {

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class CoverageClassComponent extends BackboneElement {
  public type: Coding;
  public value: string;
  public name?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new Coding(obj.type);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
    }
  }

}

export class CoverageCoPayComponent extends BackboneElement {
  public type?: Coding;
  public value: Quantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new Coding(obj.type);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Quantity(obj.value);
      }
    }
  }

}

export class Coverage extends DomainResource {
  public resourceType = 'Coverage';
  public identifier?: Identifier[];
  public status?: string;
  public type?: CodeableConcept;
  public policyHolder?: ResourceReference;
  public subscriber?: ResourceReference;
  public subscriberId?: string;
  public beneficiary?: ResourceReference;
  public dependent?: string;
  public relationship?: CodeableConcept;
  public period?: Period;
  public payor?: ResourceReference[];
  public class?: CoverageClassComponent[];
  public order?: number;
  public network?: string;
  public copay?: CoverageCoPayComponent[];
  public contract?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('policyHolder')) {
        this.policyHolder = new ResourceReference(obj.policyHolder);
      }
      if (obj.hasOwnProperty('subscriber')) {
        this.subscriber = new ResourceReference(obj.subscriber);
      }
      if (obj.hasOwnProperty('subscriberId')) {
        this.subscriberId = obj.subscriberId;
      }
      if (obj.hasOwnProperty('beneficiary')) {
        this.beneficiary = new ResourceReference(obj.beneficiary);
      }
      if (obj.hasOwnProperty('dependent')) {
        this.dependent = obj.dependent;
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = new CodeableConcept(obj.relationship);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('payor')) {
        this.payor = [];
        for (const o of obj.payor || []) {
          this.payor.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('class')) {
        this.class = [];
        for (const o of obj.class || []) {
          this.class.push(new CoverageClassComponent(o));
        }
      }
      if (obj.hasOwnProperty('order')) {
        this.order = obj.order;
      }
      if (obj.hasOwnProperty('network')) {
        this.network = obj.network;
      }
      if (obj.hasOwnProperty('copay')) {
        this.copay = [];
        for (const o of obj.copay || []) {
          this.copay.push(new CoverageCoPayComponent(o));
        }
      }
      if (obj.hasOwnProperty('contract')) {
        this.contract = [];
        for (const o of obj.contract || []) {
          this.contract.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class CoverageEligibilityRequestInformationComponent extends BackboneElement {
  public sequence: number;
  public information: ResourceReference;
  public appliesToAll?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('information')) {
        this.information = new ResourceReference(obj.information);
      }
      if (obj.hasOwnProperty('appliesToAll')) {
        this.appliesToAll = obj.appliesToAll;
      }
    }
  }

}

export class CoverageEligibilityRequestInsuranceComponent extends BackboneElement {
  public focal?: boolean;
  public coverage: ResourceReference;
  public businessArrangement?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('focal')) {
        this.focal = obj.focal;
      }
      if (obj.hasOwnProperty('coverage')) {
        this.coverage = new ResourceReference(obj.coverage);
      }
      if (obj.hasOwnProperty('businessArrangement')) {
        this.businessArrangement = obj.businessArrangement;
      }
    }
  }

}

export class CoverageEligibilityRequestDiagnosisComponent extends BackboneElement {
  public diagnosis?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('diagnosis')) {
        this.diagnosis = new Element(obj.diagnosis);
      }
    }
  }

}

export class CoverageEligibilityRequestDetailsComponent extends BackboneElement {
  public supportingInformationSequence?: number[];
  public category?: CodeableConcept;
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public provider?: ResourceReference;
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public facility?: ResourceReference;
  public diagnosis?: CoverageEligibilityRequestDiagnosisComponent[];
  public detail?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('supportingInformationSequence')) {
        this.supportingInformationSequence = obj.supportingInformationSequence;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('facility')) {
        this.facility = new ResourceReference(obj.facility);
      }
      if (obj.hasOwnProperty('diagnosis')) {
        this.diagnosis = [];
        for (const o of obj.diagnosis || []) {
          this.diagnosis.push(new CoverageEligibilityRequestDiagnosisComponent(o));
        }
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class CoverageEligibilityRequest extends DomainResource {
  public resourceType = 'CoverageEligibilityRequest';
  public identifier?: Identifier[];
  public status?: string;
  public priority?: CodeableConcept;
  public purpose: string[];
  public patient?: ResourceReference;
  public serviced?: Element;
  public created?: Date;
  public enterer?: ResourceReference;
  public provider?: ResourceReference;
  public insurer?: ResourceReference;
  public facility?: ResourceReference;
  public supportingInformation?: CoverageEligibilityRequestInformationComponent[];
  public insurance?: CoverageEligibilityRequestInsuranceComponent[];
  public item?: CoverageEligibilityRequestDetailsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('serviced')) {
        this.serviced = new Element(obj.serviced);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('enterer')) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('insurer')) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.hasOwnProperty('facility')) {
        this.facility = new ResourceReference(obj.facility);
      }
      if (obj.hasOwnProperty('supportingInformation')) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new CoverageEligibilityRequestInformationComponent(o));
        }
      }
      if (obj.hasOwnProperty('insurance')) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new CoverageEligibilityRequestInsuranceComponent(o));
        }
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new CoverageEligibilityRequestDetailsComponent(o));
        }
      }
    }
  }

}

export class CoverageEligibilityResponseBenefitComponent extends BackboneElement {
  public type: CodeableConcept;
  public allowed?: Element;
  public used?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('allowed')) {
        this.allowed = new Element(obj.allowed);
      }
      if (obj.hasOwnProperty('used')) {
        this.used = new Element(obj.used);
      }
    }
  }

}

export class CoverageEligibilityResponseItemsComponent extends BackboneElement {
  public category?: CodeableConcept;
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public provider?: ResourceReference;
  public excluded?: boolean;
  public name?: string;
  public description?: string;
  public network?: CodeableConcept;
  public unit?: CodeableConcept;
  public term?: CodeableConcept;
  public benefit?: CoverageEligibilityResponseBenefitComponent[];
  public authorizationRequired?: boolean;
  public authorizationSupporting?: CodeableConcept[];
  public authorizationUrl?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('excluded')) {
        this.excluded = obj.excluded;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('network')) {
        this.network = new CodeableConcept(obj.network);
      }
      if (obj.hasOwnProperty('unit')) {
        this.unit = new CodeableConcept(obj.unit);
      }
      if (obj.hasOwnProperty('term')) {
        this.term = new CodeableConcept(obj.term);
      }
      if (obj.hasOwnProperty('benefit')) {
        this.benefit = [];
        for (const o of obj.benefit || []) {
          this.benefit.push(new CoverageEligibilityResponseBenefitComponent(o));
        }
      }
      if (obj.hasOwnProperty('authorizationRequired')) {
        this.authorizationRequired = obj.authorizationRequired;
      }
      if (obj.hasOwnProperty('authorizationSupporting')) {
        this.authorizationSupporting = [];
        for (const o of obj.authorizationSupporting || []) {
          this.authorizationSupporting.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('authorizationUrl')) {
        this.authorizationUrl = obj.authorizationUrl;
      }
    }
  }

}

export class CoverageEligibilityResponseInsuranceComponent extends BackboneElement {
  public coverage?: ResourceReference;
  public contract?: ResourceReference;
  public inforce?: boolean;
  public item?: CoverageEligibilityResponseItemsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('coverage')) {
        this.coverage = new ResourceReference(obj.coverage);
      }
      if (obj.hasOwnProperty('contract')) {
        this.contract = new ResourceReference(obj.contract);
      }
      if (obj.hasOwnProperty('inforce')) {
        this.inforce = obj.inforce;
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new CoverageEligibilityResponseItemsComponent(o));
        }
      }
    }
  }

}

export class CoverageEligibilityResponseErrorsComponent extends BackboneElement {
  public code: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
    }
  }

}

export class CoverageEligibilityResponse extends DomainResource {
  public resourceType = 'CoverageEligibilityResponse';
  public identifier?: Identifier[];
  public status?: string;
  public purpose: string[];
  public patient?: ResourceReference;
  public serviced?: Element;
  public created?: Date;
  public requestProvider?: ResourceReference;
  public request?: ResourceReference;
  public outcome?: string;
  public disposition?: string;
  public insurer?: ResourceReference;
  public insurance?: CoverageEligibilityResponseInsuranceComponent[];
  public preAuthRef?: string;
  public form?: CodeableConcept;
  public error?: CoverageEligibilityResponseErrorsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('serviced')) {
        this.serviced = new Element(obj.serviced);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('requestProvider')) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = obj.outcome;
      }
      if (obj.hasOwnProperty('disposition')) {
        this.disposition = obj.disposition;
      }
      if (obj.hasOwnProperty('insurer')) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.hasOwnProperty('insurance')) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new CoverageEligibilityResponseInsuranceComponent(o));
        }
      }
      if (obj.hasOwnProperty('preAuthRef')) {
        this.preAuthRef = obj.preAuthRef;
      }
      if (obj.hasOwnProperty('form')) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.hasOwnProperty('error')) {
        this.error = [];
        for (const o of obj.error || []) {
          this.error.push(new CoverageEligibilityResponseErrorsComponent(o));
        }
      }
    }
  }

}

export class DataElement {

  constructor(obj?: any) {
    if (obj) {
    }
  }

}

export class DataRequirementCodeFilterComponent extends Element {
  public path?: string;
  public searchParam?: string;
  public valueSet?: string;
  public code?: Coding[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('searchParam')) {
        this.searchParam = obj.searchParam;
      }
      if (obj.hasOwnProperty('valueSet')) {
        this.valueSet = obj.valueSet;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new Coding(o));
        }
      }
    }
  }

}

export class DataRequirementDateFilterComponent extends Element {
  public path?: string;
  public searchParam?: string;
  public value?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('searchParam')) {
        this.searchParam = obj.searchParam;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class DataRequirementSortComponent extends Element {
  public path: string;
  public direction: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('direction')) {
        this.direction = obj.direction;
      }
    }
  }

}

export class DataRequirement extends Element {
  public type: string;
  public profile?: string[];
  public subject?: Element;
  public mustSupport?: string[];
  public codeFilter?: DataRequirementCodeFilterComponent[];
  public dateFilter?: DataRequirementDateFilterComponent[];
  public limit?: number;
  public sort?: DataRequirementSortComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new Element(obj.subject);
      }
      if (obj.hasOwnProperty('mustSupport')) {
        this.mustSupport = obj.mustSupport;
      }
      if (obj.hasOwnProperty('codeFilter')) {
        this.codeFilter = [];
        for (const o of obj.codeFilter || []) {
          this.codeFilter.push(new DataRequirementCodeFilterComponent(o));
        }
      }
      if (obj.hasOwnProperty('dateFilter')) {
        this.dateFilter = [];
        for (const o of obj.dateFilter || []) {
          this.dateFilter.push(new DataRequirementDateFilterComponent(o));
        }
      }
      if (obj.hasOwnProperty('limit')) {
        this.limit = obj.limit;
      }
      if (obj.hasOwnProperty('sort')) {
        this.sort = [];
        for (const o of obj.sort || []) {
          this.sort.push(new DataRequirementSortComponent(o));
        }
      }
    }
  }

}

export class DetectedIssueMitigationComponent extends BackboneElement {
  public action: CodeableConcept;
  public date?: Date;
  public author?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('action')) {
        this.action = new CodeableConcept(obj.action);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
    }
  }

}

export class DetectedIssue extends DomainResource {
  public resourceType = 'DetectedIssue';
  public identifier?: Identifier[];
  public status: string;
  public category?: CodeableConcept;
  public severity?: string;
  public patient?: ResourceReference;
  public date?: Date;
  public author?: ResourceReference;
  public implicated?: ResourceReference[];
  public detail?: string;
  public reference?: string;
  public mitigation?: DetectedIssueMitigationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('severity')) {
        this.severity = obj.severity;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.hasOwnProperty('implicated')) {
        this.implicated = [];
        for (const o of obj.implicated || []) {
          this.implicated.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = obj.detail;
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = obj.reference;
      }
      if (obj.hasOwnProperty('mitigation')) {
        this.mitigation = [];
        for (const o of obj.mitigation || []) {
          this.mitigation.push(new DetectedIssueMitigationComponent(o));
        }
      }
    }
  }

}

export class DeviceUdiCarrierComponent extends BackboneElement {
  public deviceIdentifier?: string;
  public issuer?: string;
  public jurisdiction?: string;
  public carrierAIDC?: string;
  public carrierHRF?: string;
  public entryType?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('deviceIdentifier')) {
        this.deviceIdentifier = obj.deviceIdentifier;
      }
      if (obj.hasOwnProperty('issuer')) {
        this.issuer = obj.issuer;
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = obj.jurisdiction;
      }
      if (obj.hasOwnProperty('carrierAIDC')) {
        this.carrierAIDC = obj.carrierAIDC;
      }
      if (obj.hasOwnProperty('carrierHRF')) {
        this.carrierHRF = obj.carrierHRF;
      }
      if (obj.hasOwnProperty('entryType')) {
        this.entryType = obj.entryType;
      }
    }
  }

}

export class DeviceDeviceNameComponent extends BackboneElement {
  public name: string;
  public type: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
    }
  }

}

export class DeviceSpecializationComponent extends BackboneElement {
  public systemType: CodeableConcept;
  public version?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('systemType')) {
        this.systemType = new CodeableConcept(obj.systemType);
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
    }
  }

}

export class DeviceVersionComponent extends BackboneElement {
  public type?: CodeableConcept;
  public component?: Identifier;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('component')) {
        this.component = new Identifier(obj.component);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class DevicePropertyComponent extends BackboneElement {
  public type: CodeableConcept;
  public valueQuanity?: Quantity[];
  public valueCode?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('valueQuanity')) {
        this.valueQuanity = [];
        for (const o of obj.valueQuanity || []) {
          this.valueQuanity.push(new Quantity(o));
        }
      }
      if (obj.hasOwnProperty('valueCode')) {
        this.valueCode = [];
        for (const o of obj.valueCode || []) {
          this.valueCode.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class Device extends DomainResource {
  public resourceType = 'Device';
  public identifier?: Identifier[];
  public definition?: ResourceReference;
  public udiCarrier?: DeviceUdiCarrierComponent[];
  public status?: string;
  public statusReason?: CodeableConcept[];
  public distinctIdentificationCode?: string;
  public manufacturer?: string;
  public manufactureDate?: Date;
  public expirationDate?: Date;
  public lotNumber?: string;
  public serialNumber?: string;
  public deviceName?: DeviceDeviceNameComponent[];
  public modelNumber?: string;
  public partNumber?: string;
  public type?: CodeableConcept;
  public specialization?: DeviceSpecializationComponent[];
  public version?: DeviceVersionComponent[];
  public property?: DevicePropertyComponent[];
  public patient?: ResourceReference;
  public owner?: ResourceReference;
  public contact?: ContactPoint[];
  public location?: ResourceReference;
  public url?: string;
  public note?: Annotation[];
  public safety?: CodeableConcept[];
  public parent?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = new ResourceReference(obj.definition);
      }
      if (obj.hasOwnProperty('udiCarrier')) {
        this.udiCarrier = [];
        for (const o of obj.udiCarrier || []) {
          this.udiCarrier.push(new DeviceUdiCarrierComponent(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = [];
        for (const o of obj.statusReason || []) {
          this.statusReason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('distinctIdentificationCode')) {
        this.distinctIdentificationCode = obj.distinctIdentificationCode;
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = obj.manufacturer;
      }
      if (obj.hasOwnProperty('manufactureDate')) {
        this.manufactureDate = obj.manufactureDate;
      }
      if (obj.hasOwnProperty('expirationDate')) {
        this.expirationDate = obj.expirationDate;
      }
      if (obj.hasOwnProperty('lotNumber')) {
        this.lotNumber = obj.lotNumber;
      }
      if (obj.hasOwnProperty('serialNumber')) {
        this.serialNumber = obj.serialNumber;
      }
      if (obj.hasOwnProperty('deviceName')) {
        this.deviceName = [];
        for (const o of obj.deviceName || []) {
          this.deviceName.push(new DeviceDeviceNameComponent(o));
        }
      }
      if (obj.hasOwnProperty('modelNumber')) {
        this.modelNumber = obj.modelNumber;
      }
      if (obj.hasOwnProperty('partNumber')) {
        this.partNumber = obj.partNumber;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('specialization')) {
        this.specialization = [];
        for (const o of obj.specialization || []) {
          this.specialization.push(new DeviceSpecializationComponent(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = [];
        for (const o of obj.version || []) {
          this.version.push(new DeviceVersionComponent(o));
        }
      }
      if (obj.hasOwnProperty('property')) {
        this.property = [];
        for (const o of obj.property || []) {
          this.property.push(new DevicePropertyComponent(o));
        }
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('owner')) {
        this.owner = new ResourceReference(obj.owner);
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('safety')) {
        this.safety = [];
        for (const o of obj.safety || []) {
          this.safety.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('parent')) {
        this.parent = new ResourceReference(obj.parent);
      }
    }
  }

}

export class DeviceDefinitionUdiDeviceIdentifierComponent extends BackboneElement {
  public deviceIdentifier: string;
  public issuer: string;
  public jurisdiction: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('deviceIdentifier')) {
        this.deviceIdentifier = obj.deviceIdentifier;
      }
      if (obj.hasOwnProperty('issuer')) {
        this.issuer = obj.issuer;
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = obj.jurisdiction;
      }
    }
  }

}

export class DeviceDefinitionDeviceNameComponent extends BackboneElement {
  public name: string;
  public type: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
    }
  }

}

export class DeviceDefinitionSpecializationComponent extends BackboneElement {
  public systemType: string;
  public version?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('systemType')) {
        this.systemType = obj.systemType;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
    }
  }

}

export class ProductShelfLife extends BackboneElement {
  public identifier?: Identifier;
  public type: CodeableConcept;
  public period: Quantity;
  public specialPrecautionsForStorage?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Quantity(obj.period);
      }
      if (obj.hasOwnProperty('specialPrecautionsForStorage')) {
        this.specialPrecautionsForStorage = [];
        for (const o of obj.specialPrecautionsForStorage || []) {
          this.specialPrecautionsForStorage.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class ProdCharacteristic extends BackboneElement {
  public height?: Quantity;
  public width?: Quantity;
  public depth?: Quantity;
  public weight?: Quantity;
  public nominalVolume?: Quantity;
  public externalDiameter?: Quantity;
  public shape?: string;
  public color?: string[];
  public imprint?: string[];
  public image?: Attachment[];
  public scoring?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('height')) {
        this.height = new Quantity(obj.height);
      }
      if (obj.hasOwnProperty('width')) {
        this.width = new Quantity(obj.width);
      }
      if (obj.hasOwnProperty('depth')) {
        this.depth = new Quantity(obj.depth);
      }
      if (obj.hasOwnProperty('weight')) {
        this.weight = new Quantity(obj.weight);
      }
      if (obj.hasOwnProperty('nominalVolume')) {
        this.nominalVolume = new Quantity(obj.nominalVolume);
      }
      if (obj.hasOwnProperty('externalDiameter')) {
        this.externalDiameter = new Quantity(obj.externalDiameter);
      }
      if (obj.hasOwnProperty('shape')) {
        this.shape = obj.shape;
      }
      if (obj.hasOwnProperty('color')) {
        this.color = obj.color;
      }
      if (obj.hasOwnProperty('imprint')) {
        this.imprint = obj.imprint;
      }
      if (obj.hasOwnProperty('image')) {
        this.image = [];
        for (const o of obj.image || []) {
          this.image.push(new Attachment(o));
        }
      }
      if (obj.hasOwnProperty('scoring')) {
        this.scoring = new CodeableConcept(obj.scoring);
      }
    }
  }

}

export class DeviceDefinitionCapabilityComponent extends BackboneElement {
  public type: CodeableConcept;
  public description?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = [];
        for (const o of obj.description || []) {
          this.description.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class DeviceDefinitionPropertyComponent extends BackboneElement {
  public type: CodeableConcept;
  public valueQuanity?: Quantity[];
  public valueCode?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('valueQuanity')) {
        this.valueQuanity = [];
        for (const o of obj.valueQuanity || []) {
          this.valueQuanity.push(new Quantity(o));
        }
      }
      if (obj.hasOwnProperty('valueCode')) {
        this.valueCode = [];
        for (const o of obj.valueCode || []) {
          this.valueCode.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class DeviceDefinitionMaterialComponent extends BackboneElement {
  public substance: CodeableConcept;
  public alternate?: boolean;
  public allergenicIndicator?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('substance')) {
        this.substance = new CodeableConcept(obj.substance);
      }
      if (obj.hasOwnProperty('alternate')) {
        this.alternate = obj.alternate;
      }
      if (obj.hasOwnProperty('allergenicIndicator')) {
        this.allergenicIndicator = obj.allergenicIndicator;
      }
    }
  }

}

export class DeviceDefinition extends DomainResource {
  public resourceType = 'DeviceDefinition';
  public identifier?: Identifier[];
  public udiDeviceIdentifier?: DeviceDefinitionUdiDeviceIdentifierComponent[];
  public manufacturer?: Element;
  public deviceName?: DeviceDefinitionDeviceNameComponent[];
  public modelNumber?: string;
  public type?: CodeableConcept;
  public specialization?: DeviceDefinitionSpecializationComponent[];
  public version?: string[];
  public safety?: CodeableConcept[];
  public shelfLifeStorage?: ProductShelfLife[];
  public physicalCharacteristics?: ProdCharacteristic;
  public languageCode?: CodeableConcept[];
  public capability?: DeviceDefinitionCapabilityComponent[];
  public property?: DeviceDefinitionPropertyComponent[];
  public owner?: ResourceReference;
  public contact?: ContactPoint[];
  public url?: string;
  public onlineInformation?: string;
  public note?: Annotation[];
  public quantity?: Quantity;
  public parentDevice?: ResourceReference;
  public material?: DeviceDefinitionMaterialComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('udiDeviceIdentifier')) {
        this.udiDeviceIdentifier = [];
        for (const o of obj.udiDeviceIdentifier || []) {
          this.udiDeviceIdentifier.push(new DeviceDefinitionUdiDeviceIdentifierComponent(o));
        }
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = new Element(obj.manufacturer);
      }
      if (obj.hasOwnProperty('deviceName')) {
        this.deviceName = [];
        for (const o of obj.deviceName || []) {
          this.deviceName.push(new DeviceDefinitionDeviceNameComponent(o));
        }
      }
      if (obj.hasOwnProperty('modelNumber')) {
        this.modelNumber = obj.modelNumber;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('specialization')) {
        this.specialization = [];
        for (const o of obj.specialization || []) {
          this.specialization.push(new DeviceDefinitionSpecializationComponent(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('safety')) {
        this.safety = [];
        for (const o of obj.safety || []) {
          this.safety.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('shelfLifeStorage')) {
        this.shelfLifeStorage = [];
        for (const o of obj.shelfLifeStorage || []) {
          this.shelfLifeStorage.push(new ProductShelfLife(o));
        }
      }
      if (obj.hasOwnProperty('physicalCharacteristics')) {
        this.physicalCharacteristics = new ProdCharacteristic(obj.physicalCharacteristics);
      }
      if (obj.hasOwnProperty('languageCode')) {
        this.languageCode = [];
        for (const o of obj.languageCode || []) {
          this.languageCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('capability')) {
        this.capability = [];
        for (const o of obj.capability || []) {
          this.capability.push(new DeviceDefinitionCapabilityComponent(o));
        }
      }
      if (obj.hasOwnProperty('property')) {
        this.property = [];
        for (const o of obj.property || []) {
          this.property.push(new DeviceDefinitionPropertyComponent(o));
        }
      }
      if (obj.hasOwnProperty('owner')) {
        this.owner = new ResourceReference(obj.owner);
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('onlineInformation')) {
        this.onlineInformation = obj.onlineInformation;
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.hasOwnProperty('parentDevice')) {
        this.parentDevice = new ResourceReference(obj.parentDevice);
      }
      if (obj.hasOwnProperty('material')) {
        this.material = [];
        for (const o of obj.material || []) {
          this.material.push(new DeviceDefinitionMaterialComponent(o));
        }
      }
    }
  }

}

export class DeviceMetricCalibrationComponent extends BackboneElement {
  public type?: string;
  public state?: string;
  public time?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('state')) {
        this.state = obj.state;
      }
      if (obj.hasOwnProperty('time')) {
        this.time = obj.time;
      }
    }
  }

}

export class DeviceMetric extends DomainResource {
  public resourceType = 'DeviceMetric';
  public identifier?: Identifier[];
  public type: CodeableConcept;
  public unit?: CodeableConcept;
  public source?: ResourceReference;
  public parent?: ResourceReference;
  public operationalStatus?: string;
  public color?: string;
  public category: string;
  public measurementPeriod?: Timing;
  public calibration?: DeviceMetricCalibrationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('unit')) {
        this.unit = new CodeableConcept(obj.unit);
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.hasOwnProperty('parent')) {
        this.parent = new ResourceReference(obj.parent);
      }
      if (obj.hasOwnProperty('operationalStatus')) {
        this.operationalStatus = obj.operationalStatus;
      }
      if (obj.hasOwnProperty('color')) {
        this.color = obj.color;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = obj.category;
      }
      if (obj.hasOwnProperty('measurementPeriod')) {
        this.measurementPeriod = new Timing(obj.measurementPeriod);
      }
      if (obj.hasOwnProperty('calibration')) {
        this.calibration = [];
        for (const o of obj.calibration || []) {
          this.calibration.push(new DeviceMetricCalibrationComponent(o));
        }
      }
    }
  }

}

export class DeviceRequestParameterComponent extends BackboneElement {
  public code?: CodeableConcept;
  public value?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class DeviceRequest extends DomainResource {
  public resourceType = 'DeviceRequest';
  public identifier?: Identifier[];
  public instantiatesCanonical?: string[];
  public instantiatesUri?: string[];
  public basedOn?: ResourceReference[];
  public priorRequest?: ResourceReference[];
  public groupIdentifier?: Identifier;
  public status?: string;
  public intent: string;
  public priority?: string;
  public code: Element;
  public parameter?: DeviceRequestParameterComponent[];
  public subject: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public authoredOn?: Date;
  public requester?: ResourceReference;
  public performerType?: CodeableConcept;
  public performer?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public insurance?: ResourceReference[];
  public supportingInfo?: ResourceReference[];
  public note?: Annotation[];
  public relevantHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('priorRequest')) {
        this.priorRequest = [];
        for (const o of obj.priorRequest || []) {
          this.priorRequest.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('groupIdentifier')) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('intent')) {
        this.intent = obj.intent;
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new Element(obj.code);
      }
      if (obj.hasOwnProperty('parameter')) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new DeviceRequestParameterComponent(o));
        }
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('occurrence')) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.hasOwnProperty('authoredOn')) {
        this.authoredOn = obj.authoredOn;
      }
      if (obj.hasOwnProperty('requester')) {
        this.requester = new ResourceReference(obj.requester);
      }
      if (obj.hasOwnProperty('performerType')) {
        this.performerType = new CodeableConcept(obj.performerType);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('insurance')) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('supportingInfo')) {
        this.supportingInfo = [];
        for (const o of obj.supportingInfo || []) {
          this.supportingInfo.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('relevantHistory')) {
        this.relevantHistory = [];
        for (const o of obj.relevantHistory || []) {
          this.relevantHistory.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class DeviceUseStatement extends DomainResource {
  public resourceType = 'DeviceUseStatement';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference[];
  public status: string;
  public subject: ResourceReference;
  public derivedFrom?: ResourceReference[];
  public timing?: Element;
  public recordedOn?: Date;
  public source?: ResourceReference;
  public device: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public bodySite?: CodeableConcept;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('derivedFrom')) {
        this.derivedFrom = [];
        for (const o of obj.derivedFrom || []) {
          this.derivedFrom.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('timing')) {
        this.timing = new Element(obj.timing);
      }
      if (obj.hasOwnProperty('recordedOn')) {
        this.recordedOn = obj.recordedOn;
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.hasOwnProperty('device')) {
        this.device = new ResourceReference(obj.device);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class DiagnosticReportMediaComponent extends BackboneElement {
  public comment?: string;
  public link: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('link')) {
        this.link = new ResourceReference(obj.link);
      }
    }
  }

}

export class DiagnosticReport extends DomainResource {
  public resourceType = 'DiagnosticReport';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference[];
  public status: string;
  public category?: CodeableConcept;
  public code: CodeableConcept;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public effective?: Element;
  public issued?: Date;
  public performer?: ResourceReference[];
  public resultsInterpreter?: ResourceReference[];
  public specimen?: ResourceReference[];
  public result?: ResourceReference[];
  public imagingStudy?: ResourceReference[];
  public media?: DiagnosticReportMediaComponent[];
  public conclusion?: string;
  public conclusionCode?: CodeableConcept[];
  public presentedForm?: Attachment[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('effective')) {
        this.effective = new Element(obj.effective);
      }
      if (obj.hasOwnProperty('issued')) {
        this.issued = obj.issued;
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('resultsInterpreter')) {
        this.resultsInterpreter = [];
        for (const o of obj.resultsInterpreter || []) {
          this.resultsInterpreter.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('specimen')) {
        this.specimen = [];
        for (const o of obj.specimen || []) {
          this.specimen.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('result')) {
        this.result = [];
        for (const o of obj.result || []) {
          this.result.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('imagingStudy')) {
        this.imagingStudy = [];
        for (const o of obj.imagingStudy || []) {
          this.imagingStudy.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('media')) {
        this.media = [];
        for (const o of obj.media || []) {
          this.media.push(new DiagnosticReportMediaComponent(o));
        }
      }
      if (obj.hasOwnProperty('conclusion')) {
        this.conclusion = obj.conclusion;
      }
      if (obj.hasOwnProperty('conclusionCode')) {
        this.conclusionCode = [];
        for (const o of obj.conclusionCode || []) {
          this.conclusionCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('presentedForm')) {
        this.presentedForm = [];
        for (const o of obj.presentedForm || []) {
          this.presentedForm.push(new Attachment(o));
        }
      }
    }
  }

}

export class Distance extends Quantity {

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class DocumentManifestAgentComponent extends BackboneElement {
  public type?: CodeableConcept;
  public who: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('who')) {
        this.who = new ResourceReference(obj.who);
      }
    }
  }

}

export class DocumentManifestRelatedComponent extends BackboneElement {
  public identifier?: Identifier;
  public ref?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('ref')) {
        this.ref = new ResourceReference(obj.ref);
      }
    }
  }

}

export class DocumentManifest extends DomainResource {
  public resourceType = 'DocumentManifest';
  public masterIdentifier?: Identifier;
  public identifier?: Identifier[];
  public status: string;
  public type?: CodeableConcept;
  public subject?: ResourceReference;
  public created?: Date;
  public agent?: DocumentManifestAgentComponent[];
  public recipient?: ResourceReference[];
  public source?: string;
  public description?: string;
  public content: ResourceReference[];
  public related?: DocumentManifestRelatedComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('masterIdentifier')) {
        this.masterIdentifier = new Identifier(obj.masterIdentifier);
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('agent')) {
        this.agent = [];
        for (const o of obj.agent || []) {
          this.agent.push(new DocumentManifestAgentComponent(o));
        }
      }
      if (obj.hasOwnProperty('recipient')) {
        this.recipient = [];
        for (const o of obj.recipient || []) {
          this.recipient.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('source')) {
        this.source = obj.source;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('content')) {
        this.content = [];
        for (const o of obj.content || []) {
          this.content.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('related')) {
        this.related = [];
        for (const o of obj.related || []) {
          this.related.push(new DocumentManifestRelatedComponent(o));
        }
      }
    }
  }

}

export class DocumentReferenceAgentComponent extends BackboneElement {
  public type?: CodeableConcept;
  public who: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('who')) {
        this.who = new ResourceReference(obj.who);
      }
    }
  }

}

export class DocumentReferenceRelatesToComponent extends BackboneElement {
  public code: string;
  public target: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('target')) {
        this.target = new ResourceReference(obj.target);
      }
    }
  }

}

export class DocumentReferenceContentComponent extends BackboneElement {
  public attachment: Attachment;
  public format?: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('attachment')) {
        this.attachment = new Attachment(obj.attachment);
      }
      if (obj.hasOwnProperty('format')) {
        this.format = new Coding(obj.format);
      }
    }
  }

}

export class DocumentReferenceContextComponent extends BackboneElement {
  public encounter?: ResourceReference[];
  public event?: CodeableConcept[];
  public period?: Period;
  public facilityType?: CodeableConcept;
  public practiceSetting?: CodeableConcept;
  public sourcePatientInfo?: ResourceReference;
  public related?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = [];
        for (const o of obj.encounter || []) {
          this.encounter.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('event')) {
        this.event = [];
        for (const o of obj.event || []) {
          this.event.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('facilityType')) {
        this.facilityType = new CodeableConcept(obj.facilityType);
      }
      if (obj.hasOwnProperty('practiceSetting')) {
        this.practiceSetting = new CodeableConcept(obj.practiceSetting);
      }
      if (obj.hasOwnProperty('sourcePatientInfo')) {
        this.sourcePatientInfo = new ResourceReference(obj.sourcePatientInfo);
      }
      if (obj.hasOwnProperty('related')) {
        this.related = [];
        for (const o of obj.related || []) {
          this.related.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class DocumentReference extends DomainResource {
  public resourceType = 'DocumentReference';
  public masterIdentifier?: Identifier;
  public identifier?: Identifier[];
  public status: string;
  public docStatus?: string;
  public type?: CodeableConcept;
  public category?: CodeableConcept[];
  public subject?: ResourceReference;
  public date?: Date;
  public agent?: DocumentReferenceAgentComponent[];
  public authenticator?: ResourceReference;
  public custodian?: ResourceReference;
  public relatesTo?: DocumentReferenceRelatesToComponent[];
  public description?: string;
  public securityLabel?: CodeableConcept[];
  public content: DocumentReferenceContentComponent[];
  public context?: DocumentReferenceContextComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('masterIdentifier')) {
        this.masterIdentifier = new Identifier(obj.masterIdentifier);
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('docStatus')) {
        this.docStatus = obj.docStatus;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('agent')) {
        this.agent = [];
        for (const o of obj.agent || []) {
          this.agent.push(new DocumentReferenceAgentComponent(o));
        }
      }
      if (obj.hasOwnProperty('authenticator')) {
        this.authenticator = new ResourceReference(obj.authenticator);
      }
      if (obj.hasOwnProperty('custodian')) {
        this.custodian = new ResourceReference(obj.custodian);
      }
      if (obj.hasOwnProperty('relatesTo')) {
        this.relatesTo = [];
        for (const o of obj.relatesTo || []) {
          this.relatesTo.push(new DocumentReferenceRelatesToComponent(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('securityLabel')) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('content')) {
        this.content = [];
        for (const o of obj.content || []) {
          this.content.push(new DocumentReferenceContentComponent(o));
        }
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new DocumentReferenceContextComponent(obj.context);
      }
    }
  }

}

export class Duration extends Quantity {

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class EncounterStatusHistoryComponent extends BackboneElement {
  public status: string;
  public period: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class EncounterClassHistoryComponent extends BackboneElement {
  public class: Coding;
  public period: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('class')) {
        this.class = new Coding(obj.class);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class EncounterParticipantComponent extends BackboneElement {
  public type?: CodeableConcept[];
  public period?: Period;
  public individual?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('individual')) {
        this.individual = new ResourceReference(obj.individual);
      }
    }
  }

}

export class EncounterDiagnosisComponent extends BackboneElement {
  public condition: ResourceReference;
  public role?: CodeableConcept;
  public rank?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('condition')) {
        this.condition = new ResourceReference(obj.condition);
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.hasOwnProperty('rank')) {
        this.rank = obj.rank;
      }
    }
  }

}

export class EncounterHospitalizationComponent extends BackboneElement {
  public preAdmissionIdentifier?: Identifier;
  public origin?: ResourceReference;
  public admitSource?: CodeableConcept;
  public reAdmission?: CodeableConcept;
  public dietPreference?: CodeableConcept[];
  public specialCourtesy?: CodeableConcept[];
  public specialArrangement?: CodeableConcept[];
  public destination?: ResourceReference;
  public dischargeDisposition?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('preAdmissionIdentifier')) {
        this.preAdmissionIdentifier = new Identifier(obj.preAdmissionIdentifier);
      }
      if (obj.hasOwnProperty('origin')) {
        this.origin = new ResourceReference(obj.origin);
      }
      if (obj.hasOwnProperty('admitSource')) {
        this.admitSource = new CodeableConcept(obj.admitSource);
      }
      if (obj.hasOwnProperty('reAdmission')) {
        this.reAdmission = new CodeableConcept(obj.reAdmission);
      }
      if (obj.hasOwnProperty('dietPreference')) {
        this.dietPreference = [];
        for (const o of obj.dietPreference || []) {
          this.dietPreference.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specialCourtesy')) {
        this.specialCourtesy = [];
        for (const o of obj.specialCourtesy || []) {
          this.specialCourtesy.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specialArrangement')) {
        this.specialArrangement = [];
        for (const o of obj.specialArrangement || []) {
          this.specialArrangement.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('destination')) {
        this.destination = new ResourceReference(obj.destination);
      }
      if (obj.hasOwnProperty('dischargeDisposition')) {
        this.dischargeDisposition = new CodeableConcept(obj.dischargeDisposition);
      }
    }
  }

}

export class EncounterLocationComponent extends BackboneElement {
  public location: ResourceReference;
  public status?: string;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class Encounter extends DomainResource {
  public resourceType = 'Encounter';
  public identifier?: Identifier[];
  public status: string;
  public statusHistory?: EncounterStatusHistoryComponent[];
  public class: Coding;
  public classHistory?: EncounterClassHistoryComponent[];
  public type?: CodeableConcept[];
  public serviceType?: CodeableConcept;
  public priority?: CodeableConcept;
  public subject?: ResourceReference;
  public episodeOfCare?: ResourceReference[];
  public basedOn?: ResourceReference[];
  public participant?: EncounterParticipantComponent[];
  public appointment?: ResourceReference;
  public period?: Period;
  public length?: Duration;
  public reason?: CodeableConcept[];
  public diagnosis?: EncounterDiagnosisComponent[];
  public account?: ResourceReference[];
  public hospitalization?: EncounterHospitalizationComponent;
  public location?: EncounterLocationComponent[];
  public serviceProvider?: ResourceReference;
  public partOf?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusHistory')) {
        this.statusHistory = [];
        for (const o of obj.statusHistory || []) {
          this.statusHistory.push(new EncounterStatusHistoryComponent(o));
        }
      }
      if (obj.hasOwnProperty('class')) {
        this.class = new Coding(obj.class);
      }
      if (obj.hasOwnProperty('classHistory')) {
        this.classHistory = [];
        for (const o of obj.classHistory || []) {
          this.classHistory.push(new EncounterClassHistoryComponent(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('serviceType')) {
        this.serviceType = new CodeableConcept(obj.serviceType);
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('episodeOfCare')) {
        this.episodeOfCare = [];
        for (const o of obj.episodeOfCare || []) {
          this.episodeOfCare.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('participant')) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new EncounterParticipantComponent(o));
        }
      }
      if (obj.hasOwnProperty('appointment')) {
        this.appointment = new ResourceReference(obj.appointment);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('length')) {
        this.length = new Duration(obj.length);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('diagnosis')) {
        this.diagnosis = [];
        for (const o of obj.diagnosis || []) {
          this.diagnosis.push(new EncounterDiagnosisComponent(o));
        }
      }
      if (obj.hasOwnProperty('account')) {
        this.account = [];
        for (const o of obj.account || []) {
          this.account.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('hospitalization')) {
        this.hospitalization = new EncounterHospitalizationComponent(obj.hospitalization);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = [];
        for (const o of obj.location || []) {
          this.location.push(new EncounterLocationComponent(o));
        }
      }
      if (obj.hasOwnProperty('serviceProvider')) {
        this.serviceProvider = new ResourceReference(obj.serviceProvider);
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = new ResourceReference(obj.partOf);
      }
    }
  }

}

export class Endpoint extends DomainResource {
  public resourceType = 'Endpoint';
  public identifier?: Identifier[];
  public status: string;
  public connectionType: Coding;
  public name?: string;
  public managingOrganization?: ResourceReference;
  public contact?: ContactPoint[];
  public period?: Period;
  public payloadType: CodeableConcept[];
  public payloadMimeType?: string[];
  public address: string;
  public header?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('connectionType')) {
        this.connectionType = new Coding(obj.connectionType);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('managingOrganization')) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('payloadType')) {
        this.payloadType = [];
        for (const o of obj.payloadType || []) {
          this.payloadType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('payloadMimeType')) {
        this.payloadMimeType = obj.payloadMimeType;
      }
      if (obj.hasOwnProperty('address')) {
        this.address = obj.address;
      }
      if (obj.hasOwnProperty('header')) {
        this.header = obj.header;
      }
    }
  }

}

export class EnrollmentRequest extends DomainResource {
  public resourceType = 'EnrollmentRequest';
  public identifier?: Identifier[];
  public status?: string;
  public created?: Date;
  public insurer?: ResourceReference;
  public provider?: ResourceReference;
  public candidate?: ResourceReference;
  public coverage?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('insurer')) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('candidate')) {
        this.candidate = new ResourceReference(obj.candidate);
      }
      if (obj.hasOwnProperty('coverage')) {
        this.coverage = new ResourceReference(obj.coverage);
      }
    }
  }

}

export class EnrollmentResponse extends DomainResource {
  public resourceType = 'EnrollmentResponse';
  public identifier?: Identifier[];
  public status?: string;
  public request?: ResourceReference;
  public outcome?: string;
  public disposition?: string;
  public created?: Date;
  public organization?: ResourceReference;
  public requestProvider?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = obj.outcome;
      }
      if (obj.hasOwnProperty('disposition')) {
        this.disposition = obj.disposition;
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('organization')) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.hasOwnProperty('requestProvider')) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
    }
  }

}

export class EntryDefinitionRelatedEntryComponent extends BackboneElement {
  public relationtype: string;
  public item: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('relationtype')) {
        this.relationtype = obj.relationtype;
      }
      if (obj.hasOwnProperty('item')) {
        this.item = new ResourceReference(obj.item);
      }
    }
  }

}

export class EntryDefinition extends DomainResource {
  public resourceType = 'EntryDefinition';
  public identifier?: Identifier[];
  public type?: CodeableConcept;
  public orderable: boolean;
  public referencedItem: ResourceReference;
  public additionalIdentifier?: Identifier[];
  public classification?: CodeableConcept[];
  public status?: string;
  public validityPeriod?: Period;
  public lastUpdated?: Date;
  public additionalCharacteristic?: CodeableConcept[];
  public additionalClassification?: CodeableConcept[];
  public relatedEntry?: EntryDefinitionRelatedEntryComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('orderable')) {
        this.orderable = obj.orderable;
      }
      if (obj.hasOwnProperty('referencedItem')) {
        this.referencedItem = new ResourceReference(obj.referencedItem);
      }
      if (obj.hasOwnProperty('additionalIdentifier')) {
        this.additionalIdentifier = [];
        for (const o of obj.additionalIdentifier || []) {
          this.additionalIdentifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('classification')) {
        this.classification = [];
        for (const o of obj.classification || []) {
          this.classification.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('validityPeriod')) {
        this.validityPeriod = new Period(obj.validityPeriod);
      }
      if (obj.hasOwnProperty('lastUpdated')) {
        this.lastUpdated = obj.lastUpdated;
      }
      if (obj.hasOwnProperty('additionalCharacteristic')) {
        this.additionalCharacteristic = [];
        for (const o of obj.additionalCharacteristic || []) {
          this.additionalCharacteristic.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('additionalClassification')) {
        this.additionalClassification = [];
        for (const o of obj.additionalClassification || []) {
          this.additionalClassification.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('relatedEntry')) {
        this.relatedEntry = [];
        for (const o of obj.relatedEntry || []) {
          this.relatedEntry.push(new EntryDefinitionRelatedEntryComponent(o));
        }
      }
    }
  }

}

export class EpisodeOfCareStatusHistoryComponent extends BackboneElement {
  public status: string;
  public period: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class EpisodeOfCareDiagnosisComponent extends BackboneElement {
  public condition: ResourceReference;
  public role?: CodeableConcept;
  public rank?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('condition')) {
        this.condition = new ResourceReference(obj.condition);
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.hasOwnProperty('rank')) {
        this.rank = obj.rank;
      }
    }
  }

}

export class EpisodeOfCare extends DomainResource {
  public resourceType = 'EpisodeOfCare';
  public identifier?: Identifier[];
  public status: string;
  public statusHistory?: EpisodeOfCareStatusHistoryComponent[];
  public type?: CodeableConcept[];
  public diagnosis?: EpisodeOfCareDiagnosisComponent[];
  public patient: ResourceReference;
  public managingOrganization?: ResourceReference;
  public period?: Period;
  public referralRequest?: ResourceReference[];
  public careManager?: ResourceReference;
  public team?: ResourceReference[];
  public account?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusHistory')) {
        this.statusHistory = [];
        for (const o of obj.statusHistory || []) {
          this.statusHistory.push(new EpisodeOfCareStatusHistoryComponent(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('diagnosis')) {
        this.diagnosis = [];
        for (const o of obj.diagnosis || []) {
          this.diagnosis.push(new EpisodeOfCareDiagnosisComponent(o));
        }
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('managingOrganization')) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('referralRequest')) {
        this.referralRequest = [];
        for (const o of obj.referralRequest || []) {
          this.referralRequest.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('careManager')) {
        this.careManager = new ResourceReference(obj.careManager);
      }
      if (obj.hasOwnProperty('team')) {
        this.team = [];
        for (const o of obj.team || []) {
          this.team.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('account')) {
        this.account = [];
        for (const o of obj.account || []) {
          this.account.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class TriggerDefinition extends Element {
  public type: string;
  public name?: string;
  public timing?: Element;
  public data?: DataRequirement;
  public condition?: Expression;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('timing')) {
        this.timing = new Element(obj.timing);
      }
      if (obj.hasOwnProperty('data')) {
        this.data = new DataRequirement(obj.data);
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = new Expression(obj.condition);
      }
    }
  }

}

export class EventDefinition extends DomainResource {
  public resourceType = 'EventDefinition';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public subtitle?: string;
  public status: string;
  public experimental?: boolean;
  public subject?: Element;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public usage?: string;
  public copyright?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public topic?: CodeableConcept[];
  public author?: ContactDetail[];
  public editor?: ContactDetail[];
  public reviewer?: ContactDetail[];
  public endorser?: ContactDetail[];
  public relatedArtifact?: RelatedArtifact[];
  public trigger: TriggerDefinition;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('subtitle')) {
        this.subtitle = obj.subtitle;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new Element(obj.subject);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('usage')) {
        this.usage = obj.usage;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('approvalDate')) {
        this.approvalDate = obj.approvalDate;
      }
      if (obj.hasOwnProperty('lastReviewDate')) {
        this.lastReviewDate = obj.lastReviewDate;
      }
      if (obj.hasOwnProperty('effectivePeriod')) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.hasOwnProperty('topic')) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('author')) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('editor')) {
        this.editor = [];
        for (const o of obj.editor || []) {
          this.editor.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('reviewer')) {
        this.reviewer = [];
        for (const o of obj.reviewer || []) {
          this.reviewer.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('endorser')) {
        this.endorser = [];
        for (const o of obj.endorser || []) {
          this.endorser.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('relatedArtifact')) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.hasOwnProperty('trigger')) {
        this.trigger = new TriggerDefinition(obj.trigger);
      }
    }
  }

}

export class ExampleScenarioActorComponent extends BackboneElement {
  public actorId: string;
  public type: string;
  public name?: string;
  public description?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('actorId')) {
        this.actorId = obj.actorId;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
    }
  }

}

export class ExampleScenarioVersionComponent extends BackboneElement {
  public versionId: string;
  public description: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('versionId')) {
        this.versionId = obj.versionId;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
    }
  }

}

export class ExampleScenarioContainedInstanceComponent extends BackboneElement {
  public resourceId: string;
  public versionId?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('resourceId')) {
        this.resourceId = obj.resourceId;
      }
      if (obj.hasOwnProperty('versionId')) {
        this.versionId = obj.versionId;
      }
    }
  }

}

export class ExampleScenarioInstanceComponent extends BackboneElement {
  public resourceId: string;
  public resourceType: string;
  public name?: string;
  public description?: string;
  public version?: ExampleScenarioVersionComponent[];
  public containedInstance?: ExampleScenarioContainedInstanceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('resourceId')) {
        this.resourceId = obj.resourceId;
      }
      if (obj.hasOwnProperty('resourceType')) {
        this.resourceType = obj.resourceType;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = [];
        for (const o of obj.version || []) {
          this.version.push(new ExampleScenarioVersionComponent(o));
        }
      }
      if (obj.hasOwnProperty('containedInstance')) {
        this.containedInstance = [];
        for (const o of obj.containedInstance || []) {
          this.containedInstance.push(new ExampleScenarioContainedInstanceComponent(o));
        }
      }
    }
  }

}

export class ExampleScenarioOperationComponent extends BackboneElement {
  public number: string;
  public type?: string;
  public name?: string;
  public initiator?: string;
  public receiver?: string;
  public description?: string;
  public initiatorActive?: boolean;
  public receiverActive?: boolean;
  public request?: ExampleScenarioContainedInstanceComponent;
  public response?: ExampleScenarioContainedInstanceComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('number')) {
        this.number = obj.number;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('initiator')) {
        this.initiator = obj.initiator;
      }
      if (obj.hasOwnProperty('receiver')) {
        this.receiver = obj.receiver;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('initiatorActive')) {
        this.initiatorActive = obj.initiatorActive;
      }
      if (obj.hasOwnProperty('receiverActive')) {
        this.receiverActive = obj.receiverActive;
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ExampleScenarioContainedInstanceComponent(obj.request);
      }
      if (obj.hasOwnProperty('response')) {
        this.response = new ExampleScenarioContainedInstanceComponent(obj.response);
      }
    }
  }

}

export class ExampleScenarioOptionComponent extends BackboneElement {
  public description: string;
  public step?: ExampleScenarioStepComponent[];
  public pause?: boolean[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('step')) {
        this.step = [];
        for (const o of obj.step || []) {
          this.step.push(new ExampleScenarioStepComponent(o));
        }
      }
      if (obj.hasOwnProperty('pause')) {
        this.pause = obj.pause;
      }
    }
  }

}

export class ExampleScenarioAlternativeComponent extends BackboneElement {
  public name?: string;
  public option: ExampleScenarioOptionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('option')) {
        this.option = [];
        for (const o of obj.option || []) {
          this.option.push(new ExampleScenarioOptionComponent(o));
        }
      }
    }
  }

}

export class ExampleScenarioStepComponent extends BackboneElement {
  public process?: ExampleScenarioProcessComponent[];
  public pause?: boolean;
  public operation?: ExampleScenarioOperationComponent;
  public alternative?: ExampleScenarioAlternativeComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('process')) {
        this.process = [];
        for (const o of obj.process || []) {
          this.process.push(new ExampleScenarioProcessComponent(o));
        }
      }
      if (obj.hasOwnProperty('pause')) {
        this.pause = obj.pause;
      }
      if (obj.hasOwnProperty('operation')) {
        this.operation = new ExampleScenarioOperationComponent(obj.operation);
      }
      if (obj.hasOwnProperty('alternative')) {
        this.alternative = new ExampleScenarioAlternativeComponent(obj.alternative);
      }
    }
  }

}

export class ExampleScenarioProcessComponent extends BackboneElement {
  public title: string;
  public description?: string;
  public preConditions?: string;
  public postConditions?: string;
  public step?: ExampleScenarioStepComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('preConditions')) {
        this.preConditions = obj.preConditions;
      }
      if (obj.hasOwnProperty('postConditions')) {
        this.postConditions = obj.postConditions;
      }
      if (obj.hasOwnProperty('step')) {
        this.step = [];
        for (const o of obj.step || []) {
          this.step.push(new ExampleScenarioStepComponent(o));
        }
      }
    }
  }

}

export class ExampleScenario extends DomainResource {
  public resourceType = 'ExampleScenario';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public copyright?: string;
  public purpose?: string;
  public actor?: ExampleScenarioActorComponent[];
  public instance?: ExampleScenarioInstanceComponent[];
  public process?: ExampleScenarioProcessComponent[];
  public workflow?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = [];
        for (const o of obj.actor || []) {
          this.actor.push(new ExampleScenarioActorComponent(o));
        }
      }
      if (obj.hasOwnProperty('instance')) {
        this.instance = [];
        for (const o of obj.instance || []) {
          this.instance.push(new ExampleScenarioInstanceComponent(o));
        }
      }
      if (obj.hasOwnProperty('process')) {
        this.process = [];
        for (const o of obj.process || []) {
          this.process.push(new ExampleScenarioProcessComponent(o));
        }
      }
      if (obj.hasOwnProperty('workflow')) {
        this.workflow = obj.workflow;
      }
    }
  }

}

export class ExplanationOfBenefitRelatedClaimComponent extends BackboneElement {
  public claim?: ResourceReference;
  public relationship?: CodeableConcept;
  public reference?: Identifier;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('claim')) {
        this.claim = new ResourceReference(obj.claim);
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = new CodeableConcept(obj.relationship);
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = new Identifier(obj.reference);
      }
    }
  }

}

export class ExplanationOfBenefitPayeeComponent extends BackboneElement {
  public type?: CodeableConcept;
  public resource?: Coding;
  public party?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = new Coding(obj.resource);
      }
      if (obj.hasOwnProperty('party')) {
        this.party = new ResourceReference(obj.party);
      }
    }
  }

}

export class ExplanationOfBenefitSupportingInformationComponent extends BackboneElement {
  public sequence: number;
  public category: CodeableConcept;
  public code?: CodeableConcept;
  public timing?: Element;
  public value?: Element;
  public reason?: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('timing')) {
        this.timing = new Element(obj.timing);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = new Coding(obj.reason);
      }
    }
  }

}

export class ExplanationOfBenefitCareTeamComponent extends BackboneElement {
  public sequence: number;
  public provider: ResourceReference;
  public responsible?: boolean;
  public role?: CodeableConcept;
  public qualification?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('responsible')) {
        this.responsible = obj.responsible;
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.hasOwnProperty('qualification')) {
        this.qualification = new CodeableConcept(obj.qualification);
      }
    }
  }

}

export class ExplanationOfBenefitDiagnosisComponent extends BackboneElement {
  public sequence: number;
  public diagnosis: Element;
  public type?: CodeableConcept[];
  public onAdmission?: CodeableConcept;
  public packageCode?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('diagnosis')) {
        this.diagnosis = new Element(obj.diagnosis);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('onAdmission')) {
        this.onAdmission = new CodeableConcept(obj.onAdmission);
      }
      if (obj.hasOwnProperty('packageCode')) {
        this.packageCode = new CodeableConcept(obj.packageCode);
      }
    }
  }

}

export class ExplanationOfBenefitProcedureComponent extends BackboneElement {
  public sequence: number;
  public date?: Date;
  public procedure: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('procedure')) {
        this.procedure = new Element(obj.procedure);
      }
    }
  }

}

export class ExplanationOfBenefitInsuranceComponent extends BackboneElement {
  public focal: boolean;
  public coverage: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('focal')) {
        this.focal = obj.focal;
      }
      if (obj.hasOwnProperty('coverage')) {
        this.coverage = new ResourceReference(obj.coverage);
      }
    }
  }

}

export class ExplanationOfBenefitAccidentComponent extends BackboneElement {
  public date?: Date;
  public type?: CodeableConcept;
  public location?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new Element(obj.location);
      }
    }
  }

}

export class ExplanationOfBenefitAdjudicationComponent extends BackboneElement {
  public category: CodeableConcept;
  public reason?: CodeableConcept;
  public amount?: Money;
  public value?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = new CodeableConcept(obj.reason);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Money(obj.amount);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class ExplanationOfBenefitSubDetailComponent extends BackboneElement {
  public sequence: number;
  public revenue?: CodeableConcept;
  public category?: CodeableConcept;
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public programCode?: CodeableConcept[];
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public udi?: ResourceReference[];
  public noteNumber?: number[];
  public adjudication?: ExplanationOfBenefitAdjudicationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('revenue')) {
        this.revenue = new CodeableConcept(obj.revenue);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('programCode')) {
        this.programCode = [];
        for (const o of obj.programCode || []) {
          this.programCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('udi')) {
        this.udi = [];
        for (const o of obj.udi || []) {
          this.udi.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ExplanationOfBenefitAdjudicationComponent(o));
        }
      }
    }
  }

}

export class ExplanationOfBenefitDetailComponent extends BackboneElement {
  public sequence: number;
  public revenue?: CodeableConcept;
  public category?: CodeableConcept;
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public programCode?: CodeableConcept[];
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public udi?: ResourceReference[];
  public noteNumber?: number[];
  public adjudication?: ExplanationOfBenefitAdjudicationComponent[];
  public subDetail?: ExplanationOfBenefitSubDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('revenue')) {
        this.revenue = new CodeableConcept(obj.revenue);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('programCode')) {
        this.programCode = [];
        for (const o of obj.programCode || []) {
          this.programCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('udi')) {
        this.udi = [];
        for (const o of obj.udi || []) {
          this.udi.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ExplanationOfBenefitAdjudicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('subDetail')) {
        this.subDetail = [];
        for (const o of obj.subDetail || []) {
          this.subDetail.push(new ExplanationOfBenefitSubDetailComponent(o));
        }
      }
    }
  }

}

export class ExplanationOfBenefitItemComponent extends BackboneElement {
  public sequence: number;
  public careTeamSequence?: number[];
  public diagnosisSequence?: number[];
  public procedureSequence?: number[];
  public informationSequence?: number[];
  public revenue?: CodeableConcept;
  public category?: CodeableConcept;
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public programCode?: CodeableConcept[];
  public serviced?: Element;
  public location?: Element;
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public udi?: ResourceReference[];
  public bodySite?: CodeableConcept;
  public subSite?: CodeableConcept[];
  public encounter?: ResourceReference[];
  public noteNumber?: number[];
  public adjudication?: ExplanationOfBenefitAdjudicationComponent[];
  public detail?: ExplanationOfBenefitDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('careTeamSequence')) {
        this.careTeamSequence = obj.careTeamSequence;
      }
      if (obj.hasOwnProperty('diagnosisSequence')) {
        this.diagnosisSequence = obj.diagnosisSequence;
      }
      if (obj.hasOwnProperty('procedureSequence')) {
        this.procedureSequence = obj.procedureSequence;
      }
      if (obj.hasOwnProperty('informationSequence')) {
        this.informationSequence = obj.informationSequence;
      }
      if (obj.hasOwnProperty('revenue')) {
        this.revenue = new CodeableConcept(obj.revenue);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('programCode')) {
        this.programCode = [];
        for (const o of obj.programCode || []) {
          this.programCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('serviced')) {
        this.serviced = new Element(obj.serviced);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new Element(obj.location);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('udi')) {
        this.udi = [];
        for (const o of obj.udi || []) {
          this.udi.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.hasOwnProperty('subSite')) {
        this.subSite = [];
        for (const o of obj.subSite || []) {
          this.subSite.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = [];
        for (const o of obj.encounter || []) {
          this.encounter.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ExplanationOfBenefitAdjudicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new ExplanationOfBenefitDetailComponent(o));
        }
      }
    }
  }

}

export class ExplanationOfBenefitAddedItemDetailSubDetailComponent extends BackboneElement {
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public noteNumber?: number[];
  public adjudication?: ExplanationOfBenefitAdjudicationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ExplanationOfBenefitAdjudicationComponent(o));
        }
      }
    }
  }

}

export class ExplanationOfBenefitAddedItemDetailComponent extends BackboneElement {
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public noteNumber?: number[];
  public adjudication?: ExplanationOfBenefitAdjudicationComponent[];
  public subDetail?: ExplanationOfBenefitAddedItemDetailSubDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ExplanationOfBenefitAdjudicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('subDetail')) {
        this.subDetail = [];
        for (const o of obj.subDetail || []) {
          this.subDetail.push(new ExplanationOfBenefitAddedItemDetailSubDetailComponent(o));
        }
      }
    }
  }

}

export class ExplanationOfBenefitAddedItemComponent extends BackboneElement {
  public itemSequence?: number[];
  public detailSequence?: number[];
  public subDetailSequence?: number[];
  public provider?: ResourceReference[];
  public billcode?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public programCode?: CodeableConcept[];
  public serviced?: Element;
  public location?: Element;
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public net?: Money;
  public bodySite?: CodeableConcept;
  public subSite?: CodeableConcept[];
  public noteNumber?: number[];
  public adjudication?: ExplanationOfBenefitAdjudicationComponent[];
  public detail?: ExplanationOfBenefitAddedItemDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('itemSequence')) {
        this.itemSequence = obj.itemSequence;
      }
      if (obj.hasOwnProperty('detailSequence')) {
        this.detailSequence = obj.detailSequence;
      }
      if (obj.hasOwnProperty('subDetailSequence')) {
        this.subDetailSequence = obj.subDetailSequence;
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = [];
        for (const o of obj.provider || []) {
          this.provider.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('billcode')) {
        this.billcode = new CodeableConcept(obj.billcode);
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('programCode')) {
        this.programCode = [];
        for (const o of obj.programCode || []) {
          this.programCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('serviced')) {
        this.serviced = new Element(obj.serviced);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new Element(obj.location);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('unitPrice')) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('net')) {
        this.net = new Money(obj.net);
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.hasOwnProperty('subSite')) {
        this.subSite = [];
        for (const o of obj.subSite || []) {
          this.subSite.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('noteNumber')) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.hasOwnProperty('adjudication')) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new ExplanationOfBenefitAdjudicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new ExplanationOfBenefitAddedItemDetailComponent(o));
        }
      }
    }
  }

}

export class ExplanationOfBenefitTotalComponent extends BackboneElement {
  public category: CodeableConcept;
  public amount: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Money(obj.amount);
      }
    }
  }

}

export class ExplanationOfBenefitPaymentComponent extends BackboneElement {
  public type?: CodeableConcept;
  public adjustment?: Money;
  public adjustmentReason?: CodeableConcept;
  public date?: Date;
  public amount?: Money;
  public identifier?: Identifier;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('adjustment')) {
        this.adjustment = new Money(obj.adjustment);
      }
      if (obj.hasOwnProperty('adjustmentReason')) {
        this.adjustmentReason = new CodeableConcept(obj.adjustmentReason);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Money(obj.amount);
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
    }
  }

}

export class ExplanationOfBenefitNoteComponent extends BackboneElement {
  public number?: number;
  public type?: string;
  public text?: string;
  public language?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('number')) {
        this.number = obj.number;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('language')) {
        this.language = new CodeableConcept(obj.language);
      }
    }
  }

}

export class ExplanationOfBenefitBenefitComponent extends BackboneElement {
  public type: CodeableConcept;
  public allowed?: Element;
  public used?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('allowed')) {
        this.allowed = new Element(obj.allowed);
      }
      if (obj.hasOwnProperty('used')) {
        this.used = new Element(obj.used);
      }
    }
  }

}

export class ExplanationOfBenefitBenefitBalanceComponent extends BackboneElement {
  public category: CodeableConcept;
  public excluded?: boolean;
  public name?: string;
  public description?: string;
  public network?: CodeableConcept;
  public unit?: CodeableConcept;
  public term?: CodeableConcept;
  public financial?: ExplanationOfBenefitBenefitComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('excluded')) {
        this.excluded = obj.excluded;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('network')) {
        this.network = new CodeableConcept(obj.network);
      }
      if (obj.hasOwnProperty('unit')) {
        this.unit = new CodeableConcept(obj.unit);
      }
      if (obj.hasOwnProperty('term')) {
        this.term = new CodeableConcept(obj.term);
      }
      if (obj.hasOwnProperty('financial')) {
        this.financial = [];
        for (const o of obj.financial || []) {
          this.financial.push(new ExplanationOfBenefitBenefitComponent(o));
        }
      }
    }
  }

}

export class ExplanationOfBenefit extends DomainResource {
  public resourceType = 'ExplanationOfBenefit';
  public identifier?: Identifier[];
  public status?: string;
  public type?: CodeableConcept;
  public subType?: CodeableConcept;
  public use?: string;
  public patient?: ResourceReference;
  public billablePeriod?: Period;
  public created?: Date;
  public enterer?: ResourceReference;
  public insurer?: ResourceReference;
  public provider?: ResourceReference;
  public referral?: ResourceReference;
  public facility?: ResourceReference;
  public claim?: ResourceReference;
  public claimResponse?: ResourceReference;
  public outcome?: string;
  public disposition?: string;
  public related?: ExplanationOfBenefitRelatedClaimComponent[];
  public prescription?: ResourceReference;
  public originalPrescription?: ResourceReference;
  public payee?: ExplanationOfBenefitPayeeComponent;
  public information?: ExplanationOfBenefitSupportingInformationComponent[];
  public careTeam?: ExplanationOfBenefitCareTeamComponent[];
  public diagnosis?: ExplanationOfBenefitDiagnosisComponent[];
  public procedure?: ExplanationOfBenefitProcedureComponent[];
  public precedence?: number;
  public insurance?: ExplanationOfBenefitInsuranceComponent[];
  public accident?: ExplanationOfBenefitAccidentComponent;
  public item?: ExplanationOfBenefitItemComponent[];
  public addItem?: ExplanationOfBenefitAddedItemComponent[];
  public total?: ExplanationOfBenefitTotalComponent[];
  public payment?: ExplanationOfBenefitPaymentComponent;
  public form?: CodeableConcept;
  public processNote?: ExplanationOfBenefitNoteComponent[];
  public benefitBalance?: ExplanationOfBenefitBenefitBalanceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subType')) {
        this.subType = new CodeableConcept(obj.subType);
      }
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('billablePeriod')) {
        this.billablePeriod = new Period(obj.billablePeriod);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('enterer')) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.hasOwnProperty('insurer')) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('referral')) {
        this.referral = new ResourceReference(obj.referral);
      }
      if (obj.hasOwnProperty('facility')) {
        this.facility = new ResourceReference(obj.facility);
      }
      if (obj.hasOwnProperty('claim')) {
        this.claim = new ResourceReference(obj.claim);
      }
      if (obj.hasOwnProperty('claimResponse')) {
        this.claimResponse = new ResourceReference(obj.claimResponse);
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = obj.outcome;
      }
      if (obj.hasOwnProperty('disposition')) {
        this.disposition = obj.disposition;
      }
      if (obj.hasOwnProperty('related')) {
        this.related = [];
        for (const o of obj.related || []) {
          this.related.push(new ExplanationOfBenefitRelatedClaimComponent(o));
        }
      }
      if (obj.hasOwnProperty('prescription')) {
        this.prescription = new ResourceReference(obj.prescription);
      }
      if (obj.hasOwnProperty('originalPrescription')) {
        this.originalPrescription = new ResourceReference(obj.originalPrescription);
      }
      if (obj.hasOwnProperty('payee')) {
        this.payee = new ExplanationOfBenefitPayeeComponent(obj.payee);
      }
      if (obj.hasOwnProperty('information')) {
        this.information = [];
        for (const o of obj.information || []) {
          this.information.push(new ExplanationOfBenefitSupportingInformationComponent(o));
        }
      }
      if (obj.hasOwnProperty('careTeam')) {
        this.careTeam = [];
        for (const o of obj.careTeam || []) {
          this.careTeam.push(new ExplanationOfBenefitCareTeamComponent(o));
        }
      }
      if (obj.hasOwnProperty('diagnosis')) {
        this.diagnosis = [];
        for (const o of obj.diagnosis || []) {
          this.diagnosis.push(new ExplanationOfBenefitDiagnosisComponent(o));
        }
      }
      if (obj.hasOwnProperty('procedure')) {
        this.procedure = [];
        for (const o of obj.procedure || []) {
          this.procedure.push(new ExplanationOfBenefitProcedureComponent(o));
        }
      }
      if (obj.hasOwnProperty('precedence')) {
        this.precedence = obj.precedence;
      }
      if (obj.hasOwnProperty('insurance')) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new ExplanationOfBenefitInsuranceComponent(o));
        }
      }
      if (obj.hasOwnProperty('accident')) {
        this.accident = new ExplanationOfBenefitAccidentComponent(obj.accident);
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ExplanationOfBenefitItemComponent(o));
        }
      }
      if (obj.hasOwnProperty('addItem')) {
        this.addItem = [];
        for (const o of obj.addItem || []) {
          this.addItem.push(new ExplanationOfBenefitAddedItemComponent(o));
        }
      }
      if (obj.hasOwnProperty('total')) {
        this.total = [];
        for (const o of obj.total || []) {
          this.total.push(new ExplanationOfBenefitTotalComponent(o));
        }
      }
      if (obj.hasOwnProperty('payment')) {
        this.payment = new ExplanationOfBenefitPaymentComponent(obj.payment);
      }
      if (obj.hasOwnProperty('form')) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.hasOwnProperty('processNote')) {
        this.processNote = [];
        for (const o of obj.processNote || []) {
          this.processNote.push(new ExplanationOfBenefitNoteComponent(o));
        }
      }
      if (obj.hasOwnProperty('benefitBalance')) {
        this.benefitBalance = [];
        for (const o of obj.benefitBalance || []) {
          this.benefitBalance.push(new ExplanationOfBenefitBenefitBalanceComponent(o));
        }
      }
    }
  }

}

export class FamilyMemberHistoryConditionComponent extends BackboneElement {
  public code: CodeableConcept;
  public outcome?: CodeableConcept;
  public onset?: Element;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.hasOwnProperty('onset')) {
        this.onset = new Element(obj.onset);
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class FamilyMemberHistory extends DomainResource {
  public resourceType = 'FamilyMemberHistory';
  public identifier?: Identifier[];
  public instantiatesCanonical?: string[];
  public instantiatesUri?: string[];
  public status: string;
  public dataAbsentReason?: CodeableConcept;
  public patient: ResourceReference;
  public date?: Date;
  public name?: string;
  public relationship: CodeableConcept;
  public gender?: CodeableConcept;
  public born?: Element;
  public age?: Element;
  public estimatedAge?: boolean;
  public deceased?: Element;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];
  public condition?: FamilyMemberHistoryConditionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('dataAbsentReason')) {
        this.dataAbsentReason = new CodeableConcept(obj.dataAbsentReason);
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = new CodeableConcept(obj.relationship);
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = new CodeableConcept(obj.gender);
      }
      if (obj.hasOwnProperty('born')) {
        this.born = new Element(obj.born);
      }
      if (obj.hasOwnProperty('age')) {
        this.age = new Element(obj.age);
      }
      if (obj.hasOwnProperty('estimatedAge')) {
        this.estimatedAge = obj.estimatedAge;
      }
      if (obj.hasOwnProperty('deceased')) {
        this.deceased = new Element(obj.deceased);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = [];
        for (const o of obj.condition || []) {
          this.condition.push(new FamilyMemberHistoryConditionComponent(o));
        }
      }
    }
  }

}

export class GoalTargetComponent extends BackboneElement {
  public measure?: CodeableConcept;
  public detail?: Element;
  public due?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('measure')) {
        this.measure = new CodeableConcept(obj.measure);
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = new Element(obj.detail);
      }
      if (obj.hasOwnProperty('due')) {
        this.due = new Element(obj.due);
      }
    }
  }

}

export class Goal extends DomainResource {
  public resourceType = 'Goal';
  public identifier?: Identifier[];
  public status: string;
  public category?: CodeableConcept[];
  public priority?: CodeableConcept;
  public description: CodeableConcept;
  public subject: ResourceReference;
  public start?: Element;
  public target?: GoalTargetComponent;
  public statusDate?: Date;
  public statusReason?: string;
  public expressedBy?: ResourceReference;
  public addresses?: ResourceReference[];
  public note?: Annotation[];
  public outcomeCode?: CodeableConcept[];
  public outcomeReference?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = new CodeableConcept(obj.description);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('start')) {
        this.start = new Element(obj.start);
      }
      if (obj.hasOwnProperty('target')) {
        this.target = new GoalTargetComponent(obj.target);
      }
      if (obj.hasOwnProperty('statusDate')) {
        this.statusDate = obj.statusDate;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = obj.statusReason;
      }
      if (obj.hasOwnProperty('expressedBy')) {
        this.expressedBy = new ResourceReference(obj.expressedBy);
      }
      if (obj.hasOwnProperty('addresses')) {
        this.addresses = [];
        for (const o of obj.addresses || []) {
          this.addresses.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('outcomeCode')) {
        this.outcomeCode = [];
        for (const o of obj.outcomeCode || []) {
          this.outcomeCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('outcomeReference')) {
        this.outcomeReference = [];
        for (const o of obj.outcomeReference || []) {
          this.outcomeReference.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class GraphDefinitionCompartmentComponent extends BackboneElement {
  public use: string;
  public code: string;
  public rule: string;
  public expression?: string;
  public description?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('rule')) {
        this.rule = obj.rule;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
    }
  }

}

export class GraphDefinitionTargetComponent extends BackboneElement {
  public type: string;
  public params?: string;
  public profile?: string;
  public compartment?: GraphDefinitionCompartmentComponent[];
  public link?: GraphDefinitionLinkComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('params')) {
        this.params = obj.params;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
      if (obj.hasOwnProperty('compartment')) {
        this.compartment = [];
        for (const o of obj.compartment || []) {
          this.compartment.push(new GraphDefinitionCompartmentComponent(o));
        }
      }
      if (obj.hasOwnProperty('link')) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new GraphDefinitionLinkComponent(o));
        }
      }
    }
  }

}

export class GraphDefinitionLinkComponent extends BackboneElement {
  public path?: string;
  public sliceName?: string;
  public min?: number;
  public max?: string;
  public description?: string;
  public target?: GraphDefinitionTargetComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('sliceName')) {
        this.sliceName = obj.sliceName;
      }
      if (obj.hasOwnProperty('min')) {
        this.min = obj.min;
      }
      if (obj.hasOwnProperty('max')) {
        this.max = obj.max;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('target')) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new GraphDefinitionTargetComponent(o));
        }
      }
    }
  }

}

export class GraphDefinition extends DomainResource {
  public resourceType = 'GraphDefinition';
  public url?: string;
  public version?: string;
  public name: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public start: string;
  public profile?: string;
  public link?: GraphDefinitionLinkComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('start')) {
        this.start = obj.start;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
      if (obj.hasOwnProperty('link')) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new GraphDefinitionLinkComponent(o));
        }
      }
    }
  }

}

export class GroupCharacteristicComponent extends BackboneElement {
  public code: CodeableConcept;
  public value: Element;      // TODO: replace with properties for each option
  public exclude: boolean;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
      if (obj.hasOwnProperty('exclude')) {
        this.exclude = obj.exclude;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class GroupMemberComponent extends BackboneElement {
  public entity: ResourceReference;
  public period?: Period;
  public inactive?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('entity')) {
        this.entity = new ResourceReference(obj.entity);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('inactive')) {
        this.inactive = obj.inactive;
      }
    }
  }

}

export class Group extends DomainResource {
  public resourceType = 'Group';
  public identifier?: Identifier[];
  public active?: boolean;
  public type: string;
  public actual: boolean;
  public code?: CodeableConcept;
  public name?: string;
  public managingEntity?: ResourceReference;
  public quantity?: number;
  public characteristic?: GroupCharacteristicComponent[];
  public member?: GroupMemberComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('actual')) {
        this.actual = obj.actual;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('managingEntity')) {
        this.managingEntity = new ResourceReference(obj.managingEntity);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = obj.quantity;
      }
      if (obj.hasOwnProperty('characteristic')) {
        this.characteristic = [];
        for (const o of obj.characteristic || []) {
          this.characteristic.push(new GroupCharacteristicComponent(o));
        }
      }
      if (obj.hasOwnProperty('member')) {
        this.member = [];
        for (const o of obj.member || []) {
          this.member.push(new GroupMemberComponent(o));
        }
      }
    }
  }

}

export class GuidanceResponse extends DomainResource {
  public resourceType = 'GuidanceResponse';
  public requestIdentifier?: Identifier;
  public identifier?: Identifier[];
  public module: Element;
  public status: string;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public occurrenceDateTime?: Date;
  public performer?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];
  public evaluationMessage?: ResourceReference[];
  public outputParameters?: ResourceReference;
  public result?: ResourceReference;
  public dataRequirement?: DataRequirement[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('requestIdentifier')) {
        this.requestIdentifier = new Identifier(obj.requestIdentifier);
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('module')) {
        this.module = new Element(obj.module);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('occurrenceDateTime')) {
        this.occurrenceDateTime = obj.occurrenceDateTime;
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('evaluationMessage')) {
        this.evaluationMessage = [];
        for (const o of obj.evaluationMessage || []) {
          this.evaluationMessage.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('outputParameters')) {
        this.outputParameters = new ResourceReference(obj.outputParameters);
      }
      if (obj.hasOwnProperty('result')) {
        this.result = new ResourceReference(obj.result);
      }
      if (obj.hasOwnProperty('dataRequirement')) {
        this.dataRequirement = [];
        for (const o of obj.dataRequirement || []) {
          this.dataRequirement.push(new DataRequirement(o));
        }
      }
    }
  }

}

export class HealthcareServiceAvailableTimeComponent extends BackboneElement {
  public daysOfWeek?: string[];
  public allDay?: boolean;
  public availableStartTime?: Date;
  public availableEndTime?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('daysOfWeek')) {
        this.daysOfWeek = obj.daysOfWeek;
      }
      if (obj.hasOwnProperty('allDay')) {
        this.allDay = obj.allDay;
      }
      if (obj.hasOwnProperty('availableStartTime')) {
        this.availableStartTime = obj.availableStartTime;
      }
      if (obj.hasOwnProperty('availableEndTime')) {
        this.availableEndTime = obj.availableEndTime;
      }
    }
  }

}

export class HealthcareServiceNotAvailableComponent extends BackboneElement {
  public description: string;
  public during?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('during')) {
        this.during = new Period(obj.during);
      }
    }
  }

}

export class HealthcareService extends DomainResource {
  public resourceType = 'HealthcareService';
  public identifier?: Identifier[];
  public active?: boolean;
  public providedBy?: ResourceReference;
  public category?: CodeableConcept[];
  public type?: CodeableConcept[];
  public specialty?: CodeableConcept[];
  public location?: ResourceReference[];
  public name?: string;
  public comment?: string;
  public extraDetails?: string;
  public photo?: Attachment;
  public telecom?: ContactPoint[];
  public coverageArea?: ResourceReference[];
  public serviceProvisionCode?: CodeableConcept[];
  public eligibility?: CodeableConcept;
  public eligibilityNote?: string;
  public programName?: string[];
  public characteristic?: CodeableConcept[];
  public referralMethod?: CodeableConcept[];
  public appointmentRequired?: boolean;
  public availableTime?: HealthcareServiceAvailableTimeComponent[];
  public notAvailable?: HealthcareServiceNotAvailableComponent[];
  public availabilityExceptions?: string;
  public endpoint?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('providedBy')) {
        this.providedBy = new ResourceReference(obj.providedBy);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specialty')) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('location')) {
        this.location = [];
        for (const o of obj.location || []) {
          this.location.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('extraDetails')) {
        this.extraDetails = obj.extraDetails;
      }
      if (obj.hasOwnProperty('photo')) {
        this.photo = new Attachment(obj.photo);
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('coverageArea')) {
        this.coverageArea = [];
        for (const o of obj.coverageArea || []) {
          this.coverageArea.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('serviceProvisionCode')) {
        this.serviceProvisionCode = [];
        for (const o of obj.serviceProvisionCode || []) {
          this.serviceProvisionCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('eligibility')) {
        this.eligibility = new CodeableConcept(obj.eligibility);
      }
      if (obj.hasOwnProperty('eligibilityNote')) {
        this.eligibilityNote = obj.eligibilityNote;
      }
      if (obj.hasOwnProperty('programName')) {
        this.programName = obj.programName;
      }
      if (obj.hasOwnProperty('characteristic')) {
        this.characteristic = [];
        for (const o of obj.characteristic || []) {
          this.characteristic.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('referralMethod')) {
        this.referralMethod = [];
        for (const o of obj.referralMethod || []) {
          this.referralMethod.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('appointmentRequired')) {
        this.appointmentRequired = obj.appointmentRequired;
      }
      if (obj.hasOwnProperty('availableTime')) {
        this.availableTime = [];
        for (const o of obj.availableTime || []) {
          this.availableTime.push(new HealthcareServiceAvailableTimeComponent(o));
        }
      }
      if (obj.hasOwnProperty('notAvailable')) {
        this.notAvailable = [];
        for (const o of obj.notAvailable || []) {
          this.notAvailable.push(new HealthcareServiceNotAvailableComponent(o));
        }
      }
      if (obj.hasOwnProperty('availabilityExceptions')) {
        this.availabilityExceptions = obj.availabilityExceptions;
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class HumanName extends Element implements IHumanName {
  public use?: string;
  public text?: string;
  public family?: string;
  public given?: string[];
  public prefix?: string[];
  public suffix?: string[];
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('family')) {
        this.family = obj.family;
      }
      if (obj.hasOwnProperty('given')) {
        this.given = obj.given;
      }
      if (obj.hasOwnProperty('prefix')) {
        this.prefix = obj.prefix;
      }
      if (obj.hasOwnProperty('suffix')) {
        this.suffix = obj.suffix;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class ImagingManifest {

  constructor(obj?: any) {
    if (obj) {
    }
  }

}

export class ImagingStudyPerformerComponent extends BackboneElement {
  public function?: CodeableConcept;
  public actor: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('function')) {
        this.function = new CodeableConcept(obj.function);
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = new ResourceReference(obj.actor);
      }
    }
  }

}

export class ImagingStudyInstanceComponent extends BackboneElement {
  public identifier: Identifier;
  public number?: number;
  public sopClass: Coding;
  public title?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('number')) {
        this.number = obj.number;
      }
      if (obj.hasOwnProperty('sopClass')) {
        this.sopClass = new Coding(obj.sopClass);
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
    }
  }

}

export class ImagingStudySeriesComponent extends BackboneElement {
  public identifier: Identifier;
  public number?: number;
  public modality: Coding;
  public description?: string;
  public numberOfInstances?: number;
  public endpoint?: ResourceReference[];
  public bodySite?: Coding;
  public laterality?: Coding;
  public specimen?: ResourceReference[];
  public started?: Date;
  public performer?: ImagingStudyPerformerComponent[];
  public instance?: ImagingStudyInstanceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('number')) {
        this.number = obj.number;
      }
      if (obj.hasOwnProperty('modality')) {
        this.modality = new Coding(obj.modality);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('numberOfInstances')) {
        this.numberOfInstances = obj.numberOfInstances;
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = new Coding(obj.bodySite);
      }
      if (obj.hasOwnProperty('laterality')) {
        this.laterality = new Coding(obj.laterality);
      }
      if (obj.hasOwnProperty('specimen')) {
        this.specimen = [];
        for (const o of obj.specimen || []) {
          this.specimen.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('started')) {
        this.started = obj.started;
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ImagingStudyPerformerComponent(o));
        }
      }
      if (obj.hasOwnProperty('instance')) {
        this.instance = [];
        for (const o of obj.instance || []) {
          this.instance.push(new ImagingStudyInstanceComponent(o));
        }
      }
    }
  }

}

export class ImagingStudy extends DomainResource {
  public resourceType = 'ImagingStudy';
  public identifier?: Identifier[];
  public status: string;
  public modality?: Coding[];
  public subject: ResourceReference;
  public context?: ResourceReference;
  public started?: Date;
  public basedOn?: ResourceReference[];
  public referrer?: ResourceReference;
  public interpreter?: ResourceReference[];
  public endpoint?: ResourceReference[];
  public numberOfSeries?: number;
  public numberOfInstances?: number;
  public procedureReference?: ResourceReference;
  public procedureCode?: CodeableConcept[];
  public location?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];
  public description?: string;
  public series?: ImagingStudySeriesComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('modality')) {
        this.modality = [];
        for (const o of obj.modality || []) {
          this.modality.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('started')) {
        this.started = obj.started;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('referrer')) {
        this.referrer = new ResourceReference(obj.referrer);
      }
      if (obj.hasOwnProperty('interpreter')) {
        this.interpreter = [];
        for (const o of obj.interpreter || []) {
          this.interpreter.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('numberOfSeries')) {
        this.numberOfSeries = obj.numberOfSeries;
      }
      if (obj.hasOwnProperty('numberOfInstances')) {
        this.numberOfInstances = obj.numberOfInstances;
      }
      if (obj.hasOwnProperty('procedureReference')) {
        this.procedureReference = new ResourceReference(obj.procedureReference);
      }
      if (obj.hasOwnProperty('procedureCode')) {
        this.procedureCode = [];
        for (const o of obj.procedureCode || []) {
          this.procedureCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('series')) {
        this.series = [];
        for (const o of obj.series || []) {
          this.series.push(new ImagingStudySeriesComponent(o));
        }
      }
    }
  }

}

export class ImmunizationPerformerComponent extends BackboneElement {
  public function?: CodeableConcept;
  public actor: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('function')) {
        this.function = new CodeableConcept(obj.function);
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = new ResourceReference(obj.actor);
      }
    }
  }

}

export class ImmunizationEducationComponent extends BackboneElement {
  public documentType?: string;
  public reference?: string;
  public publicationDate?: Date;
  public presentationDate?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('documentType')) {
        this.documentType = obj.documentType;
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = obj.reference;
      }
      if (obj.hasOwnProperty('publicationDate')) {
        this.publicationDate = obj.publicationDate;
      }
      if (obj.hasOwnProperty('presentationDate')) {
        this.presentationDate = obj.presentationDate;
      }
    }
  }

}

export class ImmunizationProtocolAppliedComponent extends BackboneElement {
  public series?: string;
  public authority?: ResourceReference;
  public targetDisease: CodeableConcept;
  public doseNumber: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('series')) {
        this.series = obj.series;
      }
      if (obj.hasOwnProperty('authority')) {
        this.authority = new ResourceReference(obj.authority);
      }
      if (obj.hasOwnProperty('targetDisease')) {
        this.targetDisease = new CodeableConcept(obj.targetDisease);
      }
      if (obj.hasOwnProperty('doseNumber')) {
        this.doseNumber = new Element(obj.doseNumber);
      }
    }
  }

}

export class Immunization extends DomainResource {
  public resourceType = 'Immunization';
  public identifier?: Identifier[];
  public status: string;
  public statusReason?: CodeableConcept;
  public vaccineCode: CodeableConcept;
  public patient: ResourceReference;
  public encounter?: ResourceReference;
  public occurrence: Element;
  public recorded?: Date;
  public primarySource?: boolean;
  public reportOrigin?: CodeableConcept;
  public location?: ResourceReference;
  public manufacturer?: ResourceReference;
  public lotNumber?: string;
  public expirationDate?: Date;
  public site?: CodeableConcept;
  public route?: CodeableConcept;
  public doseQuantity?: SimpleQuantity;
  public performer?: ImmunizationPerformerComponent[];
  public note?: Annotation[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public isSubpotent?: boolean;
  public subpotentReason?: CodeableConcept[];
  public education?: ImmunizationEducationComponent[];
  public programEligibility?: CodeableConcept[];
  public fundingSource?: CodeableConcept;
  public protocolApplied?: ImmunizationProtocolAppliedComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = new CodeableConcept(obj.statusReason);
      }
      if (obj.hasOwnProperty('vaccineCode')) {
        this.vaccineCode = new CodeableConcept(obj.vaccineCode);
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.hasOwnProperty('occurrence')) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.hasOwnProperty('recorded')) {
        this.recorded = obj.recorded;
      }
      if (obj.hasOwnProperty('primarySource')) {
        this.primarySource = obj.primarySource;
      }
      if (obj.hasOwnProperty('reportOrigin')) {
        this.reportOrigin = new CodeableConcept(obj.reportOrigin);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = new ResourceReference(obj.manufacturer);
      }
      if (obj.hasOwnProperty('lotNumber')) {
        this.lotNumber = obj.lotNumber;
      }
      if (obj.hasOwnProperty('expirationDate')) {
        this.expirationDate = obj.expirationDate;
      }
      if (obj.hasOwnProperty('site')) {
        this.site = new CodeableConcept(obj.site);
      }
      if (obj.hasOwnProperty('route')) {
        this.route = new CodeableConcept(obj.route);
      }
      if (obj.hasOwnProperty('doseQuantity')) {
        this.doseQuantity = new SimpleQuantity(obj.doseQuantity);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ImmunizationPerformerComponent(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('isSubpotent')) {
        this.isSubpotent = obj.isSubpotent;
      }
      if (obj.hasOwnProperty('subpotentReason')) {
        this.subpotentReason = [];
        for (const o of obj.subpotentReason || []) {
          this.subpotentReason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('education')) {
        this.education = [];
        for (const o of obj.education || []) {
          this.education.push(new ImmunizationEducationComponent(o));
        }
      }
      if (obj.hasOwnProperty('programEligibility')) {
        this.programEligibility = [];
        for (const o of obj.programEligibility || []) {
          this.programEligibility.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('fundingSource')) {
        this.fundingSource = new CodeableConcept(obj.fundingSource);
      }
      if (obj.hasOwnProperty('protocolApplied')) {
        this.protocolApplied = [];
        for (const o of obj.protocolApplied || []) {
          this.protocolApplied.push(new ImmunizationProtocolAppliedComponent(o));
        }
      }
    }
  }

}

export class ImmunizationEvaluation extends DomainResource {
  public resourceType = 'ImmunizationEvaluation';
  public identifier?: Identifier[];
  public status: string;
  public patient: ResourceReference;
  public date?: Date;
  public authority?: ResourceReference;
  public targetDisease: CodeableConcept;
  public immunizationEvent: ResourceReference;
  public doseStatus: CodeableConcept;
  public doseStatusReason?: CodeableConcept[];
  public description?: string;
  public series?: string;
  public doseNumber?: Element;
  public seriesDoses?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('authority')) {
        this.authority = new ResourceReference(obj.authority);
      }
      if (obj.hasOwnProperty('targetDisease')) {
        this.targetDisease = new CodeableConcept(obj.targetDisease);
      }
      if (obj.hasOwnProperty('immunizationEvent')) {
        this.immunizationEvent = new ResourceReference(obj.immunizationEvent);
      }
      if (obj.hasOwnProperty('doseStatus')) {
        this.doseStatus = new CodeableConcept(obj.doseStatus);
      }
      if (obj.hasOwnProperty('doseStatusReason')) {
        this.doseStatusReason = [];
        for (const o of obj.doseStatusReason || []) {
          this.doseStatusReason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('series')) {
        this.series = obj.series;
      }
      if (obj.hasOwnProperty('doseNumber')) {
        this.doseNumber = new Element(obj.doseNumber);
      }
      if (obj.hasOwnProperty('seriesDoses')) {
        this.seriesDoses = new Element(obj.seriesDoses);
      }
    }
  }

}

export class ImmunizationRecommendationDateCriterionComponent extends BackboneElement {
  public code: CodeableConcept;
  public value: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class ImmunizationRecommendationRecommendationComponent extends BackboneElement {
  public vaccineCode?: CodeableConcept[];
  public targetDisease?: CodeableConcept;
  public contraindicatedVaccineCode?: CodeableConcept[];
  public forecastStatus: CodeableConcept;
  public forecastReason?: CodeableConcept[];
  public dateCriterion?: ImmunizationRecommendationDateCriterionComponent[];
  public description?: string;
  public series?: string;
  public doseNumber?: Element;
  public seriesDoses?: Element;
  public supportingImmunization?: ResourceReference[];
  public supportingPatientInformation?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('vaccineCode')) {
        this.vaccineCode = [];
        for (const o of obj.vaccineCode || []) {
          this.vaccineCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('targetDisease')) {
        this.targetDisease = new CodeableConcept(obj.targetDisease);
      }
      if (obj.hasOwnProperty('contraindicatedVaccineCode')) {
        this.contraindicatedVaccineCode = [];
        for (const o of obj.contraindicatedVaccineCode || []) {
          this.contraindicatedVaccineCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('forecastStatus')) {
        this.forecastStatus = new CodeableConcept(obj.forecastStatus);
      }
      if (obj.hasOwnProperty('forecastReason')) {
        this.forecastReason = [];
        for (const o of obj.forecastReason || []) {
          this.forecastReason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('dateCriterion')) {
        this.dateCriterion = [];
        for (const o of obj.dateCriterion || []) {
          this.dateCriterion.push(new ImmunizationRecommendationDateCriterionComponent(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('series')) {
        this.series = obj.series;
      }
      if (obj.hasOwnProperty('doseNumber')) {
        this.doseNumber = new Element(obj.doseNumber);
      }
      if (obj.hasOwnProperty('seriesDoses')) {
        this.seriesDoses = new Element(obj.seriesDoses);
      }
      if (obj.hasOwnProperty('supportingImmunization')) {
        this.supportingImmunization = [];
        for (const o of obj.supportingImmunization || []) {
          this.supportingImmunization.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('supportingPatientInformation')) {
        this.supportingPatientInformation = [];
        for (const o of obj.supportingPatientInformation || []) {
          this.supportingPatientInformation.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class ImmunizationRecommendation extends DomainResource {
  public resourceType = 'ImmunizationRecommendation';
  public identifier?: Identifier[];
  public patient: ResourceReference;
  public date: Date;
  public authority?: ResourceReference;
  public recommendation: ImmunizationRecommendationRecommendationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('authority')) {
        this.authority = new ResourceReference(obj.authority);
      }
      if (obj.hasOwnProperty('recommendation')) {
        this.recommendation = [];
        for (const o of obj.recommendation || []) {
          this.recommendation.push(new ImmunizationRecommendationRecommendationComponent(o));
        }
      }
    }
  }

}

export class ImplementationGuideDependsOnComponent extends BackboneElement {
  public uri: string;
  public packageId?: string;
  public version?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('uri')) {
        this.uri = obj.uri;
      }
      if (obj.hasOwnProperty('packageId')) {
        this.packageId = obj.packageId;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
    }
  }

}

export class ImplementationGuideGlobalComponent extends BackboneElement {
  public type: string;
  public profile: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
    }
  }

}

export class ImplementationGuideResourceComponent extends BackboneElement {
  public reference: ResourceReference;
  public name?: string;
  public description?: string;
  public exampleBoolean? = false;
  public exampleCanonical?: string;
  public groupingId?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('reference')) {
        this.reference = new ResourceReference(obj.reference);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('exampleBoolean')) {
        this.exampleBoolean = obj.exampleBoolean;
      }
      if (obj.hasOwnProperty('exampleCanonical')) {
        this.exampleCanonical = obj.exampleCanonical;

      }
      if (obj.hasOwnProperty('groupingId')) {
        this.groupingId = obj.groupingId;
      }
    }
  }

}

export class ImplementationGuidePageComponent extends BackboneElement {
  public nameUrl?: string;
  public nameReference?: ResourceReference;
  public title: string;
  public generation: string;
  public page?: ImplementationGuidePageComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('nameUrl')) {
        this.nameUrl = obj.nameUrl;
      }
      if (obj.hasOwnProperty('nameReference')) {
        this.nameReference = obj.nameReference;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('generation')) {
        this.generation = obj.generation;
      }
      if (obj.hasOwnProperty('page')) {
        this.page = [];
        for (const o of obj.page || []) {
          this.page.push(new ImplementationGuidePageComponent(o));
        }
      }
    }
  }

  public getExtension() {
    switch (this.generation) {
      case 'markdown':
      case 'generated':
        return '.md';
      default:
        return `.${this.generation}`;
    }
  }

  public setTitle(value: string, isRoot = false) {
    this.title = value;

    if (!isRoot && value) {
      this.fileName = value.toLowerCase().replace(/\s/g, '_').replace(/[():]/g, '') + this.getExtension();
    } else if (isRoot) {
      this.fileName = 'index' + this.getExtension();
    }
  }

  public get navMenu() {
    const navMenuExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
    if (navMenuExt) return navMenuExt.valueString;
  }

  public set navMenu(value: string) {
    this.extension = this.extension || [];
    let navMenuExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);

    if (!navMenuExt && value) {
      navMenuExt = {
        url: Globals.extensionUrls['extension-ig-page-nav-menu'],
        valueString: value
      };
      this.extension.push(navMenuExt);
    } else if (navMenuExt && !value) {
      const index = this.extension.indexOf(navMenuExt);
      this.extension.splice(index, 1);
    } else if (navMenuExt && value) {
      navMenuExt.valueString = value
    }
  }

  public get fileName() {
    const fileNameExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-filename']);
    if (fileNameExt) return fileNameExt.valueUri;
  }

  public set fileName(value: string) {
    this.extension = this.extension || [];
    let fileNameExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-filename']);

    if (!fileNameExt && value) {
      fileNameExt = {
        url: Globals.extensionUrls['extension-ig-page-filename'],
        valueUri: value.replace(/\s/g, '_')
      };
      this.extension.push(fileNameExt);
    } else if (fileNameExt && !value) {
      const index = this.extension.indexOf(fileNameExt);
      this.extension.splice(index, 1);
    } else if (fileNameExt && value) {
      fileNameExt.valueUri = value.replace(/\s/g, '_');
    }

    if (this.hasOwnProperty('nameUrl') || !this.nameReference) {
      if (value) {
        let generatedNameUrl = value;

        if (!generatedNameUrl.endsWith('.html')) {
          generatedNameUrl = generatedNameUrl.substring(0, generatedNameUrl.lastIndexOf('.')) + '.html';
        }

        this.nameUrl = generatedNameUrl;
      } else {
        delete this.nameUrl;
      }
    }
  }

  public get reuseDescription() {
    const reuseDescriptionExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-reuse-description']);
    if (reuseDescriptionExt) return reuseDescriptionExt.valueBoolean;
    return false;
  }

  public set reuseDescription(value: boolean) {
    this.extension = this.extension || [];
    let reuseDescriptionExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-reuse-description']);

    if (!reuseDescriptionExt) {
      reuseDescriptionExt = {
        url: Globals.extensionUrls['extension-ig-page-reuse-description'],
        valueBoolean: value
      };
      this.extension.push(reuseDescriptionExt);
    } else if (reuseDescriptionExt) {
      reuseDescriptionExt.valueBoolean = value;
    }

    if (value) {
      this.contentMarkdown = null;
    }
  }

  public get contentMarkdown() {
    const contentExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-content']);
    if (contentExt) return contentExt.valueMarkdown;
  }

  public set contentMarkdown(value: string) {
    this.extension = this.extension || [];
    let contentExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-content']);

    if (!contentExt && value) {
      contentExt = {
        url: Globals.extensionUrls['extension-ig-page-content'],
        valueMarkdown: value
      };
      this.extension.push(contentExt);
    } else if (contentExt && !value) {
      const index = this.extension.indexOf(contentExt);
      this.extension.splice(index, 1);
    } else if (contentExt && value) {
      contentExt.valueMarkdown = value;
    }
  }

}

export class ImplementationGuideParameterComponent extends BackboneElement {
  public code: string;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class ImplementationGuideTemplateComponent extends BackboneElement {
  public code: string;
  public source: string;
  public scope?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('source')) {
        this.source = obj.source;
      }
      if (obj.hasOwnProperty('scope')) {
        this.scope = obj.scope;
      }
    }
  }

}

export class ImplementationGuideGroupingComponent extends BackboneElement {
  public name: string;
  public description?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
    }
  }
}

export class ImplementationGuideDefinitionComponent extends BackboneElement {
  public grouping?: ImplementationGuideGroupingComponent[];
  public resource: ImplementationGuideResourceComponent[];
  public page?: ImplementationGuidePageComponent;
  public parameter?: ImplementationGuideParameterComponent[];
  public template?: ImplementationGuideTemplateComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('grouping')) {
        this.grouping = [];
        for (const o of obj.grouping || []) {
          this.grouping.push(new ImplementationGuideGroupingComponent(o));
        }
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = [];
        for (const o of obj.resource || []) {
          this.resource.push(new ImplementationGuideResourceComponent(o));
        }
      }
      if (obj.hasOwnProperty('page')) {
        this.page = new ImplementationGuidePageComponent(obj.page);
      }
      if (obj.hasOwnProperty('parameter')) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new ImplementationGuideParameterComponent(o));
        }
      }
      if (obj.hasOwnProperty('template')) {
        this.template = [];
        for (const o of obj.template || []) {
          this.template.push(new ImplementationGuideTemplateComponent(o));
        }
      }
    }
  }

}

export class ImplementationGuideManifestResourceComponent extends BackboneElement {
  public reference: ResourceReference;
  public example?: Element;
  public relativePath?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('reference')) {
        this.reference = new ResourceReference(obj.reference);
      }
      if (obj.hasOwnProperty('example')) {
        this.example = new Element(obj.example);
      }
      if (obj.hasOwnProperty('relativePath')) {
        this.relativePath = obj.relativePath;
      }
    }
  }

}

export class ImplementationGuideManifestPageComponent extends BackboneElement {
  public name: string;
  public title?: string;
  public anchor?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('anchor')) {
        this.anchor = obj.anchor;
      }
    }
  }

}

export class ImplementationGuideManifestComponent extends BackboneElement {
  public rendering?: string;
  public resource: ImplementationGuideManifestResourceComponent[];
  public page?: ImplementationGuideManifestPageComponent[];
  public image?: string[];
  public other?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('rendering')) {
        this.rendering = obj.rendering;
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = [];
        for (const o of obj.resource || []) {
          this.resource.push(new ImplementationGuideManifestResourceComponent(o));
        }
      }
      if (obj.hasOwnProperty('page')) {
        this.page = [];
        for (const o of obj.page || []) {
          this.page.push(new ImplementationGuideManifestPageComponent(o));
        }
      }
      if (obj.hasOwnProperty('image')) {
        this.image = obj.image;
      }
      if (obj.hasOwnProperty('other')) {
        this.other = obj.other;
      }
    }
  }

}

export class ImplementationGuide extends DomainResource implements IImplementationGuide {
  public resourceType = 'ImplementationGuide';
  public url: string;
  public version?: string;
  public name: string;
  public title?: string;
  public status = 'draft';
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public copyright?: string;
  public packageId?: string;
  public license?: string;
  public fhirVersion: string[] = ['4.0.1'];
  public dependsOn?: ImplementationGuideDependsOnComponent[];
  public global?: ImplementationGuideGlobalComponent[];
  public definition?: ImplementationGuideDefinitionComponent;
  public manifest?: ImplementationGuideManifestComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('packageId')) {
        this.packageId = obj.packageId;
      }
      if (obj.hasOwnProperty('license')) {
        this.license = obj.license;
      }
      if (obj.hasOwnProperty('fhirVersion')) {
        this.fhirVersion = obj.fhirVersion;
      }
      if (obj.hasOwnProperty('dependsOn')) {
        this.dependsOn = [];
        for (const o of obj.dependsOn || []) {
          this.dependsOn.push(new ImplementationGuideDependsOnComponent(o));
        }
      }
      if (obj.hasOwnProperty('global')) {
        this.global = [];
        for (const o of obj.global || []) {
          this.global.push(new ImplementationGuideGlobalComponent(o));
        }
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = new ImplementationGuideDefinitionComponent(obj.definition);
      }
      if (obj.hasOwnProperty('manifest')) {
        this.manifest = new ImplementationGuideManifestComponent(obj.manifest);
      }
    }
  }

}

export class InsurancePlanContactComponent extends BackboneElement {
  public purpose?: CodeableConcept;
  public name?: HumanName;
  public telecom?: ContactPoint[];
  public address?: Address;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = new CodeableConcept(obj.purpose);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = new HumanName(obj.name);
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('address')) {
        this.address = new Address(obj.address);
      }
    }
  }

}

export class InsurancePlanLimitComponent extends BackboneElement {
  public value?: Quantity;
  public code?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('value')) {
        this.value = new Quantity(obj.value);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
    }
  }

}

export class InsurancePlanCoverageBenefitComponent extends BackboneElement {
  public type: CodeableConcept;
  public requirement?: string;
  public limit?: InsurancePlanLimitComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('requirement')) {
        this.requirement = obj.requirement;
      }
      if (obj.hasOwnProperty('limit')) {
        this.limit = [];
        for (const o of obj.limit || []) {
          this.limit.push(new InsurancePlanLimitComponent(o));
        }
      }
    }
  }

}

export class InsurancePlanCoverageComponent extends BackboneElement {
  public type: CodeableConcept;
  public network?: ResourceReference[];
  public benefit: InsurancePlanCoverageBenefitComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('network')) {
        this.network = [];
        for (const o of obj.network || []) {
          this.network.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('benefit')) {
        this.benefit = [];
        for (const o of obj.benefit || []) {
          this.benefit.push(new InsurancePlanCoverageBenefitComponent(o));
        }
      }
    }
  }

}

export class InsurancePlanGeneralCostComponent extends BackboneElement {
  public type?: CodeableConcept;
  public groupSize?: number;
  public cost?: Money;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('groupSize')) {
        this.groupSize = obj.groupSize;
      }
      if (obj.hasOwnProperty('cost')) {
        this.cost = new Money(obj.cost);
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
    }
  }

}

export class InsurancePlanCostComponent extends BackboneElement {
  public type: CodeableConcept;
  public applicability?: CodeableConcept;
  public qualifiers?: CodeableConcept[];
  public value?: Quantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('applicability')) {
        this.applicability = new CodeableConcept(obj.applicability);
      }
      if (obj.hasOwnProperty('qualifiers')) {
        this.qualifiers = [];
        for (const o of obj.qualifiers || []) {
          this.qualifiers.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Quantity(obj.value);
      }
    }
  }

}

export class InsurancePlanPlanBenefitComponent extends BackboneElement {
  public type: CodeableConcept;
  public cost?: InsurancePlanCostComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('cost')) {
        this.cost = [];
        for (const o of obj.cost || []) {
          this.cost.push(new InsurancePlanCostComponent(o));
        }
      }
    }
  }

}

export class InsurancePlanSpecificCostComponent extends BackboneElement {
  public category: CodeableConcept;
  public benefit?: InsurancePlanPlanBenefitComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('benefit')) {
        this.benefit = [];
        for (const o of obj.benefit || []) {
          this.benefit.push(new InsurancePlanPlanBenefitComponent(o));
        }
      }
    }
  }

}

export class InsurancePlanPlanComponent extends BackboneElement {
  public identifier?: Identifier[];
  public type?: CodeableConcept;
  public coverageArea?: ResourceReference[];
  public network?: ResourceReference[];
  public generalCost?: InsurancePlanGeneralCostComponent[];
  public specificCost?: InsurancePlanSpecificCostComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('coverageArea')) {
        this.coverageArea = [];
        for (const o of obj.coverageArea || []) {
          this.coverageArea.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('network')) {
        this.network = [];
        for (const o of obj.network || []) {
          this.network.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('generalCost')) {
        this.generalCost = [];
        for (const o of obj.generalCost || []) {
          this.generalCost.push(new InsurancePlanGeneralCostComponent(o));
        }
      }
      if (obj.hasOwnProperty('specificCost')) {
        this.specificCost = [];
        for (const o of obj.specificCost || []) {
          this.specificCost.push(new InsurancePlanSpecificCostComponent(o));
        }
      }
    }
  }

}

export class InsurancePlan extends DomainResource {
  public resourceType = 'InsurancePlan';
  public identifier?: Identifier[];
  public status?: string;
  public type?: CodeableConcept[];
  public name?: string;
  public alias?: string[];
  public period?: Period;
  public ownedBy?: ResourceReference;
  public administeredBy?: ResourceReference;
  public coverageArea?: ResourceReference[];
  public contact?: InsurancePlanContactComponent[];
  public endpoint?: ResourceReference[];
  public network?: ResourceReference[];
  public coverage?: InsurancePlanCoverageComponent[];
  public plan?: InsurancePlanPlanComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('alias')) {
        this.alias = obj.alias;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('ownedBy')) {
        this.ownedBy = new ResourceReference(obj.ownedBy);
      }
      if (obj.hasOwnProperty('administeredBy')) {
        this.administeredBy = new ResourceReference(obj.administeredBy);
      }
      if (obj.hasOwnProperty('coverageArea')) {
        this.coverageArea = [];
        for (const o of obj.coverageArea || []) {
          this.coverageArea.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new InsurancePlanContactComponent(o));
        }
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('network')) {
        this.network = [];
        for (const o of obj.network || []) {
          this.network.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('coverage')) {
        this.coverage = [];
        for (const o of obj.coverage || []) {
          this.coverage.push(new InsurancePlanCoverageComponent(o));
        }
      }
      if (obj.hasOwnProperty('plan')) {
        this.plan = [];
        for (const o of obj.plan || []) {
          this.plan.push(new InsurancePlanPlanComponent(o));
        }
      }
    }
  }

}

export class InvoiceParticipantComponent extends BackboneElement {
  public role?: CodeableConcept;
  public actor: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = new ResourceReference(obj.actor);
      }
    }
  }

}

export class InvoicePriceComponentComponent extends BackboneElement {
  public type: string;
  public code?: CodeableConcept;
  public factor?: number;
  public amount?: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Money(obj.amount);
      }
    }
  }

}

export class InvoiceLineItemComponent extends BackboneElement {
  public sequence?: number;
  public chargeItem: Element;
  public priceComponent?: InvoicePriceComponentComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequence')) {
        this.sequence = obj.sequence;
      }
      if (obj.hasOwnProperty('chargeItem')) {
        this.chargeItem = new Element(obj.chargeItem);
      }
      if (obj.hasOwnProperty('priceComponent')) {
        this.priceComponent = [];
        for (const o of obj.priceComponent || []) {
          this.priceComponent.push(new InvoicePriceComponentComponent(o));
        }
      }
    }
  }

}

export class Invoice extends DomainResource {
  public resourceType = 'Invoice';
  public identifier?: Identifier[];
  public status: string;
  public cancelledReason?: string;
  public type?: CodeableConcept;
  public subject?: ResourceReference;
  public recipient?: ResourceReference;
  public date?: Date;
  public participant?: InvoiceParticipantComponent[];
  public issuer?: ResourceReference;
  public account?: ResourceReference;
  public lineItem?: InvoiceLineItemComponent[];
  public totalPriceComponent?: InvoicePriceComponentComponent[];
  public totalNet?: Money;
  public totalGross?: Money;
  public paymentTerms?: string;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('cancelledReason')) {
        this.cancelledReason = obj.cancelledReason;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('recipient')) {
        this.recipient = new ResourceReference(obj.recipient);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('participant')) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new InvoiceParticipantComponent(o));
        }
      }
      if (obj.hasOwnProperty('issuer')) {
        this.issuer = new ResourceReference(obj.issuer);
      }
      if (obj.hasOwnProperty('account')) {
        this.account = new ResourceReference(obj.account);
      }
      if (obj.hasOwnProperty('lineItem')) {
        this.lineItem = [];
        for (const o of obj.lineItem || []) {
          this.lineItem.push(new InvoiceLineItemComponent(o));
        }
      }
      if (obj.hasOwnProperty('totalPriceComponent')) {
        this.totalPriceComponent = [];
        for (const o of obj.totalPriceComponent || []) {
          this.totalPriceComponent.push(new InvoicePriceComponentComponent(o));
        }
      }
      if (obj.hasOwnProperty('totalNet')) {
        this.totalNet = new Money(obj.totalNet);
      }
      if (obj.hasOwnProperty('totalGross')) {
        this.totalGross = new Money(obj.totalGross);
      }
      if (obj.hasOwnProperty('paymentTerms')) {
        this.paymentTerms = obj.paymentTerms;
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class ItemInstance extends DomainResource {
  public resourceType = 'ItemInstance';
  public count: number;
  public location?: ResourceReference;
  public subject?: ResourceReference;
  public manufactureDate?: Date;
  public expiryDate?: Date;
  public currentSWVersion?: string;
  public lotNumber?: string;
  public serialNumber?: string;
  public carrierAIDC?: string;
  public carrierHRF?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('count')) {
        this.count = obj.count;
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('manufactureDate')) {
        this.manufactureDate = obj.manufactureDate;
      }
      if (obj.hasOwnProperty('expiryDate')) {
        this.expiryDate = obj.expiryDate;
      }
      if (obj.hasOwnProperty('currentSWVersion')) {
        this.currentSWVersion = obj.currentSWVersion;
      }
      if (obj.hasOwnProperty('lotNumber')) {
        this.lotNumber = obj.lotNumber;
      }
      if (obj.hasOwnProperty('serialNumber')) {
        this.serialNumber = obj.serialNumber;
      }
      if (obj.hasOwnProperty('carrierAIDC')) {
        this.carrierAIDC = obj.carrierAIDC;
      }
      if (obj.hasOwnProperty('carrierHRF')) {
        this.carrierHRF = obj.carrierHRF;
      }
    }
  }

}

export class ParameterDefinition extends Element {
  public name?: string;
  public use: string;
  public min?: number;
  public max?: string;
  public documentation?: string;
  public type: string;
  public profile?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('min')) {
        this.min = obj.min;
      }
      if (obj.hasOwnProperty('max')) {
        this.max = obj.max;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
    }
  }

}

export class Library extends DomainResource {
  public resourceType = 'Library';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public subtitle?: string;
  public status: string;
  public experimental?: boolean;
  public type: CodeableConcept;
  public subject?: Element;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public usage?: string;
  public copyright?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public topic?: CodeableConcept[];
  public author?: ContactDetail[];
  public editor?: ContactDetail[];
  public reviewer?: ContactDetail[];
  public endorser?: ContactDetail[];
  public relatedArtifact?: RelatedArtifact[];
  public parameter?: ParameterDefinition[];
  public dataRequirement?: DataRequirement[];
  public content?: Attachment[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('subtitle')) {
        this.subtitle = obj.subtitle;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new Element(obj.subject);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('usage')) {
        this.usage = obj.usage;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('approvalDate')) {
        this.approvalDate = obj.approvalDate;
      }
      if (obj.hasOwnProperty('lastReviewDate')) {
        this.lastReviewDate = obj.lastReviewDate;
      }
      if (obj.hasOwnProperty('effectivePeriod')) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.hasOwnProperty('topic')) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('author')) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('editor')) {
        this.editor = [];
        for (const o of obj.editor || []) {
          this.editor.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('reviewer')) {
        this.reviewer = [];
        for (const o of obj.reviewer || []) {
          this.reviewer.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('endorser')) {
        this.endorser = [];
        for (const o of obj.endorser || []) {
          this.endorser.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('relatedArtifact')) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.hasOwnProperty('parameter')) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new ParameterDefinition(o));
        }
      }
      if (obj.hasOwnProperty('dataRequirement')) {
        this.dataRequirement = [];
        for (const o of obj.dataRequirement || []) {
          this.dataRequirement.push(new DataRequirement(o));
        }
      }
      if (obj.hasOwnProperty('content')) {
        this.content = [];
        for (const o of obj.content || []) {
          this.content.push(new Attachment(o));
        }
      }
    }
  }

}

export class LinkageItemComponent extends BackboneElement {
  public type: string;
  public resource: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = new ResourceReference(obj.resource);
      }
    }
  }

}

export class Linkage extends DomainResource {
  public resourceType = 'Linkage';
  public active?: boolean;
  public author?: ResourceReference;
  public item: LinkageItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new LinkageItemComponent(o));
        }
      }
    }
  }

}

export class ListEntryComponent extends BackboneElement {
  public flag?: CodeableConcept;
  public deleted?: boolean;
  public date?: Date;
  public item: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('flag')) {
        this.flag = new CodeableConcept(obj.flag);
      }
      if (obj.hasOwnProperty('deleted')) {
        this.deleted = obj.deleted;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('item')) {
        this.item = new ResourceReference(obj.item);
      }
    }
  }

}

export class List extends DomainResource {
  public resourceType = 'List';
  public identifier?: Identifier[];
  public status: string;
  public mode: string;
  public title?: string;
  public code?: CodeableConcept;
  public subject?: ResourceReference;
  public encounter?: ResourceReference;
  public date?: Date;
  public source?: ResourceReference;
  public orderedBy?: CodeableConcept;
  public note?: Annotation[];
  public entry?: ListEntryComponent[];
  public emptyReason?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.hasOwnProperty('orderedBy')) {
        this.orderedBy = new CodeableConcept(obj.orderedBy);
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('entry')) {
        this.entry = [];
        for (const o of obj.entry || []) {
          this.entry.push(new ListEntryComponent(o));
        }
      }
      if (obj.hasOwnProperty('emptyReason')) {
        this.emptyReason = new CodeableConcept(obj.emptyReason);
      }
    }
  }

}

export class LocationPositionComponent extends BackboneElement {
  public longitude: number;
  public latitude: number;
  public altitude?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('longitude')) {
        this.longitude = obj.longitude;
      }
      if (obj.hasOwnProperty('latitude')) {
        this.latitude = obj.latitude;
      }
      if (obj.hasOwnProperty('altitude')) {
        this.altitude = obj.altitude;
      }
    }
  }

}

export class LocationHoursOfOperationComponent extends BackboneElement {
  public daysOfWeek?: string[];
  public allDay?: boolean;
  public openingTime?: Date;
  public closingTime?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('daysOfWeek')) {
        this.daysOfWeek = obj.daysOfWeek;
      }
      if (obj.hasOwnProperty('allDay')) {
        this.allDay = obj.allDay;
      }
      if (obj.hasOwnProperty('openingTime')) {
        this.openingTime = obj.openingTime;
      }
      if (obj.hasOwnProperty('closingTime')) {
        this.closingTime = obj.closingTime;
      }
    }
  }

}

export class Location extends DomainResource {
  public resourceType = 'Location';
  public identifier?: Identifier[];
  public status?: string;
  public operationalStatus?: Coding;
  public name?: string;
  public alias?: string[];
  public description?: string;
  public mode?: string;
  public type?: CodeableConcept[];
  public telecom?: ContactPoint[];
  public address?: Address;
  public physicalType?: CodeableConcept;
  public position?: LocationPositionComponent;
  public managingOrganization?: ResourceReference;
  public partOf?: ResourceReference;
  public hoursOfOperation?: LocationHoursOfOperationComponent[];
  public availabilityExceptions?: string;
  public endpoint?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('operationalStatus')) {
        this.operationalStatus = new Coding(obj.operationalStatus);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('alias')) {
        this.alias = obj.alias;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('address')) {
        this.address = new Address(obj.address);
      }
      if (obj.hasOwnProperty('physicalType')) {
        this.physicalType = new CodeableConcept(obj.physicalType);
      }
      if (obj.hasOwnProperty('position')) {
        this.position = new LocationPositionComponent(obj.position);
      }
      if (obj.hasOwnProperty('managingOrganization')) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = new ResourceReference(obj.partOf);
      }
      if (obj.hasOwnProperty('hoursOfOperation')) {
        this.hoursOfOperation = [];
        for (const o of obj.hoursOfOperation || []) {
          this.hoursOfOperation.push(new LocationHoursOfOperationComponent(o));
        }
      }
      if (obj.hasOwnProperty('availabilityExceptions')) {
        this.availabilityExceptions = obj.availabilityExceptions;
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class MarketingStatus extends BackboneElement {
  public country: CodeableConcept;
  public jurisdiction?: CodeableConcept;
  public status: CodeableConcept;
  public dateRange: Period;
  public restoreDate?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('country')) {
        this.country = new CodeableConcept(obj.country);
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = new CodeableConcept(obj.jurisdiction);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = new CodeableConcept(obj.status);
      }
      if (obj.hasOwnProperty('dateRange')) {
        this.dateRange = new Period(obj.dateRange);
      }
      if (obj.hasOwnProperty('restoreDate')) {
        this.restoreDate = obj.restoreDate;
      }
    }
  }

}

export class MeasurePopulationComponent extends BackboneElement {
  public code?: CodeableConcept;
  public description?: string;
  public criteria: Expression;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('criteria')) {
        this.criteria = new Expression(obj.criteria);
      }
    }
  }

}

export class MeasureStratifierComponent extends BackboneElement {
  public code?: CodeableConcept;
  public description?: string;
  public criteria: Expression;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('criteria')) {
        this.criteria = new Expression(obj.criteria);
      }
    }
  }

}

export class MeasureGroupComponent extends BackboneElement {
  public code?: CodeableConcept;
  public description?: string;
  public population?: MeasurePopulationComponent[];
  public stratifier?: MeasureStratifierComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('population')) {
        this.population = [];
        for (const o of obj.population || []) {
          this.population.push(new MeasurePopulationComponent(o));
        }
      }
      if (obj.hasOwnProperty('stratifier')) {
        this.stratifier = [];
        for (const o of obj.stratifier || []) {
          this.stratifier.push(new MeasureStratifierComponent(o));
        }
      }
    }
  }

}

export class MeasureSupplementalDataComponent extends BackboneElement {
  public code?: CodeableConcept;
  public usage?: CodeableConcept[];
  public description?: string;
  public criteria: Expression;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('usage')) {
        this.usage = [];
        for (const o of obj.usage || []) {
          this.usage.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('criteria')) {
        this.criteria = new Expression(obj.criteria);
      }
    }
  }

}

export class Measure extends DomainResource {
  public resourceType = 'Measure';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public subtitle?: string;
  public status: string;
  public experimental?: boolean;
  public subject?: Element;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public usage?: string;
  public copyright?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public topic?: CodeableConcept[];
  public author?: ContactDetail[];
  public editor?: ContactDetail[];
  public reviewer?: ContactDetail[];
  public endorser?: ContactDetail[];
  public relatedArtifact?: RelatedArtifact[];
  public library?: string[];
  public disclaimer?: string;
  public scoring?: CodeableConcept;
  public compositeScoring?: CodeableConcept;
  public type?: CodeableConcept[];
  public riskAdjustment?: string;
  public rateAggregation?: string;
  public rationale?: string;
  public clinicalRecommendationStatement?: string;
  public improvementNotation?: string;
  public definition?: string[];
  public guidance?: string;
  public group?: MeasureGroupComponent[];
  public supplementalData?: MeasureSupplementalDataComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('subtitle')) {
        this.subtitle = obj.subtitle;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new Element(obj.subject);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('usage')) {
        this.usage = obj.usage;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('approvalDate')) {
        this.approvalDate = obj.approvalDate;
      }
      if (obj.hasOwnProperty('lastReviewDate')) {
        this.lastReviewDate = obj.lastReviewDate;
      }
      if (obj.hasOwnProperty('effectivePeriod')) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.hasOwnProperty('topic')) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('author')) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('editor')) {
        this.editor = [];
        for (const o of obj.editor || []) {
          this.editor.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('reviewer')) {
        this.reviewer = [];
        for (const o of obj.reviewer || []) {
          this.reviewer.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('endorser')) {
        this.endorser = [];
        for (const o of obj.endorser || []) {
          this.endorser.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('relatedArtifact')) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.hasOwnProperty('library')) {
        this.library = obj.library;
      }
      if (obj.hasOwnProperty('disclaimer')) {
        this.disclaimer = obj.disclaimer;
      }
      if (obj.hasOwnProperty('scoring')) {
        this.scoring = new CodeableConcept(obj.scoring);
      }
      if (obj.hasOwnProperty('compositeScoring')) {
        this.compositeScoring = new CodeableConcept(obj.compositeScoring);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('riskAdjustment')) {
        this.riskAdjustment = obj.riskAdjustment;
      }
      if (obj.hasOwnProperty('rateAggregation')) {
        this.rateAggregation = obj.rateAggregation;
      }
      if (obj.hasOwnProperty('rationale')) {
        this.rationale = obj.rationale;
      }
      if (obj.hasOwnProperty('clinicalRecommendationStatement')) {
        this.clinicalRecommendationStatement = obj.clinicalRecommendationStatement;
      }
      if (obj.hasOwnProperty('improvementNotation')) {
        this.improvementNotation = obj.improvementNotation;
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('guidance')) {
        this.guidance = obj.guidance;
      }
      if (obj.hasOwnProperty('group')) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new MeasureGroupComponent(o));
        }
      }
      if (obj.hasOwnProperty('supplementalData')) {
        this.supplementalData = [];
        for (const o of obj.supplementalData || []) {
          this.supplementalData.push(new MeasureSupplementalDataComponent(o));
        }
      }
    }
  }

}

export class MeasureReportPopulationComponent extends BackboneElement {
  public code?: CodeableConcept;
  public count?: number;
  public subjectResults?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('count')) {
        this.count = obj.count;
      }
      if (obj.hasOwnProperty('subjectResults')) {
        this.subjectResults = new ResourceReference(obj.subjectResults);
      }
    }
  }

}

export class MeasureReportStratifierGroupPopulationComponent extends BackboneElement {
  public code?: CodeableConcept;
  public count?: number;
  public subjectResults?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('count')) {
        this.count = obj.count;
      }
      if (obj.hasOwnProperty('subjectResults')) {
        this.subjectResults = new ResourceReference(obj.subjectResults);
      }
    }
  }

}

export class MeasureReportStratifierGroupComponent extends BackboneElement {
  public value: CodeableConcept;
  public population?: MeasureReportStratifierGroupPopulationComponent[];
  public measureScore?: Quantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('value')) {
        this.value = new CodeableConcept(obj.value);
      }
      if (obj.hasOwnProperty('population')) {
        this.population = [];
        for (const o of obj.population || []) {
          this.population.push(new MeasureReportStratifierGroupPopulationComponent(o));
        }
      }
      if (obj.hasOwnProperty('measureScore')) {
        this.measureScore = new Quantity(obj.measureScore);
      }
    }
  }

}

export class MeasureReportStratifierComponent extends BackboneElement {
  public code?: CodeableConcept;
  public stratum?: MeasureReportStratifierGroupComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('stratum')) {
        this.stratum = [];
        for (const o of obj.stratum || []) {
          this.stratum.push(new MeasureReportStratifierGroupComponent(o));
        }
      }
    }
  }

}

export class MeasureReportGroupComponent extends BackboneElement {
  public code?: CodeableConcept;
  public population?: MeasureReportPopulationComponent[];
  public measureScore?: Quantity;
  public stratifier?: MeasureReportStratifierComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('population')) {
        this.population = [];
        for (const o of obj.population || []) {
          this.population.push(new MeasureReportPopulationComponent(o));
        }
      }
      if (obj.hasOwnProperty('measureScore')) {
        this.measureScore = new Quantity(obj.measureScore);
      }
      if (obj.hasOwnProperty('stratifier')) {
        this.stratifier = [];
        for (const o of obj.stratifier || []) {
          this.stratifier.push(new MeasureReportStratifierComponent(o));
        }
      }
    }
  }

}

export class MeasureReport extends DomainResource {
  public resourceType = 'MeasureReport';
  public identifier?: Identifier[];
  public status: string;
  public type: string;
  public measure: string;
  public subject?: ResourceReference;
  public date?: Date;
  public reporter?: ResourceReference;
  public period: Period;
  public improvementNotation?: string;
  public group?: MeasureReportGroupComponent[];
  public evaluatedResource?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('measure')) {
        this.measure = obj.measure;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('reporter')) {
        this.reporter = new ResourceReference(obj.reporter);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('improvementNotation')) {
        this.improvementNotation = obj.improvementNotation;
      }
      if (obj.hasOwnProperty('group')) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new MeasureReportGroupComponent(o));
        }
      }
      if (obj.hasOwnProperty('evaluatedResource')) {
        this.evaluatedResource = [];
        for (const o of obj.evaluatedResource || []) {
          this.evaluatedResource.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class Media extends DomainResource {
  public resourceType = 'Media';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status: 'preparation'|'in-progress'|'not-done'|'suspended'|'aborted'|'completed'|'entered-in-error'|'unknown';
  public type?: CodeableConcept;
  public modality?: CodeableConcept;
  public view?: CodeableConcept;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public created?: Element;
  public issued?: Date;
  public operator?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public bodySite?: CodeableConcept;
  public deviceName?: string;
  public device?: ResourceReference;
  public height?: number;
  public width?: number;
  public frames?: number;
  public duration?: number;
  public content: Attachment;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('modality')) {
        this.modality = new CodeableConcept(obj.modality);
      }
      if (obj.hasOwnProperty('view')) {
        this.view = new CodeableConcept(obj.view);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = new Element(obj.created);
      }
      if (obj.hasOwnProperty('issued')) {
        this.issued = obj.issued;
      }
      if (obj.hasOwnProperty('operator')) {
        this.operator = new ResourceReference(obj.operator);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.hasOwnProperty('deviceName')) {
        this.deviceName = obj.deviceName;
      }
      if (obj.hasOwnProperty('device')) {
        this.device = new ResourceReference(obj.device);
      }
      if (obj.hasOwnProperty('height')) {
        this.height = obj.height;
      }
      if (obj.hasOwnProperty('width')) {
        this.width = obj.width;
      }
      if (obj.hasOwnProperty('frames')) {
        this.frames = obj.frames;
      }
      if (obj.hasOwnProperty('duration')) {
        this.duration = obj.duration;
      }
      if (obj.hasOwnProperty('content')) {
        this.content = new Attachment(obj.content);
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class MedicationIngredientComponent extends BackboneElement {
  public item: Element;
  public isActive?: boolean;
  public amount?: Ratio;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('item')) {
        this.item = new Element(obj.item);
      }
      if (obj.hasOwnProperty('isActive')) {
        this.isActive = obj.isActive;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Ratio(obj.amount);
      }
    }
  }

}

export class MedicationBatchComponent extends BackboneElement {
  public lotNumber?: string;
  public expirationDate?: Date;
  public serialNumber?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('lotNumber')) {
        this.lotNumber = obj.lotNumber;
      }
      if (obj.hasOwnProperty('expirationDate')) {
        this.expirationDate = obj.expirationDate;
      }
      if (obj.hasOwnProperty('serialNumber')) {
        this.serialNumber = obj.serialNumber;
      }
    }
  }

}

export class Medication extends DomainResource {
  public resourceType = 'Medication';
  public code?: CodeableConcept;
  public status?: string;
  public manufacturer?: ResourceReference;
  public form?: CodeableConcept;
  public amount?: SimpleQuantity;
  public ingredient?: MedicationIngredientComponent[];
  public batch?: MedicationBatchComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = new ResourceReference(obj.manufacturer);
      }
      if (obj.hasOwnProperty('form')) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new SimpleQuantity(obj.amount);
      }
      if (obj.hasOwnProperty('ingredient')) {
        this.ingredient = [];
        for (const o of obj.ingredient || []) {
          this.ingredient.push(new MedicationIngredientComponent(o));
        }
      }
      if (obj.hasOwnProperty('batch')) {
        this.batch = new MedicationBatchComponent(obj.batch);
      }
    }
  }

}

export class MedicationAdministrationPerformerComponent extends BackboneElement {
  public function?: CodeableConcept;
  public actor: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('function')) {
        this.function = new CodeableConcept(obj.function);
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = new ResourceReference(obj.actor);
      }
    }
  }

}

export class MedicationAdministrationDosageComponent extends BackboneElement {
  public text?: string;
  public site?: CodeableConcept;
  public route?: CodeableConcept;
  public method?: CodeableConcept;
  public dose?: SimpleQuantity;
  public rate?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('site')) {
        this.site = new CodeableConcept(obj.site);
      }
      if (obj.hasOwnProperty('route')) {
        this.route = new CodeableConcept(obj.route);
      }
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.hasOwnProperty('dose')) {
        this.dose = new SimpleQuantity(obj.dose);
      }
      if (obj.hasOwnProperty('rate')) {
        this.rate = new Element(obj.rate);
      }
    }
  }

}

export class MedicationAdministration extends DomainResource {
  public resourceType = 'MedicationAdministration';
  public identifier?: Identifier[];
  public instantiates?: string[];
  public partOf?: ResourceReference[];
  public status: string;
  public category?: CodeableConcept;
  public medication: Element;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public supportingInformation?: ResourceReference[];
  public effective: Element;
  public performer?: MedicationAdministrationPerformerComponent[];
  public statusReason?: CodeableConcept[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public request?: ResourceReference;
  public device?: ResourceReference[];
  public note?: Annotation[];
  public dosage?: MedicationAdministrationDosageComponent;
  public eventHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiates')) {
        this.instantiates = obj.instantiates;
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('medication')) {
        this.medication = new Element(obj.medication);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('supportingInformation')) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('effective')) {
        this.effective = new Element(obj.effective);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new MedicationAdministrationPerformerComponent(o));
        }
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = [];
        for (const o of obj.statusReason || []) {
          this.statusReason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.hasOwnProperty('device')) {
        this.device = [];
        for (const o of obj.device || []) {
          this.device.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('dosage')) {
        this.dosage = new MedicationAdministrationDosageComponent(obj.dosage);
      }
      if (obj.hasOwnProperty('eventHistory')) {
        this.eventHistory = [];
        for (const o of obj.eventHistory || []) {
          this.eventHistory.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class MedicationDispensePerformerComponent extends BackboneElement {
  public function?: CodeableConcept;
  public actor: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('function')) {
        this.function = new CodeableConcept(obj.function);
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = new ResourceReference(obj.actor);
      }
    }
  }

}

export class MedicationDispenseSubstitutionComponent extends BackboneElement {
  public wasSubstituted: boolean;
  public type?: CodeableConcept;
  public reason?: CodeableConcept[];
  public responsibleParty?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('wasSubstituted')) {
        this.wasSubstituted = obj.wasSubstituted;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('responsibleParty')) {
        this.responsibleParty = [];
        for (const o of obj.responsibleParty || []) {
          this.responsibleParty.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class MedicationDispense extends DomainResource {
  public resourceType = 'MedicationDispense';
  public identifier?: Identifier[];
  public partOf?: ResourceReference[];
  public status: string;
  public category?: CodeableConcept;
  public medication: Element;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public supportingInformation?: ResourceReference[];
  public performer?: MedicationDispensePerformerComponent[];
  public location?: ResourceReference;
  public authorizingPrescription?: ResourceReference[];
  public type?: CodeableConcept;
  public quantity?: SimpleQuantity;
  public daysSupply?: SimpleQuantity;
  public whenPrepared?: Date;
  public whenHandedOver?: Date;
  public destination?: ResourceReference;
  public receiver?: ResourceReference[];
  public note?: Annotation[];
  public dosageInstruction?: Dosage[];
  public substitution?: MedicationDispenseSubstitutionComponent;
  public detectedIssue?: ResourceReference[];
  public statusReason?: Element;
  public eventHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('medication')) {
        this.medication = new Element(obj.medication);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('supportingInformation')) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new MedicationDispensePerformerComponent(o));
        }
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('authorizingPrescription')) {
        this.authorizingPrescription = [];
        for (const o of obj.authorizingPrescription || []) {
          this.authorizingPrescription.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('daysSupply')) {
        this.daysSupply = new SimpleQuantity(obj.daysSupply);
      }
      if (obj.hasOwnProperty('whenPrepared')) {
        this.whenPrepared = obj.whenPrepared;
      }
      if (obj.hasOwnProperty('whenHandedOver')) {
        this.whenHandedOver = obj.whenHandedOver;
      }
      if (obj.hasOwnProperty('destination')) {
        this.destination = new ResourceReference(obj.destination);
      }
      if (obj.hasOwnProperty('receiver')) {
        this.receiver = [];
        for (const o of obj.receiver || []) {
          this.receiver.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('dosageInstruction')) {
        this.dosageInstruction = [];
        for (const o of obj.dosageInstruction || []) {
          this.dosageInstruction.push(new Dosage(o));
        }
      }
      if (obj.hasOwnProperty('substitution')) {
        this.substitution = new MedicationDispenseSubstitutionComponent(obj.substitution);
      }
      if (obj.hasOwnProperty('detectedIssue')) {
        this.detectedIssue = [];
        for (const o of obj.detectedIssue || []) {
          this.detectedIssue.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = new Element(obj.statusReason);
      }
      if (obj.hasOwnProperty('eventHistory')) {
        this.eventHistory = [];
        for (const o of obj.eventHistory || []) {
          this.eventHistory.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class MedicationKnowledgeRelatedMedicationKnowledgeComponent extends BackboneElement {
  public type: CodeableConcept;
  public reference: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = [];
        for (const o of obj.reference || []) {
          this.reference.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class MedicationKnowledgeMonographComponent extends BackboneElement {
  public type?: CodeableConcept;
  public source?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new ResourceReference(obj.source);
      }
    }
  }

}

export class MedicationKnowledgeIngredientComponent extends BackboneElement {
  public item: Element;
  public isActive?: boolean;
  public strength?: Ratio;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('item')) {
        this.item = new Element(obj.item);
      }
      if (obj.hasOwnProperty('isActive')) {
        this.isActive = obj.isActive;
      }
      if (obj.hasOwnProperty('strength')) {
        this.strength = new Ratio(obj.strength);
      }
    }
  }

}

export class MedicationKnowledgeCostComponent extends BackboneElement {
  public type: CodeableConcept;
  public source?: string;
  public cost: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('source')) {
        this.source = obj.source;
      }
      if (obj.hasOwnProperty('cost')) {
        this.cost = new Money(obj.cost);
      }
    }
  }

}

export class MedicationKnowledgeMonitoringProgramComponent extends BackboneElement {
  public type?: CodeableConcept;
  public name?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
    }
  }

}

export class MedicationKnowledgeDosageComponent extends BackboneElement {
  public type: CodeableConcept;
  public dosage: Dosage[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('dosage')) {
        this.dosage = [];
        for (const o of obj.dosage || []) {
          this.dosage.push(new Dosage(o));
        }
      }
    }
  }

}

export class MedicationKnowledgePatientCharacteristicsComponent extends BackboneElement {
  public characteristic: Element;
  public value?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('characteristic')) {
        this.characteristic = new Element(obj.characteristic);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class MedicationKnowledgeAdministrationGuidelinesComponent extends BackboneElement {
  public dosage?: MedicationKnowledgeDosageComponent[];
  public indication?: Element;
  public patientCharacteristics?: MedicationKnowledgePatientCharacteristicsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('dosage')) {
        this.dosage = [];
        for (const o of obj.dosage || []) {
          this.dosage.push(new MedicationKnowledgeDosageComponent(o));
        }
      }
      if (obj.hasOwnProperty('indication')) {
        this.indication = new Element(obj.indication);
      }
      if (obj.hasOwnProperty('patientCharacteristics')) {
        this.patientCharacteristics = [];
        for (const o of obj.patientCharacteristics || []) {
          this.patientCharacteristics.push(new MedicationKnowledgePatientCharacteristicsComponent(o));
        }
      }
    }
  }

}

export class MedicationKnowledgeMedicineClassificationComponent extends BackboneElement {
  public type: CodeableConcept;
  public classification?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('classification')) {
        this.classification = [];
        for (const o of obj.classification || []) {
          this.classification.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class MedicationKnowledgePackagingComponent extends BackboneElement {
  public type?: CodeableConcept;
  public quantity?: SimpleQuantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
    }
  }

}

export class MedicationKnowledgeDrugCharacteristicComponent extends BackboneElement {
  public type?: CodeableConcept;
  public value?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class MedicationKnowledgeSubstitutionComponent extends BackboneElement {
  public type: CodeableConcept;
  public allowed: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('allowed')) {
        this.allowed = obj.allowed;
      }
    }
  }

}

export class MedicationKnowledgeScheduleComponent extends BackboneElement {
  public schedule: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('schedule')) {
        this.schedule = new CodeableConcept(obj.schedule);
      }
    }
  }

}

export class MedicationKnowledgeMaxDispenseComponent extends BackboneElement {
  public quantity: SimpleQuantity;
  public period?: Duration;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Duration(obj.period);
      }
    }
  }

}

export class MedicationKnowledgeRegulatoryComponent extends BackboneElement {
  public regulatoryAuthority: ResourceReference;
  public substitution?: MedicationKnowledgeSubstitutionComponent[];
  public schedule?: MedicationKnowledgeScheduleComponent[];
  public maxDispense?: MedicationKnowledgeMaxDispenseComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('regulatoryAuthority')) {
        this.regulatoryAuthority = new ResourceReference(obj.regulatoryAuthority);
      }
      if (obj.hasOwnProperty('substitution')) {
        this.substitution = [];
        for (const o of obj.substitution || []) {
          this.substitution.push(new MedicationKnowledgeSubstitutionComponent(o));
        }
      }
      if (obj.hasOwnProperty('schedule')) {
        this.schedule = [];
        for (const o of obj.schedule || []) {
          this.schedule.push(new MedicationKnowledgeScheduleComponent(o));
        }
      }
      if (obj.hasOwnProperty('maxDispense')) {
        this.maxDispense = new MedicationKnowledgeMaxDispenseComponent(obj.maxDispense);
      }
    }
  }

}

export class MedicationKnowledgeKineticsComponent extends BackboneElement {
  public areaUnderCurve?: SimpleQuantity[];
  public lethalDose50?: SimpleQuantity[];
  public halfLifePeriod?: Duration;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('areaUnderCurve')) {
        this.areaUnderCurve = [];
        for (const o of obj.areaUnderCurve || []) {
          this.areaUnderCurve.push(new SimpleQuantity(o));
        }
      }
      if (obj.hasOwnProperty('lethalDose50')) {
        this.lethalDose50 = [];
        for (const o of obj.lethalDose50 || []) {
          this.lethalDose50.push(new SimpleQuantity(o));
        }
      }
      if (obj.hasOwnProperty('halfLifePeriod')) {
        this.halfLifePeriod = new Duration(obj.halfLifePeriod);
      }
    }
  }

}

export class MedicationKnowledge extends DomainResource {
  public resourceType = 'MedicationKnowledge';
  public code?: CodeableConcept;
  public status?: string;
  public manufacturer?: ResourceReference;
  public doseForm?: CodeableConcept;
  public amount?: SimpleQuantity;
  public synonym?: string[];
  public relatedMedicationKnowledge?: MedicationKnowledgeRelatedMedicationKnowledgeComponent[];
  public associatedMedication?: ResourceReference[];
  public productType?: CodeableConcept[];
  public monograph?: MedicationKnowledgeMonographComponent[];
  public ingredient?: MedicationKnowledgeIngredientComponent[];
  public preparationInstruction?: string;
  public intendedRoute?: CodeableConcept[];
  public cost?: MedicationKnowledgeCostComponent[];
  public monitoringProgram?: MedicationKnowledgeMonitoringProgramComponent[];
  public administrationGuidelines?: MedicationKnowledgeAdministrationGuidelinesComponent[];
  public medicineClassification?: MedicationKnowledgeMedicineClassificationComponent[];
  public packaging?: MedicationKnowledgePackagingComponent;
  public drugCharacteristic?: MedicationKnowledgeDrugCharacteristicComponent[];
  public contraindication?: ResourceReference[];
  public regulatory?: MedicationKnowledgeRegulatoryComponent[];
  public kinetics?: MedicationKnowledgeKineticsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = new ResourceReference(obj.manufacturer);
      }
      if (obj.hasOwnProperty('doseForm')) {
        this.doseForm = new CodeableConcept(obj.doseForm);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new SimpleQuantity(obj.amount);
      }
      if (obj.hasOwnProperty('synonym')) {
        this.synonym = obj.synonym;
      }
      if (obj.hasOwnProperty('relatedMedicationKnowledge')) {
        this.relatedMedicationKnowledge = [];
        for (const o of obj.relatedMedicationKnowledge || []) {
          this.relatedMedicationKnowledge.push(new MedicationKnowledgeRelatedMedicationKnowledgeComponent(o));
        }
      }
      if (obj.hasOwnProperty('associatedMedication')) {
        this.associatedMedication = [];
        for (const o of obj.associatedMedication || []) {
          this.associatedMedication.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('productType')) {
        this.productType = [];
        for (const o of obj.productType || []) {
          this.productType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('monograph')) {
        this.monograph = [];
        for (const o of obj.monograph || []) {
          this.monograph.push(new MedicationKnowledgeMonographComponent(o));
        }
      }
      if (obj.hasOwnProperty('ingredient')) {
        this.ingredient = [];
        for (const o of obj.ingredient || []) {
          this.ingredient.push(new MedicationKnowledgeIngredientComponent(o));
        }
      }
      if (obj.hasOwnProperty('preparationInstruction')) {
        this.preparationInstruction = obj.preparationInstruction;
      }
      if (obj.hasOwnProperty('intendedRoute')) {
        this.intendedRoute = [];
        for (const o of obj.intendedRoute || []) {
          this.intendedRoute.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('cost')) {
        this.cost = [];
        for (const o of obj.cost || []) {
          this.cost.push(new MedicationKnowledgeCostComponent(o));
        }
      }
      if (obj.hasOwnProperty('monitoringProgram')) {
        this.monitoringProgram = [];
        for (const o of obj.monitoringProgram || []) {
          this.monitoringProgram.push(new MedicationKnowledgeMonitoringProgramComponent(o));
        }
      }
      if (obj.hasOwnProperty('administrationGuidelines')) {
        this.administrationGuidelines = [];
        for (const o of obj.administrationGuidelines || []) {
          this.administrationGuidelines.push(new MedicationKnowledgeAdministrationGuidelinesComponent(o));
        }
      }
      if (obj.hasOwnProperty('medicineClassification')) {
        this.medicineClassification = [];
        for (const o of obj.medicineClassification || []) {
          this.medicineClassification.push(new MedicationKnowledgeMedicineClassificationComponent(o));
        }
      }
      if (obj.hasOwnProperty('packaging')) {
        this.packaging = new MedicationKnowledgePackagingComponent(obj.packaging);
      }
      if (obj.hasOwnProperty('drugCharacteristic')) {
        this.drugCharacteristic = [];
        for (const o of obj.drugCharacteristic || []) {
          this.drugCharacteristic.push(new MedicationKnowledgeDrugCharacteristicComponent(o));
        }
      }
      if (obj.hasOwnProperty('contraindication')) {
        this.contraindication = [];
        for (const o of obj.contraindication || []) {
          this.contraindication.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('regulatory')) {
        this.regulatory = [];
        for (const o of obj.regulatory || []) {
          this.regulatory.push(new MedicationKnowledgeRegulatoryComponent(o));
        }
      }
      if (obj.hasOwnProperty('kinetics')) {
        this.kinetics = [];
        for (const o of obj.kinetics || []) {
          this.kinetics.push(new MedicationKnowledgeKineticsComponent(o));
        }
      }
    }
  }

}

export class MedicationRequestInitialFillComponent extends BackboneElement {
  public quantity?: SimpleQuantity;
  public duration?: Duration;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('duration')) {
        this.duration = new Duration(obj.duration);
      }
    }
  }

}

export class MedicationRequestDispenseRequestComponent extends BackboneElement {
  public initialFill?: MedicationRequestInitialFillComponent;
  public dispenseInterval?: Duration;
  public validityPeriod?: Period;
  public numberOfRepeatsAllowed?: number;
  public quantity?: SimpleQuantity;
  public expectedSupplyDuration?: Duration;
  public performer?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('initialFill')) {
        this.initialFill = new MedicationRequestInitialFillComponent(obj.initialFill);
      }
      if (obj.hasOwnProperty('dispenseInterval')) {
        this.dispenseInterval = new Duration(obj.dispenseInterval);
      }
      if (obj.hasOwnProperty('validityPeriod')) {
        this.validityPeriod = new Period(obj.validityPeriod);
      }
      if (obj.hasOwnProperty('numberOfRepeatsAllowed')) {
        this.numberOfRepeatsAllowed = obj.numberOfRepeatsAllowed;
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('expectedSupplyDuration')) {
        this.expectedSupplyDuration = new Duration(obj.expectedSupplyDuration);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = new ResourceReference(obj.performer);
      }
    }
  }

}

export class MedicationRequestSubstitutionComponent extends BackboneElement {
  public allowed: boolean;
  public reason?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('allowed')) {
        this.allowed = obj.allowed;
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = new CodeableConcept(obj.reason);
      }
    }
  }

}

export class MedicationRequest extends DomainResource {
  public resourceType = 'MedicationRequest';
  public identifier?: Identifier[];
  public status: string;
  public intent: string;
  public category?: CodeableConcept[];
  public priority?: string;
  public doNotPerform?: boolean;
  public medication: Element;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public supportingInformation?: ResourceReference[];
  public authoredOn?: Date;
  public requester?: ResourceReference;
  public performer?: ResourceReference;
  public performerType?: CodeableConcept;
  public recorder?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public instantiates?: string[];
  public basedOn?: ResourceReference[];
  public groupIdentifier?: Identifier;
  public statusReason?: CodeableConcept;
  public courseOfTherapyType?: CodeableConcept;
  public insurance?: ResourceReference[];
  public note?: Annotation[];
  public dosageInstruction?: Dosage[];
  public dispenseRequest?: MedicationRequestDispenseRequestComponent;
  public substitution?: MedicationRequestSubstitutionComponent;
  public priorPrescription?: ResourceReference;
  public detectedIssue?: ResourceReference[];
  public eventHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('intent')) {
        this.intent = obj.intent;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('doNotPerform')) {
        this.doNotPerform = obj.doNotPerform;
      }
      if (obj.hasOwnProperty('medication')) {
        this.medication = new Element(obj.medication);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('supportingInformation')) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('authoredOn')) {
        this.authoredOn = obj.authoredOn;
      }
      if (obj.hasOwnProperty('requester')) {
        this.requester = new ResourceReference(obj.requester);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.hasOwnProperty('performerType')) {
        this.performerType = new CodeableConcept(obj.performerType);
      }
      if (obj.hasOwnProperty('recorder')) {
        this.recorder = new ResourceReference(obj.recorder);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('instantiates')) {
        this.instantiates = obj.instantiates;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('groupIdentifier')) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = new CodeableConcept(obj.statusReason);
      }
      if (obj.hasOwnProperty('courseOfTherapyType')) {
        this.courseOfTherapyType = new CodeableConcept(obj.courseOfTherapyType);
      }
      if (obj.hasOwnProperty('insurance')) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('dosageInstruction')) {
        this.dosageInstruction = [];
        for (const o of obj.dosageInstruction || []) {
          this.dosageInstruction.push(new Dosage(o));
        }
      }
      if (obj.hasOwnProperty('dispenseRequest')) {
        this.dispenseRequest = new MedicationRequestDispenseRequestComponent(obj.dispenseRequest);
      }
      if (obj.hasOwnProperty('substitution')) {
        this.substitution = new MedicationRequestSubstitutionComponent(obj.substitution);
      }
      if (obj.hasOwnProperty('priorPrescription')) {
        this.priorPrescription = new ResourceReference(obj.priorPrescription);
      }
      if (obj.hasOwnProperty('detectedIssue')) {
        this.detectedIssue = [];
        for (const o of obj.detectedIssue || []) {
          this.detectedIssue.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('eventHistory')) {
        this.eventHistory = [];
        for (const o of obj.eventHistory || []) {
          this.eventHistory.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class MedicationStatement extends DomainResource {
  public resourceType = 'MedicationStatement';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status: string;
  public statusReason?: CodeableConcept[];
  public category?: CodeableConcept;
  public medication: Element;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public effective?: Element;
  public dateAsserted?: Date;
  public informationSource?: ResourceReference;
  public derivedFrom?: ResourceReference[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];
  public dosage?: Dosage[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = [];
        for (const o of obj.statusReason || []) {
          this.statusReason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('medication')) {
        this.medication = new Element(obj.medication);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('effective')) {
        this.effective = new Element(obj.effective);
      }
      if (obj.hasOwnProperty('dateAsserted')) {
        this.dateAsserted = obj.dateAsserted;
      }
      if (obj.hasOwnProperty('informationSource')) {
        this.informationSource = new ResourceReference(obj.informationSource);
      }
      if (obj.hasOwnProperty('derivedFrom')) {
        this.derivedFrom = [];
        for (const o of obj.derivedFrom || []) {
          this.derivedFrom.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('dosage')) {
        this.dosage = [];
        for (const o of obj.dosage || []) {
          this.dosage.push(new Dosage(o));
        }
      }
    }
  }

}

export class MedicinalProductNamePartComponent extends BackboneElement {
  public part: string;
  public type: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('part')) {
        this.part = obj.part;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new Coding(obj.type);
      }
    }
  }

}

export class MedicinalProductCountryLanguageComponent extends BackboneElement {
  public country: CodeableConcept;
  public jurisdiction?: CodeableConcept;
  public language: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('country')) {
        this.country = new CodeableConcept(obj.country);
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = new CodeableConcept(obj.jurisdiction);
      }
      if (obj.hasOwnProperty('language')) {
        this.language = new CodeableConcept(obj.language);
      }
    }
  }

}

export class MedicinalProductNameComponent extends BackboneElement {
  public productName: string;
  public namePart?: MedicinalProductNamePartComponent[];
  public countryLanguage?: MedicinalProductCountryLanguageComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('productName')) {
        this.productName = obj.productName;
      }
      if (obj.hasOwnProperty('namePart')) {
        this.namePart = [];
        for (const o of obj.namePart || []) {
          this.namePart.push(new MedicinalProductNamePartComponent(o));
        }
      }
      if (obj.hasOwnProperty('countryLanguage')) {
        this.countryLanguage = [];
        for (const o of obj.countryLanguage || []) {
          this.countryLanguage.push(new MedicinalProductCountryLanguageComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductManufacturingBusinessOperationComponent extends BackboneElement {
  public operationType?: CodeableConcept;
  public authorisationReferenceNumber?: Identifier;
  public effectiveDate?: Date;
  public confidentialityIndicator?: CodeableConcept;
  public manufacturer?: ResourceReference[];
  public regulator?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('operationType')) {
        this.operationType = new CodeableConcept(obj.operationType);
      }
      if (obj.hasOwnProperty('authorisationReferenceNumber')) {
        this.authorisationReferenceNumber = new Identifier(obj.authorisationReferenceNumber);
      }
      if (obj.hasOwnProperty('effectiveDate')) {
        this.effectiveDate = obj.effectiveDate;
      }
      if (obj.hasOwnProperty('confidentialityIndicator')) {
        this.confidentialityIndicator = new CodeableConcept(obj.confidentialityIndicator);
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = [];
        for (const o of obj.manufacturer || []) {
          this.manufacturer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('regulator')) {
        this.regulator = new ResourceReference(obj.regulator);
      }
    }
  }

}

export class MedicinalProductSpecialDesignationComponent extends BackboneElement {
  public identifier?: Identifier[];
  public intendedUse?: CodeableConcept;
  public indication?: CodeableConcept;
  public status?: CodeableConcept;
  public date?: Date;
  public species?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('intendedUse')) {
        this.intendedUse = new CodeableConcept(obj.intendedUse);
      }
      if (obj.hasOwnProperty('indication')) {
        this.indication = new CodeableConcept(obj.indication);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = new CodeableConcept(obj.status);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('species')) {
        this.species = new CodeableConcept(obj.species);
      }
    }
  }

}

export class MedicinalProduct extends DomainResource {
  public resourceType = 'MedicinalProduct';
  public identifier?: Identifier[];
  public type?: CodeableConcept;
  public domain?: Coding;
  public combinedPharmaceuticalDoseForm?: CodeableConcept;
  public additionalMonitoringIndicator?: CodeableConcept;
  public specialMeasures?: string[];
  public paediatricUseIndicator?: CodeableConcept;
  public productClassification?: CodeableConcept[];
  public marketingStatus?: MarketingStatus[];
  public marketingAuthorization?: ResourceReference;
  public packagedMedicinalProduct?: ResourceReference[];
  public pharmaceuticalProduct?: ResourceReference[];
  public contraindication?: ResourceReference[];
  public interaction?: ResourceReference[];
  public therapeuticIndication?: ResourceReference[];
  public undesirableEffect?: ResourceReference[];
  public attachedDocument?: ResourceReference[];
  public masterFile?: ResourceReference[];
  public contact?: ResourceReference[];
  public clinicalTrial?: ResourceReference[];
  public name: MedicinalProductNameComponent[];
  public crossReference?: Identifier[];
  public manufacturingBusinessOperation?: MedicinalProductManufacturingBusinessOperationComponent[];
  public specialDesignation?: MedicinalProductSpecialDesignationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('domain')) {
        this.domain = new Coding(obj.domain);
      }
      if (obj.hasOwnProperty('combinedPharmaceuticalDoseForm')) {
        this.combinedPharmaceuticalDoseForm = new CodeableConcept(obj.combinedPharmaceuticalDoseForm);
      }
      if (obj.hasOwnProperty('additionalMonitoringIndicator')) {
        this.additionalMonitoringIndicator = new CodeableConcept(obj.additionalMonitoringIndicator);
      }
      if (obj.hasOwnProperty('specialMeasures')) {
        this.specialMeasures = obj.specialMeasures;
      }
      if (obj.hasOwnProperty('paediatricUseIndicator')) {
        this.paediatricUseIndicator = new CodeableConcept(obj.paediatricUseIndicator);
      }
      if (obj.hasOwnProperty('productClassification')) {
        this.productClassification = [];
        for (const o of obj.productClassification || []) {
          this.productClassification.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('marketingStatus')) {
        this.marketingStatus = [];
        for (const o of obj.marketingStatus || []) {
          this.marketingStatus.push(new MarketingStatus(o));
        }
      }
      if (obj.hasOwnProperty('marketingAuthorization')) {
        this.marketingAuthorization = new ResourceReference(obj.marketingAuthorization);
      }
      if (obj.hasOwnProperty('packagedMedicinalProduct')) {
        this.packagedMedicinalProduct = [];
        for (const o of obj.packagedMedicinalProduct || []) {
          this.packagedMedicinalProduct.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('pharmaceuticalProduct')) {
        this.pharmaceuticalProduct = [];
        for (const o of obj.pharmaceuticalProduct || []) {
          this.pharmaceuticalProduct.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('contraindication')) {
        this.contraindication = [];
        for (const o of obj.contraindication || []) {
          this.contraindication.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('interaction')) {
        this.interaction = [];
        for (const o of obj.interaction || []) {
          this.interaction.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('therapeuticIndication')) {
        this.therapeuticIndication = [];
        for (const o of obj.therapeuticIndication || []) {
          this.therapeuticIndication.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('undesirableEffect')) {
        this.undesirableEffect = [];
        for (const o of obj.undesirableEffect || []) {
          this.undesirableEffect.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('attachedDocument')) {
        this.attachedDocument = [];
        for (const o of obj.attachedDocument || []) {
          this.attachedDocument.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('masterFile')) {
        this.masterFile = [];
        for (const o of obj.masterFile || []) {
          this.masterFile.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('clinicalTrial')) {
        this.clinicalTrial = [];
        for (const o of obj.clinicalTrial || []) {
          this.clinicalTrial.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = [];
        for (const o of obj.name || []) {
          this.name.push(new MedicinalProductNameComponent(o));
        }
      }
      if (obj.hasOwnProperty('crossReference')) {
        this.crossReference = [];
        for (const o of obj.crossReference || []) {
          this.crossReference.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('manufacturingBusinessOperation')) {
        this.manufacturingBusinessOperation = [];
        for (const o of obj.manufacturingBusinessOperation || []) {
          this.manufacturingBusinessOperation.push(new MedicinalProductManufacturingBusinessOperationComponent(o));
        }
      }
      if (obj.hasOwnProperty('specialDesignation')) {
        this.specialDesignation = [];
        for (const o of obj.specialDesignation || []) {
          this.specialDesignation.push(new MedicinalProductSpecialDesignationComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductAuthorizationJurisdictionalAuthorizationComponent extends BackboneElement {
  public identifier?: Identifier[];
  public country?: CodeableConcept;
  public jurisdiction?: CodeableConcept[];
  public legalStatusOfSupply?: CodeableConcept;
  public validityPeriod?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('country')) {
        this.country = new CodeableConcept(obj.country);
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('legalStatusOfSupply')) {
        this.legalStatusOfSupply = new CodeableConcept(obj.legalStatusOfSupply);
      }
      if (obj.hasOwnProperty('validityPeriod')) {
        this.validityPeriod = new Period(obj.validityPeriod);
      }
    }
  }

}

export class MedicinalProductAuthorizationProcedureComponent extends BackboneElement {
  public identifier?: Identifier;
  public type: CodeableConcept;
  public date?: Element;
  public application?: MedicinalProductAuthorizationProcedureComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = new Element(obj.date);
      }
      if (obj.hasOwnProperty('application')) {
        this.application = [];
        for (const o of obj.application || []) {
          this.application.push(new MedicinalProductAuthorizationProcedureComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductAuthorization extends DomainResource {
  public resourceType = 'MedicinalProductAuthorization';
  public identifier?: Identifier[];
  public subject?: ResourceReference;
  public country?: CodeableConcept[];
  public jurisdiction?: CodeableConcept[];
  public legalStatusOfSupply?: CodeableConcept;
  public status?: CodeableConcept;
  public statusDate?: Date;
  public restoreDate?: Date;
  public validityPeriod?: Period;
  public dataExclusivityPeriod?: Period;
  public dateOfFirstAuthorization?: Date;
  public internationalBirthDate?: Date;
  public legalBasis?: CodeableConcept;
  public jurisdictionalAuthorization?: MedicinalProductAuthorizationJurisdictionalAuthorizationComponent[];
  public holder?: ResourceReference;
  public regulator?: ResourceReference;
  public procedure?: MedicinalProductAuthorizationProcedureComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('country')) {
        this.country = [];
        for (const o of obj.country || []) {
          this.country.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('legalStatusOfSupply')) {
        this.legalStatusOfSupply = new CodeableConcept(obj.legalStatusOfSupply);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = new CodeableConcept(obj.status);
      }
      if (obj.hasOwnProperty('statusDate')) {
        this.statusDate = obj.statusDate;
      }
      if (obj.hasOwnProperty('restoreDate')) {
        this.restoreDate = obj.restoreDate;
      }
      if (obj.hasOwnProperty('validityPeriod')) {
        this.validityPeriod = new Period(obj.validityPeriod);
      }
      if (obj.hasOwnProperty('dataExclusivityPeriod')) {
        this.dataExclusivityPeriod = new Period(obj.dataExclusivityPeriod);
      }
      if (obj.hasOwnProperty('dateOfFirstAuthorization')) {
        this.dateOfFirstAuthorization = obj.dateOfFirstAuthorization;
      }
      if (obj.hasOwnProperty('internationalBirthDate')) {
        this.internationalBirthDate = obj.internationalBirthDate;
      }
      if (obj.hasOwnProperty('legalBasis')) {
        this.legalBasis = new CodeableConcept(obj.legalBasis);
      }
      if (obj.hasOwnProperty('jurisdictionalAuthorization')) {
        this.jurisdictionalAuthorization = [];
        for (const o of obj.jurisdictionalAuthorization || []) {
          this.jurisdictionalAuthorization.push(new MedicinalProductAuthorizationJurisdictionalAuthorizationComponent(o));
        }
      }
      if (obj.hasOwnProperty('holder')) {
        this.holder = new ResourceReference(obj.holder);
      }
      if (obj.hasOwnProperty('regulator')) {
        this.regulator = new ResourceReference(obj.regulator);
      }
      if (obj.hasOwnProperty('procedure')) {
        this.procedure = new MedicinalProductAuthorizationProcedureComponent(obj.procedure);
      }
    }
  }

}

export class MedicinalProductClinicalsPopulationComponent extends BackboneElement {
  public age?: Element;
  public gender?: CodeableConcept;
  public race?: CodeableConcept;
  public physiologicalCondition?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('age')) {
        this.age = new Element(obj.age);
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = new CodeableConcept(obj.gender);
      }
      if (obj.hasOwnProperty('race')) {
        this.race = new CodeableConcept(obj.race);
      }
      if (obj.hasOwnProperty('physiologicalCondition')) {
        this.physiologicalCondition = new CodeableConcept(obj.physiologicalCondition);
      }
    }
  }

}

export class MedicinalProductClinicalsUndesirableEffectsComponent extends BackboneElement {
  public symptomConditionEffect?: CodeableConcept;
  public classification?: CodeableConcept;
  public frequencyOfOccurrence?: CodeableConcept;
  public population?: MedicinalProductClinicalsPopulationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('symptomConditionEffect')) {
        this.symptomConditionEffect = new CodeableConcept(obj.symptomConditionEffect);
      }
      if (obj.hasOwnProperty('classification')) {
        this.classification = new CodeableConcept(obj.classification);
      }
      if (obj.hasOwnProperty('frequencyOfOccurrence')) {
        this.frequencyOfOccurrence = new CodeableConcept(obj.frequencyOfOccurrence);
      }
      if (obj.hasOwnProperty('population')) {
        this.population = [];
        for (const o of obj.population || []) {
          this.population.push(new MedicinalProductClinicalsPopulationComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductClinicalsOtherTherapyComponent extends BackboneElement {
  public therapyRelationshipType: CodeableConcept;
  public medication: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('therapyRelationshipType')) {
        this.therapyRelationshipType = new CodeableConcept(obj.therapyRelationshipType);
      }
      if (obj.hasOwnProperty('medication')) {
        this.medication = new Element(obj.medication);
      }
    }
  }

}

export class MedicinalProductClinicalsTherapeuticIndicationComponent extends BackboneElement {
  public diseaseSymptomProcedure?: CodeableConcept;
  public diseaseStatus?: CodeableConcept;
  public comorbidity?: CodeableConcept[];
  public intendedEffect?: CodeableConcept;
  public duration?: Quantity;
  public undesirableEffects?: MedicinalProductClinicalsUndesirableEffectsComponent[];
  public otherTherapy?: MedicinalProductClinicalsOtherTherapyComponent[];
  public population?: MedicinalProductClinicalsPopulationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('diseaseSymptomProcedure')) {
        this.diseaseSymptomProcedure = new CodeableConcept(obj.diseaseSymptomProcedure);
      }
      if (obj.hasOwnProperty('diseaseStatus')) {
        this.diseaseStatus = new CodeableConcept(obj.diseaseStatus);
      }
      if (obj.hasOwnProperty('comorbidity')) {
        this.comorbidity = [];
        for (const o of obj.comorbidity || []) {
          this.comorbidity.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('intendedEffect')) {
        this.intendedEffect = new CodeableConcept(obj.intendedEffect);
      }
      if (obj.hasOwnProperty('duration')) {
        this.duration = new Quantity(obj.duration);
      }
      if (obj.hasOwnProperty('undesirableEffects')) {
        this.undesirableEffects = [];
        for (const o of obj.undesirableEffects || []) {
          this.undesirableEffects.push(new MedicinalProductClinicalsUndesirableEffectsComponent(o));
        }
      }
      if (obj.hasOwnProperty('otherTherapy')) {
        this.otherTherapy = [];
        for (const o of obj.otherTherapy || []) {
          this.otherTherapy.push(new MedicinalProductClinicalsOtherTherapyComponent(o));
        }
      }
      if (obj.hasOwnProperty('population')) {
        this.population = [];
        for (const o of obj.population || []) {
          this.population.push(new MedicinalProductClinicalsPopulationComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductClinicalsContraindicationComponent extends BackboneElement {
  public disease?: CodeableConcept;
  public diseaseStatus?: CodeableConcept;
  public comorbidity?: CodeableConcept[];
  public therapeuticIndication?: MedicinalProductClinicalsTherapeuticIndicationComponent[];
  public otherTherapy?: MedicinalProductClinicalsOtherTherapyComponent[];
  public population?: MedicinalProductClinicalsPopulationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('disease')) {
        this.disease = new CodeableConcept(obj.disease);
      }
      if (obj.hasOwnProperty('diseaseStatus')) {
        this.diseaseStatus = new CodeableConcept(obj.diseaseStatus);
      }
      if (obj.hasOwnProperty('comorbidity')) {
        this.comorbidity = [];
        for (const o of obj.comorbidity || []) {
          this.comorbidity.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('therapeuticIndication')) {
        this.therapeuticIndication = [];
        for (const o of obj.therapeuticIndication || []) {
          this.therapeuticIndication.push(new MedicinalProductClinicalsTherapeuticIndicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('otherTherapy')) {
        this.otherTherapy = [];
        for (const o of obj.otherTherapy || []) {
          this.otherTherapy.push(new MedicinalProductClinicalsOtherTherapyComponent(o));
        }
      }
      if (obj.hasOwnProperty('population')) {
        this.population = [];
        for (const o of obj.population || []) {
          this.population.push(new MedicinalProductClinicalsPopulationComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductClinicalsInteractionsComponent extends BackboneElement {
  public interaction?: string;
  public interactant?: CodeableConcept[];
  public type?: CodeableConcept;
  public effect?: CodeableConcept;
  public incidence?: CodeableConcept;
  public management?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('interaction')) {
        this.interaction = obj.interaction;
      }
      if (obj.hasOwnProperty('interactant')) {
        this.interactant = [];
        for (const o of obj.interactant || []) {
          this.interactant.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('effect')) {
        this.effect = new CodeableConcept(obj.effect);
      }
      if (obj.hasOwnProperty('incidence')) {
        this.incidence = new CodeableConcept(obj.incidence);
      }
      if (obj.hasOwnProperty('management')) {
        this.management = new CodeableConcept(obj.management);
      }
    }
  }

}

export class MedicinalProductClinicals extends DomainResource {
  public resourceType = 'MedicinalProductClinicals';
  public undesirableEffects?: MedicinalProductClinicalsUndesirableEffectsComponent[];
  public therapeuticIndication: MedicinalProductClinicalsTherapeuticIndicationComponent[];
  public contraindication?: MedicinalProductClinicalsContraindicationComponent[];
  public interactions?: MedicinalProductClinicalsInteractionsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('undesirableEffects')) {
        this.undesirableEffects = [];
        for (const o of obj.undesirableEffects || []) {
          this.undesirableEffects.push(new MedicinalProductClinicalsUndesirableEffectsComponent(o));
        }
      }
      if (obj.hasOwnProperty('therapeuticIndication')) {
        this.therapeuticIndication = [];
        for (const o of obj.therapeuticIndication || []) {
          this.therapeuticIndication.push(new MedicinalProductClinicalsTherapeuticIndicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('contraindication')) {
        this.contraindication = [];
        for (const o of obj.contraindication || []) {
          this.contraindication.push(new MedicinalProductClinicalsContraindicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('interactions')) {
        this.interactions = [];
        for (const o of obj.interactions || []) {
          this.interactions.push(new MedicinalProductClinicalsInteractionsComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductContraindicationOtherTherapyComponent extends BackboneElement {
  public therapyRelationshipType: CodeableConcept;
  public medication: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('therapyRelationshipType')) {
        this.therapyRelationshipType = new CodeableConcept(obj.therapyRelationshipType);
      }
      if (obj.hasOwnProperty('medication')) {
        this.medication = new Element(obj.medication);
      }
    }
  }

}

export class MedicinalProductContraindicationPopulationComponent extends BackboneElement {
  public age?: Element;
  public gender?: CodeableConcept;
  public race?: CodeableConcept;
  public physiologicalCondition?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('age')) {
        this.age = new Element(obj.age);
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = new CodeableConcept(obj.gender);
      }
      if (obj.hasOwnProperty('race')) {
        this.race = new CodeableConcept(obj.race);
      }
      if (obj.hasOwnProperty('physiologicalCondition')) {
        this.physiologicalCondition = new CodeableConcept(obj.physiologicalCondition);
      }
    }
  }

}

export class MedicinalProductContraindication extends DomainResource {
  public resourceType = 'MedicinalProductContraindication';
  public subject?: ResourceReference[];
  public disease?: CodeableConcept;
  public diseaseStatus?: CodeableConcept;
  public comorbidity?: CodeableConcept[];
  public therapeuticIndication?: ResourceReference[];
  public otherTherapy?: MedicinalProductContraindicationOtherTherapyComponent[];
  public population?: MedicinalProductContraindicationPopulationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('subject')) {
        this.subject = [];
        for (const o of obj.subject || []) {
          this.subject.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('disease')) {
        this.disease = new CodeableConcept(obj.disease);
      }
      if (obj.hasOwnProperty('diseaseStatus')) {
        this.diseaseStatus = new CodeableConcept(obj.diseaseStatus);
      }
      if (obj.hasOwnProperty('comorbidity')) {
        this.comorbidity = [];
        for (const o of obj.comorbidity || []) {
          this.comorbidity.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('therapeuticIndication')) {
        this.therapeuticIndication = [];
        for (const o of obj.therapeuticIndication || []) {
          this.therapeuticIndication.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('otherTherapy')) {
        this.otherTherapy = [];
        for (const o of obj.otherTherapy || []) {
          this.otherTherapy.push(new MedicinalProductContraindicationOtherTherapyComponent(o));
        }
      }
      if (obj.hasOwnProperty('population')) {
        this.population = [];
        for (const o of obj.population || []) {
          this.population.push(new MedicinalProductContraindicationPopulationComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductDeviceSpecMaterialComponent extends BackboneElement {
  public substance: CodeableConcept;
  public alternate?: boolean;
  public allergenicIndicator?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('substance')) {
        this.substance = new CodeableConcept(obj.substance);
      }
      if (obj.hasOwnProperty('alternate')) {
        this.alternate = obj.alternate;
      }
      if (obj.hasOwnProperty('allergenicIndicator')) {
        this.allergenicIndicator = obj.allergenicIndicator;
      }
    }
  }

}

export class MedicinalProductDeviceSpec extends DomainResource {
  public resourceType = 'MedicinalProductDeviceSpec';
  public identifier?: Identifier;
  public type: CodeableConcept;
  public tradeName?: string;
  public quantity?: Quantity;
  public listingNumber?: string;
  public modelNumber?: string;
  public sterilityIndicator?: CodeableConcept;
  public sterilisationRequirement?: CodeableConcept;
  public usage?: CodeableConcept;
  public nomenclature?: CodeableConcept[];
  public shelfLifeStorage?: ProductShelfLife[];
  public physicalCharacteristics?: ProdCharacteristic;
  public otherCharacteristics?: CodeableConcept[];
  public batchIdentifier?: Identifier[];
  public manufacturer?: ResourceReference[];
  public material?: MedicinalProductDeviceSpecMaterialComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('tradeName')) {
        this.tradeName = obj.tradeName;
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.hasOwnProperty('listingNumber')) {
        this.listingNumber = obj.listingNumber;
      }
      if (obj.hasOwnProperty('modelNumber')) {
        this.modelNumber = obj.modelNumber;
      }
      if (obj.hasOwnProperty('sterilityIndicator')) {
        this.sterilityIndicator = new CodeableConcept(obj.sterilityIndicator);
      }
      if (obj.hasOwnProperty('sterilisationRequirement')) {
        this.sterilisationRequirement = new CodeableConcept(obj.sterilisationRequirement);
      }
      if (obj.hasOwnProperty('usage')) {
        this.usage = new CodeableConcept(obj.usage);
      }
      if (obj.hasOwnProperty('nomenclature')) {
        this.nomenclature = [];
        for (const o of obj.nomenclature || []) {
          this.nomenclature.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('shelfLifeStorage')) {
        this.shelfLifeStorage = [];
        for (const o of obj.shelfLifeStorage || []) {
          this.shelfLifeStorage.push(new ProductShelfLife(o));
        }
      }
      if (obj.hasOwnProperty('physicalCharacteristics')) {
        this.physicalCharacteristics = new ProdCharacteristic(obj.physicalCharacteristics);
      }
      if (obj.hasOwnProperty('otherCharacteristics')) {
        this.otherCharacteristics = [];
        for (const o of obj.otherCharacteristics || []) {
          this.otherCharacteristics.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('batchIdentifier')) {
        this.batchIdentifier = [];
        for (const o of obj.batchIdentifier || []) {
          this.batchIdentifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = [];
        for (const o of obj.manufacturer || []) {
          this.manufacturer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('material')) {
        this.material = [];
        for (const o of obj.material || []) {
          this.material.push(new MedicinalProductDeviceSpecMaterialComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductIndicationOtherTherapyComponent extends BackboneElement {
  public therapyRelationshipType: CodeableConcept;
  public medication: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('therapyRelationshipType')) {
        this.therapyRelationshipType = new CodeableConcept(obj.therapyRelationshipType);
      }
      if (obj.hasOwnProperty('medication')) {
        this.medication = new Element(obj.medication);
      }
    }
  }

}

export class MedicinalProductIndicationPopulationComponent extends BackboneElement {
  public age?: Element;
  public gender?: CodeableConcept;
  public race?: CodeableConcept;
  public physiologicalCondition?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('age')) {
        this.age = new Element(obj.age);
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = new CodeableConcept(obj.gender);
      }
      if (obj.hasOwnProperty('race')) {
        this.race = new CodeableConcept(obj.race);
      }
      if (obj.hasOwnProperty('physiologicalCondition')) {
        this.physiologicalCondition = new CodeableConcept(obj.physiologicalCondition);
      }
    }
  }

}

export class MedicinalProductIndication extends DomainResource {
  public resourceType = 'MedicinalProductIndication';
  public subject?: ResourceReference[];
  public diseaseSymptomProcedure?: CodeableConcept;
  public diseaseStatus?: CodeableConcept;
  public comorbidity?: CodeableConcept[];
  public intendedEffect?: CodeableConcept;
  public duration?: Quantity;
  public otherTherapy?: MedicinalProductIndicationOtherTherapyComponent[];
  public undesirableEffect?: ResourceReference[];
  public population?: MedicinalProductIndicationPopulationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('subject')) {
        this.subject = [];
        for (const o of obj.subject || []) {
          this.subject.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('diseaseSymptomProcedure')) {
        this.diseaseSymptomProcedure = new CodeableConcept(obj.diseaseSymptomProcedure);
      }
      if (obj.hasOwnProperty('diseaseStatus')) {
        this.diseaseStatus = new CodeableConcept(obj.diseaseStatus);
      }
      if (obj.hasOwnProperty('comorbidity')) {
        this.comorbidity = [];
        for (const o of obj.comorbidity || []) {
          this.comorbidity.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('intendedEffect')) {
        this.intendedEffect = new CodeableConcept(obj.intendedEffect);
      }
      if (obj.hasOwnProperty('duration')) {
        this.duration = new Quantity(obj.duration);
      }
      if (obj.hasOwnProperty('otherTherapy')) {
        this.otherTherapy = [];
        for (const o of obj.otherTherapy || []) {
          this.otherTherapy.push(new MedicinalProductIndicationOtherTherapyComponent(o));
        }
      }
      if (obj.hasOwnProperty('undesirableEffect')) {
        this.undesirableEffect = [];
        for (const o of obj.undesirableEffect || []) {
          this.undesirableEffect.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('population')) {
        this.population = [];
        for (const o of obj.population || []) {
          this.population.push(new MedicinalProductIndicationPopulationComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductIngredientReferenceStrengthComponent extends BackboneElement {
  public substance?: CodeableConcept;
  public strength: Ratio;
  public measurementPoint?: string;
  public country?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('substance')) {
        this.substance = new CodeableConcept(obj.substance);
      }
      if (obj.hasOwnProperty('strength')) {
        this.strength = new Ratio(obj.strength);
      }
      if (obj.hasOwnProperty('measurementPoint')) {
        this.measurementPoint = obj.measurementPoint;
      }
      if (obj.hasOwnProperty('country')) {
        this.country = [];
        for (const o of obj.country || []) {
          this.country.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class MedicinalProductIngredientStrengthComponent extends BackboneElement {
  public presentation: Ratio;
  public presentationLowLimit?: Ratio;
  public concentration?: Ratio;
  public concentrationLowLimit?: Ratio;
  public measurementPoint?: string;
  public country?: CodeableConcept[];
  public referenceStrength?: MedicinalProductIngredientReferenceStrengthComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('presentation')) {
        this.presentation = new Ratio(obj.presentation);
      }
      if (obj.hasOwnProperty('presentationLowLimit')) {
        this.presentationLowLimit = new Ratio(obj.presentationLowLimit);
      }
      if (obj.hasOwnProperty('concentration')) {
        this.concentration = new Ratio(obj.concentration);
      }
      if (obj.hasOwnProperty('concentrationLowLimit')) {
        this.concentrationLowLimit = new Ratio(obj.concentrationLowLimit);
      }
      if (obj.hasOwnProperty('measurementPoint')) {
        this.measurementPoint = obj.measurementPoint;
      }
      if (obj.hasOwnProperty('country')) {
        this.country = [];
        for (const o of obj.country || []) {
          this.country.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('referenceStrength')) {
        this.referenceStrength = [];
        for (const o of obj.referenceStrength || []) {
          this.referenceStrength.push(new MedicinalProductIngredientReferenceStrengthComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductIngredientSpecifiedSubstanceComponent extends BackboneElement {
  public code: CodeableConcept;
  public group: CodeableConcept;
  public confidentiality?: CodeableConcept;
  public strength?: MedicinalProductIngredientStrengthComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('group')) {
        this.group = new CodeableConcept(obj.group);
      }
      if (obj.hasOwnProperty('confidentiality')) {
        this.confidentiality = new CodeableConcept(obj.confidentiality);
      }
      if (obj.hasOwnProperty('strength')) {
        this.strength = [];
        for (const o of obj.strength || []) {
          this.strength.push(new MedicinalProductIngredientStrengthComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductIngredientSubstanceComponent extends BackboneElement {
  public code: CodeableConcept;
  public strength?: MedicinalProductIngredientStrengthComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('strength')) {
        this.strength = [];
        for (const o of obj.strength || []) {
          this.strength.push(new MedicinalProductIngredientStrengthComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductIngredient extends DomainResource {
  public resourceType = 'MedicinalProductIngredient';
  public identifier?: Identifier;
  public role: CodeableConcept;
  public allergenicIndicator?: boolean;
  public manufacturer?: ResourceReference[];
  public specifiedSubstance?: MedicinalProductIngredientSpecifiedSubstanceComponent[];
  public substance?: MedicinalProductIngredientSubstanceComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.hasOwnProperty('allergenicIndicator')) {
        this.allergenicIndicator = obj.allergenicIndicator;
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = [];
        for (const o of obj.manufacturer || []) {
          this.manufacturer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('specifiedSubstance')) {
        this.specifiedSubstance = [];
        for (const o of obj.specifiedSubstance || []) {
          this.specifiedSubstance.push(new MedicinalProductIngredientSpecifiedSubstanceComponent(o));
        }
      }
      if (obj.hasOwnProperty('substance')) {
        this.substance = new MedicinalProductIngredientSubstanceComponent(obj.substance);
      }
    }
  }

}

export class MedicinalProductInteraction extends DomainResource {
  public resourceType = 'MedicinalProductInteraction';
  public subject?: ResourceReference[];
  public interaction?: string;
  public interactant?: CodeableConcept[];
  public type?: CodeableConcept;
  public effect?: CodeableConcept;
  public incidence?: CodeableConcept;
  public management?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('subject')) {
        this.subject = [];
        for (const o of obj.subject || []) {
          this.subject.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('interaction')) {
        this.interaction = obj.interaction;
      }
      if (obj.hasOwnProperty('interactant')) {
        this.interactant = [];
        for (const o of obj.interactant || []) {
          this.interactant.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('effect')) {
        this.effect = new CodeableConcept(obj.effect);
      }
      if (obj.hasOwnProperty('incidence')) {
        this.incidence = new CodeableConcept(obj.incidence);
      }
      if (obj.hasOwnProperty('management')) {
        this.management = new CodeableConcept(obj.management);
      }
    }
  }

}

export class MedicinalProductManufactured extends DomainResource {
  public resourceType = 'MedicinalProductManufactured';
  public manufacturedDoseForm: CodeableConcept;
  public unitOfPresentation?: CodeableConcept;
  public quantity: Quantity;
  public manufacturer?: ResourceReference[];
  public ingredient?: ResourceReference[];
  public physicalCharacteristics?: ProdCharacteristic;
  public otherCharacteristics?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('manufacturedDoseForm')) {
        this.manufacturedDoseForm = new CodeableConcept(obj.manufacturedDoseForm);
      }
      if (obj.hasOwnProperty('unitOfPresentation')) {
        this.unitOfPresentation = new CodeableConcept(obj.unitOfPresentation);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = [];
        for (const o of obj.manufacturer || []) {
          this.manufacturer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('ingredient')) {
        this.ingredient = [];
        for (const o of obj.ingredient || []) {
          this.ingredient.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('physicalCharacteristics')) {
        this.physicalCharacteristics = new ProdCharacteristic(obj.physicalCharacteristics);
      }
      if (obj.hasOwnProperty('otherCharacteristics')) {
        this.otherCharacteristics = [];
        for (const o of obj.otherCharacteristics || []) {
          this.otherCharacteristics.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class MedicinalProductPackagedBatchIdentifierComponent extends BackboneElement {
  public outerPackaging: Identifier;
  public immediatePackaging?: Identifier;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('outerPackaging')) {
        this.outerPackaging = new Identifier(obj.outerPackaging);
      }
      if (obj.hasOwnProperty('immediatePackaging')) {
        this.immediatePackaging = new Identifier(obj.immediatePackaging);
      }
    }
  }

}

export class MedicinalProductPackagedPackageItemComponent extends BackboneElement {
  public identifier?: Identifier[];
  public type: CodeableConcept;
  public quantity: Quantity;
  public material?: CodeableConcept[];
  public alternateMaterial?: CodeableConcept[];
  public device?: ResourceReference[];
  public manufacturedItem?: ResourceReference[];
  public packageItem?: MedicinalProductPackagedPackageItemComponent[];
  public physicalCharacteristics?: ProdCharacteristic;
  public otherCharacteristics?: CodeableConcept[];
  public shelfLifeStorage?: ProductShelfLife[];
  public manufacturer?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.hasOwnProperty('material')) {
        this.material = [];
        for (const o of obj.material || []) {
          this.material.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('alternateMaterial')) {
        this.alternateMaterial = [];
        for (const o of obj.alternateMaterial || []) {
          this.alternateMaterial.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('device')) {
        this.device = [];
        for (const o of obj.device || []) {
          this.device.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('manufacturedItem')) {
        this.manufacturedItem = [];
        for (const o of obj.manufacturedItem || []) {
          this.manufacturedItem.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('packageItem')) {
        this.packageItem = [];
        for (const o of obj.packageItem || []) {
          this.packageItem.push(new MedicinalProductPackagedPackageItemComponent(o));
        }
      }
      if (obj.hasOwnProperty('physicalCharacteristics')) {
        this.physicalCharacteristics = new ProdCharacteristic(obj.physicalCharacteristics);
      }
      if (obj.hasOwnProperty('otherCharacteristics')) {
        this.otherCharacteristics = [];
        for (const o of obj.otherCharacteristics || []) {
          this.otherCharacteristics.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('shelfLifeStorage')) {
        this.shelfLifeStorage = [];
        for (const o of obj.shelfLifeStorage || []) {
          this.shelfLifeStorage.push(new ProductShelfLife(o));
        }
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = [];
        for (const o of obj.manufacturer || []) {
          this.manufacturer.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class MedicinalProductPackaged extends DomainResource {
  public resourceType = 'MedicinalProductPackaged';
  public identifier: Identifier;
  public description?: string;
  public marketingStatus?: MarketingStatus[];
  public marketingAuthorization?: ResourceReference;
  public manufacturer?: ResourceReference[];
  public batchIdentifier?: MedicinalProductPackagedBatchIdentifierComponent[];
  public packageItem: MedicinalProductPackagedPackageItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('marketingStatus')) {
        this.marketingStatus = [];
        for (const o of obj.marketingStatus || []) {
          this.marketingStatus.push(new MarketingStatus(o));
        }
      }
      if (obj.hasOwnProperty('marketingAuthorization')) {
        this.marketingAuthorization = new ResourceReference(obj.marketingAuthorization);
      }
      if (obj.hasOwnProperty('manufacturer')) {
        this.manufacturer = [];
        for (const o of obj.manufacturer || []) {
          this.manufacturer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('batchIdentifier')) {
        this.batchIdentifier = [];
        for (const o of obj.batchIdentifier || []) {
          this.batchIdentifier.push(new MedicinalProductPackagedBatchIdentifierComponent(o));
        }
      }
      if (obj.hasOwnProperty('packageItem')) {
        this.packageItem = [];
        for (const o of obj.packageItem || []) {
          this.packageItem.push(new MedicinalProductPackagedPackageItemComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductPharmaceuticalCharacteristicsComponent extends BackboneElement {
  public code: CodeableConcept;
  public status?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = new CodeableConcept(obj.status);
      }
    }
  }

}

export class MedicinalProductPharmaceuticalWithdrawalPeriodComponent extends BackboneElement {
  public tissue: CodeableConcept;
  public value: Quantity;
  public supportingInformation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('tissue')) {
        this.tissue = new CodeableConcept(obj.tissue);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Quantity(obj.value);
      }
      if (obj.hasOwnProperty('supportingInformation')) {
        this.supportingInformation = obj.supportingInformation;
      }
    }
  }

}

export class MedicinalProductPharmaceuticalTargetSpeciesComponent extends BackboneElement {
  public code: CodeableConcept;
  public withdrawalPeriod?: MedicinalProductPharmaceuticalWithdrawalPeriodComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('withdrawalPeriod')) {
        this.withdrawalPeriod = [];
        for (const o of obj.withdrawalPeriod || []) {
          this.withdrawalPeriod.push(new MedicinalProductPharmaceuticalWithdrawalPeriodComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductPharmaceuticalRouteOfAdministrationComponent extends BackboneElement {
  public code: CodeableConcept;
  public firstDose?: Quantity;
  public maxSingleDose?: Quantity;
  public maxDosePerDay?: Quantity;
  public maxDosePerTreatmentPeriod?: Ratio;
  public maxTreatmentPeriod?: Duration;
  public targetSpecies?: MedicinalProductPharmaceuticalTargetSpeciesComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('firstDose')) {
        this.firstDose = new Quantity(obj.firstDose);
      }
      if (obj.hasOwnProperty('maxSingleDose')) {
        this.maxSingleDose = new Quantity(obj.maxSingleDose);
      }
      if (obj.hasOwnProperty('maxDosePerDay')) {
        this.maxDosePerDay = new Quantity(obj.maxDosePerDay);
      }
      if (obj.hasOwnProperty('maxDosePerTreatmentPeriod')) {
        this.maxDosePerTreatmentPeriod = new Ratio(obj.maxDosePerTreatmentPeriod);
      }
      if (obj.hasOwnProperty('maxTreatmentPeriod')) {
        this.maxTreatmentPeriod = new Duration(obj.maxTreatmentPeriod);
      }
      if (obj.hasOwnProperty('targetSpecies')) {
        this.targetSpecies = [];
        for (const o of obj.targetSpecies || []) {
          this.targetSpecies.push(new MedicinalProductPharmaceuticalTargetSpeciesComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductPharmaceutical extends DomainResource {
  public resourceType = 'MedicinalProductPharmaceutical';
  public identifier?: Identifier[];
  public administrableDoseForm: CodeableConcept;
  public unitOfPresentation?: CodeableConcept;
  public ingredient?: ResourceReference[];
  public device?: ResourceReference[];
  public characteristics?: MedicinalProductPharmaceuticalCharacteristicsComponent[];
  public routeOfAdministration: MedicinalProductPharmaceuticalRouteOfAdministrationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('administrableDoseForm')) {
        this.administrableDoseForm = new CodeableConcept(obj.administrableDoseForm);
      }
      if (obj.hasOwnProperty('unitOfPresentation')) {
        this.unitOfPresentation = new CodeableConcept(obj.unitOfPresentation);
      }
      if (obj.hasOwnProperty('ingredient')) {
        this.ingredient = [];
        for (const o of obj.ingredient || []) {
          this.ingredient.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('device')) {
        this.device = [];
        for (const o of obj.device || []) {
          this.device.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('characteristics')) {
        this.characteristics = [];
        for (const o of obj.characteristics || []) {
          this.characteristics.push(new MedicinalProductPharmaceuticalCharacteristicsComponent(o));
        }
      }
      if (obj.hasOwnProperty('routeOfAdministration')) {
        this.routeOfAdministration = [];
        for (const o of obj.routeOfAdministration || []) {
          this.routeOfAdministration.push(new MedicinalProductPharmaceuticalRouteOfAdministrationComponent(o));
        }
      }
    }
  }

}

export class MedicinalProductUndesirableEffectPopulationComponent extends BackboneElement {
  public age?: Element;
  public gender?: CodeableConcept;
  public race?: CodeableConcept;
  public physiologicalCondition?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('age')) {
        this.age = new Element(obj.age);
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = new CodeableConcept(obj.gender);
      }
      if (obj.hasOwnProperty('race')) {
        this.race = new CodeableConcept(obj.race);
      }
      if (obj.hasOwnProperty('physiologicalCondition')) {
        this.physiologicalCondition = new CodeableConcept(obj.physiologicalCondition);
      }
    }
  }

}

export class MedicinalProductUndesirableEffect extends DomainResource {
  public resourceType = 'MedicinalProductUndesirableEffect';
  public subject?: ResourceReference[];
  public symptomConditionEffect?: CodeableConcept;
  public classification?: CodeableConcept;
  public frequencyOfOccurrence?: CodeableConcept;
  public population?: MedicinalProductUndesirableEffectPopulationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('subject')) {
        this.subject = [];
        for (const o of obj.subject || []) {
          this.subject.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('symptomConditionEffect')) {
        this.symptomConditionEffect = new CodeableConcept(obj.symptomConditionEffect);
      }
      if (obj.hasOwnProperty('classification')) {
        this.classification = new CodeableConcept(obj.classification);
      }
      if (obj.hasOwnProperty('frequencyOfOccurrence')) {
        this.frequencyOfOccurrence = new CodeableConcept(obj.frequencyOfOccurrence);
      }
      if (obj.hasOwnProperty('population')) {
        this.population = [];
        for (const o of obj.population || []) {
          this.population.push(new MedicinalProductUndesirableEffectPopulationComponent(o));
        }
      }
    }
  }

}

export class MessageDefinitionFocusComponent extends BackboneElement {
  public code: string;
  public profile?: string;
  public min: number;
  public max?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = obj.profile;
      }
      if (obj.hasOwnProperty('min')) {
        this.min = obj.min;
      }
      if (obj.hasOwnProperty('max')) {
        this.max = obj.max;
      }
    }
  }

}

export class MessageDefinitionAllowedResponseComponent extends BackboneElement {
  public message: string;
  public situation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('message')) {
        this.message = obj.message;
      }
      if (obj.hasOwnProperty('situation')) {
        this.situation = obj.situation;
      }
    }
  }

}

export class MessageDefinition extends DomainResource {
  public resourceType = 'MessageDefinition';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public replaces?: string[];
  public status: string;
  public experimental?: boolean;
  public date: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public base?: string;
  public parent?: string[];
  public event: Element;
  public category?: string;
  public focus?: MessageDefinitionFocusComponent[];
  public responseRequired?: string;
  public allowedResponse?: MessageDefinitionAllowedResponseComponent[];
  public graph?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('replaces')) {
        this.replaces = obj.replaces;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('base')) {
        this.base = obj.base;
      }
      if (obj.hasOwnProperty('parent')) {
        this.parent = obj.parent;
      }
      if (obj.hasOwnProperty('event')) {
        this.event = new Element(obj.event);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = obj.category;
      }
      if (obj.hasOwnProperty('focus')) {
        this.focus = [];
        for (const o of obj.focus || []) {
          this.focus.push(new MessageDefinitionFocusComponent(o));
        }
      }
      if (obj.hasOwnProperty('responseRequired')) {
        this.responseRequired = obj.responseRequired;
      }
      if (obj.hasOwnProperty('allowedResponse')) {
        this.allowedResponse = [];
        for (const o of obj.allowedResponse || []) {
          this.allowedResponse.push(new MessageDefinitionAllowedResponseComponent(o));
        }
      }
      if (obj.hasOwnProperty('graph')) {
        this.graph = obj.graph;
      }
    }
  }

}

export class MessageHeaderMessageDestinationComponent extends BackboneElement {
  public name?: string;
  public target?: ResourceReference;
  public endpoint: string;
  public receiver?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('target')) {
        this.target = new ResourceReference(obj.target);
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = obj.endpoint;
      }
      if (obj.hasOwnProperty('receiver')) {
        this.receiver = new ResourceReference(obj.receiver);
      }
    }
  }

}

export class MessageHeaderMessageSourceComponent extends BackboneElement {
  public name?: string;
  public software?: string;
  public version?: string;
  public contact?: ContactPoint;
  public endpoint: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('software')) {
        this.software = obj.software;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = new ContactPoint(obj.contact);
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = obj.endpoint;
      }
    }
  }

}

export class MessageHeaderResponseComponent extends BackboneElement {
  public identifier: string;
  public code: string;
  public details?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = obj.identifier;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('details')) {
        this.details = new ResourceReference(obj.details);
      }
    }
  }

}

export class MessageHeader extends DomainResource {
  public resourceType = 'MessageHeader';
  public event: Element;
  public destination?: MessageHeaderMessageDestinationComponent[];
  public sender?: ResourceReference;
  public enterer?: ResourceReference;
  public author?: ResourceReference;
  public source: MessageHeaderMessageSourceComponent;
  public responsible?: ResourceReference;
  public reason?: CodeableConcept;
  public response?: MessageHeaderResponseComponent;
  public focus?: ResourceReference[];
  public definition?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('event')) {
        this.event = new Element(obj.event);
      }
      if (obj.hasOwnProperty('destination')) {
        this.destination = [];
        for (const o of obj.destination || []) {
          this.destination.push(new MessageHeaderMessageDestinationComponent(o));
        }
      }
      if (obj.hasOwnProperty('sender')) {
        this.sender = new ResourceReference(obj.sender);
      }
      if (obj.hasOwnProperty('enterer')) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new MessageHeaderMessageSourceComponent(obj.source);
      }
      if (obj.hasOwnProperty('responsible')) {
        this.responsible = new ResourceReference(obj.responsible);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = new CodeableConcept(obj.reason);
      }
      if (obj.hasOwnProperty('response')) {
        this.response = new MessageHeaderResponseComponent(obj.response);
      }
      if (obj.hasOwnProperty('focus')) {
        this.focus = [];
        for (const o of obj.focus || []) {
          this.focus.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
    }
  }

}

export class MoneyQuantity extends Quantity {

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class NamingSystemUniqueIdComponent extends BackboneElement {
  public type: string;
  public value: string;
  public preferred?: boolean;
  public comment?: string;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
      if (obj.hasOwnProperty('preferred')) {
        this.preferred = obj.preferred;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class NamingSystem extends DomainResource {
  public resourceType = 'NamingSystem';
  public name: string;
  public status: string;
  public kind: string;
  public date: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public responsible?: string;
  public type?: CodeableConcept;
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public usage?: string;
  public uniqueId: NamingSystemUniqueIdComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('kind')) {
        this.kind = obj.kind;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('responsible')) {
        this.responsible = obj.responsible;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('usage')) {
        this.usage = obj.usage;
      }
      if (obj.hasOwnProperty('uniqueId')) {
        this.uniqueId = [];
        for (const o of obj.uniqueId || []) {
          this.uniqueId.push(new NamingSystemUniqueIdComponent(o));
        }
      }
    }
  }

}

export class NutritionOrderNutrientComponent extends BackboneElement {
  public modifier?: CodeableConcept;
  public amount?: SimpleQuantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = new CodeableConcept(obj.modifier);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new SimpleQuantity(obj.amount);
      }
    }
  }

}

export class NutritionOrderTextureComponent extends BackboneElement {
  public modifier?: CodeableConcept;
  public foodType?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = new CodeableConcept(obj.modifier);
      }
      if (obj.hasOwnProperty('foodType')) {
        this.foodType = new CodeableConcept(obj.foodType);
      }
    }
  }

}

export class NutritionOrderOralDietComponent extends BackboneElement {
  public type?: CodeableConcept[];
  public schedule?: Timing[];
  public nutrient?: NutritionOrderNutrientComponent[];
  public texture?: NutritionOrderTextureComponent[];
  public fluidConsistencyType?: CodeableConcept[];
  public instruction?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('schedule')) {
        this.schedule = [];
        for (const o of obj.schedule || []) {
          this.schedule.push(new Timing(o));
        }
      }
      if (obj.hasOwnProperty('nutrient')) {
        this.nutrient = [];
        for (const o of obj.nutrient || []) {
          this.nutrient.push(new NutritionOrderNutrientComponent(o));
        }
      }
      if (obj.hasOwnProperty('texture')) {
        this.texture = [];
        for (const o of obj.texture || []) {
          this.texture.push(new NutritionOrderTextureComponent(o));
        }
      }
      if (obj.hasOwnProperty('fluidConsistencyType')) {
        this.fluidConsistencyType = [];
        for (const o of obj.fluidConsistencyType || []) {
          this.fluidConsistencyType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('instruction')) {
        this.instruction = obj.instruction;
      }
    }
  }

}

export class NutritionOrderSupplementComponent extends BackboneElement {
  public type?: CodeableConcept;
  public productName?: string;
  public schedule?: Timing[];
  public quantity?: SimpleQuantity;
  public instruction?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('productName')) {
        this.productName = obj.productName;
      }
      if (obj.hasOwnProperty('schedule')) {
        this.schedule = [];
        for (const o of obj.schedule || []) {
          this.schedule.push(new Timing(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('instruction')) {
        this.instruction = obj.instruction;
      }
    }
  }

}

export class NutritionOrderAdministrationComponent extends BackboneElement {
  public schedule?: Timing;
  public quantity?: SimpleQuantity;
  public rate?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('schedule')) {
        this.schedule = new Timing(obj.schedule);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('rate')) {
        this.rate = new Element(obj.rate);
      }
    }
  }

}

export class NutritionOrderEnteralFormulaComponent extends BackboneElement {
  public baseFormulaType?: CodeableConcept;
  public baseFormulaProductName?: string;
  public additiveType?: CodeableConcept;
  public additiveProductName?: string;
  public caloricDensity?: SimpleQuantity;
  public routeofAdministration?: CodeableConcept;
  public administration?: NutritionOrderAdministrationComponent[];
  public maxVolumeToDeliver?: SimpleQuantity;
  public administrationInstruction?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('baseFormulaType')) {
        this.baseFormulaType = new CodeableConcept(obj.baseFormulaType);
      }
      if (obj.hasOwnProperty('baseFormulaProductName')) {
        this.baseFormulaProductName = obj.baseFormulaProductName;
      }
      if (obj.hasOwnProperty('additiveType')) {
        this.additiveType = new CodeableConcept(obj.additiveType);
      }
      if (obj.hasOwnProperty('additiveProductName')) {
        this.additiveProductName = obj.additiveProductName;
      }
      if (obj.hasOwnProperty('caloricDensity')) {
        this.caloricDensity = new SimpleQuantity(obj.caloricDensity);
      }
      if (obj.hasOwnProperty('routeofAdministration')) {
        this.routeofAdministration = new CodeableConcept(obj.routeofAdministration);
      }
      if (obj.hasOwnProperty('administration')) {
        this.administration = [];
        for (const o of obj.administration || []) {
          this.administration.push(new NutritionOrderAdministrationComponent(o));
        }
      }
      if (obj.hasOwnProperty('maxVolumeToDeliver')) {
        this.maxVolumeToDeliver = new SimpleQuantity(obj.maxVolumeToDeliver);
      }
      if (obj.hasOwnProperty('administrationInstruction')) {
        this.administrationInstruction = obj.administrationInstruction;
      }
    }
  }

}

export class NutritionOrder extends DomainResource {
  public resourceType = 'NutritionOrder';
  public identifier?: Identifier[];
  public instantiatesCanonical?: string[];
  public instantiatesUri?: string[];
  public instantiates?: string[];
  public status: string;
  public intent: string;
  public patient: ResourceReference;
  public context?: ResourceReference;
  public dateTime: Date;
  public orderer?: ResourceReference;
  public allergyIntolerance?: ResourceReference[];
  public foodPreferenceModifier?: CodeableConcept[];
  public excludeFoodModifier?: CodeableConcept[];
  public oralDiet?: NutritionOrderOralDietComponent;
  public supplement?: NutritionOrderSupplementComponent[];
  public enteralFormula?: NutritionOrderEnteralFormulaComponent;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('instantiates')) {
        this.instantiates = obj.instantiates;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('intent')) {
        this.intent = obj.intent;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('dateTime')) {
        this.dateTime = obj.dateTime;
      }
      if (obj.hasOwnProperty('orderer')) {
        this.orderer = new ResourceReference(obj.orderer);
      }
      if (obj.hasOwnProperty('allergyIntolerance')) {
        this.allergyIntolerance = [];
        for (const o of obj.allergyIntolerance || []) {
          this.allergyIntolerance.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('foodPreferenceModifier')) {
        this.foodPreferenceModifier = [];
        for (const o of obj.foodPreferenceModifier || []) {
          this.foodPreferenceModifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('excludeFoodModifier')) {
        this.excludeFoodModifier = [];
        for (const o of obj.excludeFoodModifier || []) {
          this.excludeFoodModifier.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('oralDiet')) {
        this.oralDiet = new NutritionOrderOralDietComponent(obj.oralDiet);
      }
      if (obj.hasOwnProperty('supplement')) {
        this.supplement = [];
        for (const o of obj.supplement || []) {
          this.supplement.push(new NutritionOrderSupplementComponent(o));
        }
      }
      if (obj.hasOwnProperty('enteralFormula')) {
        this.enteralFormula = new NutritionOrderEnteralFormulaComponent(obj.enteralFormula);
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class ObservationDefinitionQuantitativeDetailsComponent extends BackboneElement {
  public customaryUnit?: Coding;
  public unit?: Coding;
  public conversionFactor?: number;
  public decimalPrecision?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('customaryUnit')) {
        this.customaryUnit = new Coding(obj.customaryUnit);
      }
      if (obj.hasOwnProperty('unit')) {
        this.unit = new Coding(obj.unit);
      }
      if (obj.hasOwnProperty('conversionFactor')) {
        this.conversionFactor = obj.conversionFactor;
      }
      if (obj.hasOwnProperty('decimalPrecision')) {
        this.decimalPrecision = obj.decimalPrecision;
      }
    }
  }

}

export class ObservationDefinitionQualifiedIntervalComponent extends BackboneElement {
  public category?: CodeableConcept;
  public range?: Range;
  public type?: CodeableConcept;
  public appliesTo?: CodeableConcept[];
  public age?: Range;
  public gestationalAge?: Range;
  public condition?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('range')) {
        this.range = new Range(obj.range);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('appliesTo')) {
        this.appliesTo = [];
        for (const o of obj.appliesTo || []) {
          this.appliesTo.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('age')) {
        this.age = new Range(obj.age);
      }
      if (obj.hasOwnProperty('gestationalAge')) {
        this.gestationalAge = new Range(obj.gestationalAge);
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = obj.condition;
      }
    }
  }

}

export class ObservationDefinition extends DomainResource {
  public resourceType = 'ObservationDefinition';
  public category?: Coding;
  public code: Coding;
  public permittedDataType?: Coding[];
  public multipleResultsAllowed?: boolean;
  public method?: CodeableConcept;
  public preferredReportName?: string;
  public quantitativeDetails?: ObservationDefinitionQuantitativeDetailsComponent;
  public qualifiedInterval?: ObservationDefinitionQualifiedIntervalComponent[];
  public validCodedValueSet?: string;
  public normalCodedValueSet?: string;
  public abnormalCodedValueSet?: string;
  public criticalCodedValueSet?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new Coding(obj.category);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new Coding(obj.code);
      }
      if (obj.hasOwnProperty('permittedDataType')) {
        this.permittedDataType = [];
        for (const o of obj.permittedDataType || []) {
          this.permittedDataType.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('multipleResultsAllowed')) {
        this.multipleResultsAllowed = obj.multipleResultsAllowed;
      }
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.hasOwnProperty('preferredReportName')) {
        this.preferredReportName = obj.preferredReportName;
      }
      if (obj.hasOwnProperty('quantitativeDetails')) {
        this.quantitativeDetails = new ObservationDefinitionQuantitativeDetailsComponent(obj.quantitativeDetails);
      }
      if (obj.hasOwnProperty('qualifiedInterval')) {
        this.qualifiedInterval = [];
        for (const o of obj.qualifiedInterval || []) {
          this.qualifiedInterval.push(new ObservationDefinitionQualifiedIntervalComponent(o));
        }
      }
      if (obj.hasOwnProperty('validCodedValueSet')) {
        this.validCodedValueSet = obj.validCodedValueSet;
      }
      if (obj.hasOwnProperty('normalCodedValueSet')) {
        this.normalCodedValueSet = obj.normalCodedValueSet;
      }
      if (obj.hasOwnProperty('abnormalCodedValueSet')) {
        this.abnormalCodedValueSet = obj.abnormalCodedValueSet;
      }
      if (obj.hasOwnProperty('criticalCodedValueSet')) {
        this.criticalCodedValueSet = obj.criticalCodedValueSet;
      }
    }
  }

}

export class OperationDefinitionBindingComponent extends BackboneElement {
  public strength: string;
  public valueSet: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('strength')) {
        this.strength = obj.strength;
      }
      if (obj.hasOwnProperty('valueSet')) {
        this.valueSet = obj.valueSet;
      }
    }
  }

}

export class OperationDefinitionReferencedFromComponent extends BackboneElement {
  public source: string;
  public sourceId?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('source')) {
        this.source = obj.source;
      }
      if (obj.hasOwnProperty('sourceId')) {
        this.sourceId = obj.sourceId;
      }
    }
  }

}

export class OperationDefinitionParameterComponent extends BackboneElement {
  public name: string;
  public use: string;
  public min: number;
  public max: string;
  public documentation?: string;
  public type?: string;
  public targetProfile?: string[];
  public searchType?: string;
  public binding?: OperationDefinitionBindingComponent;
  public referencedFrom?: OperationDefinitionReferencedFromComponent[];
  public part?: OperationDefinitionParameterComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('use')) {
        this.use = obj.use;
      }
      if (obj.hasOwnProperty('min')) {
        this.min = obj.min;
      }
      if (obj.hasOwnProperty('max')) {
        this.max = obj.max;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('targetProfile')) {
        this.targetProfile = obj.targetProfile;
      }
      if (obj.hasOwnProperty('searchType')) {
        this.searchType = obj.searchType;
      }
      if (obj.hasOwnProperty('binding')) {
        this.binding = new OperationDefinitionBindingComponent(obj.binding);
      }
      if (obj.hasOwnProperty('referencedFrom')) {
        this.referencedFrom = [];
        for (const o of obj.referencedFrom || []) {
          this.referencedFrom.push(new OperationDefinitionReferencedFromComponent(o));
        }
      }
      if (obj.hasOwnProperty('part')) {
        this.part = [];
        for (const o of obj.part || []) {
          this.part.push(new OperationDefinitionParameterComponent(o));
        }
      }
    }
  }

}

export class OperationDefinitionOverloadComponent extends BackboneElement {
  public parameterName?: string[];
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('parameterName')) {
        this.parameterName = obj.parameterName;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
    }
  }

}

export class OperationDefinition extends DomainResource {
  public resourceType = 'OperationDefinition';
  public url?: string;
  public version?: string;
  public name: string;
  public title?: string;
  public status: string;
  public kind: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public affectsState?: boolean;
  public code: string;
  public comment?: string;
  public base?: string;
  public resource?: string[];
  public system: boolean;
  public type: boolean;
  public instance: boolean;
  public inputProfile?: string;
  public outputProfile?: string;
  public parameter?: OperationDefinitionParameterComponent[];
  public overload?: OperationDefinitionOverloadComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('kind')) {
        this.kind = obj.kind;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('affectsState')) {
        this.affectsState = obj.affectsState;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('base')) {
        this.base = obj.base;
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = obj.resource;
      }
      if (obj.hasOwnProperty('system')) {
        this.system = obj.system;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('instance')) {
        this.instance = obj.instance;
      }
      if (obj.hasOwnProperty('inputProfile')) {
        this.inputProfile = obj.inputProfile;
      }
      if (obj.hasOwnProperty('outputProfile')) {
        this.outputProfile = obj.outputProfile;
      }
      if (obj.hasOwnProperty('parameter')) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new OperationDefinitionParameterComponent(o));
        }
      }
      if (obj.hasOwnProperty('overload')) {
        this.overload = [];
        for (const o of obj.overload || []) {
          this.overload.push(new OperationDefinitionOverloadComponent(o));
        }
      }
    }
  }

}

export class OperationOutcomeIssueComponent extends BackboneElement {
  public severity: string;
  public code: string;
  public details?: CodeableConcept;
  public diagnostics?: string;
  public location?: string[];
  public expression?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('severity')) {
        this.severity = obj.severity;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('details')) {
        this.details = new CodeableConcept(obj.details);
      }
      if (obj.hasOwnProperty('diagnostics')) {
        this.diagnostics = obj.diagnostics;
      }
      if (obj.hasOwnProperty('location')) {
        this.location = obj.location;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
    }
  }

}

export class OperationOutcome extends DomainResource implements IOperationOutcome {
  public resourceType = 'OperationOutcome';
  public issue: OperationOutcomeIssueComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('issue')) {
        this.issue = [];
        for (const o of obj.issue || []) {
          this.issue.push(new OperationOutcomeIssueComponent(o));
        }
      }
    }
  }

}

export class OrganizationContactComponent extends BackboneElement {
  public purpose?: CodeableConcept;
  public name?: HumanName;
  public telecom?: ContactPoint[];
  public address?: Address;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = new CodeableConcept(obj.purpose);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = new HumanName(obj.name);
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('address')) {
        this.address = new Address(obj.address);
      }
    }
  }

}

export class Organization extends DomainResource {
  public resourceType = 'Organization';
  public identifier?: Identifier[];
  public active?: boolean;
  public type?: CodeableConcept[];
  public name?: string;
  public alias?: string[];
  public telecom?: ContactPoint[];
  public address?: Address[];
  public partOf?: ResourceReference;
  public contact?: OrganizationContactComponent[];
  public endpoint?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('alias')) {
        this.alias = obj.alias;
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('address')) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = new ResourceReference(obj.partOf);
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new OrganizationContactComponent(o));
        }
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class OrganizationAffiliation extends DomainResource {
  public resourceType = 'OrganizationAffiliation';
  public identifier?: Identifier[];
  public active?: boolean;
  public period?: Period;
  public organization?: ResourceReference;
  public participatingOrganization?: ResourceReference;
  public network?: ResourceReference[];
  public code?: CodeableConcept[];
  public specialty?: CodeableConcept[];
  public location?: ResourceReference[];
  public healthcareService?: ResourceReference[];
  public telecom?: ContactPoint[];
  public endpoint?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('organization')) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.hasOwnProperty('participatingOrganization')) {
        this.participatingOrganization = new ResourceReference(obj.participatingOrganization);
      }
      if (obj.hasOwnProperty('network')) {
        this.network = [];
        for (const o of obj.network || []) {
          this.network.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specialty')) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('location')) {
        this.location = [];
        for (const o of obj.location || []) {
          this.location.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('healthcareService')) {
        this.healthcareService = [];
        for (const o of obj.healthcareService || []) {
          this.healthcareService.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class PatientContactComponent extends BackboneElement {
  public relationship?: CodeableConcept[];
  public name?: HumanName;
  public telecom?: ContactPoint[];
  public address?: Address;
  public gender?: string;
  public organization?: ResourceReference;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = [];
        for (const o of obj.relationship || []) {
          this.relationship.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = new HumanName(obj.name);
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('address')) {
        this.address = new Address(obj.address);
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = obj.gender;
      }
      if (obj.hasOwnProperty('organization')) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class PatientCommunicationComponent extends BackboneElement {
  public language: CodeableConcept;
  public preferred?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('language')) {
        this.language = new CodeableConcept(obj.language);
      }
      if (obj.hasOwnProperty('preferred')) {
        this.preferred = obj.preferred;
      }
    }
  }

}

export class PatientLinkComponent extends BackboneElement {
  public other: ResourceReference;
  public type: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('other')) {
        this.other = new ResourceReference(obj.other);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
    }
  }

}

export class Patient extends DomainResource {
  public resourceType = 'Patient';
  public identifier?: Identifier[];
  public active?: boolean;
  public name?: HumanName[];
  public telecom?: ContactPoint[];
  public gender?: string;
  public birthDate?: Date;
  public deceased?: Element;
  public address?: Address[];
  public maritalStatus?: CodeableConcept;
  public multipleBirth?: Element;
  public photo?: Attachment[];
  public contact?: PatientContactComponent[];
  public communication?: PatientCommunicationComponent[];
  public generalPractitioner?: ResourceReference[];
  public managingOrganization?: ResourceReference;
  public link?: PatientLinkComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = [];
        for (const o of obj.name || []) {
          this.name.push(new HumanName(o));
        }
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = obj.gender;
      }
      if (obj.hasOwnProperty('birthDate')) {
        this.birthDate = obj.birthDate;
      }
      if (obj.hasOwnProperty('deceased')) {
        this.deceased = new Element(obj.deceased);
      }
      if (obj.hasOwnProperty('address')) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.hasOwnProperty('maritalStatus')) {
        this.maritalStatus = new CodeableConcept(obj.maritalStatus);
      }
      if (obj.hasOwnProperty('multipleBirth')) {
        this.multipleBirth = new Element(obj.multipleBirth);
      }
      if (obj.hasOwnProperty('photo')) {
        this.photo = [];
        for (const o of obj.photo || []) {
          this.photo.push(new Attachment(o));
        }
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new PatientContactComponent(o));
        }
      }
      if (obj.hasOwnProperty('communication')) {
        this.communication = [];
        for (const o of obj.communication || []) {
          this.communication.push(new PatientCommunicationComponent(o));
        }
      }
      if (obj.hasOwnProperty('generalPractitioner')) {
        this.generalPractitioner = [];
        for (const o of obj.generalPractitioner || []) {
          this.generalPractitioner.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('managingOrganization')) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.hasOwnProperty('link')) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new PatientLinkComponent(o));
        }
      }
    }
  }

}

export class PaymentNotice extends DomainResource {
  public resourceType = 'PaymentNotice';
  public identifier?: Identifier[];
  public status?: string;
  public request?: ResourceReference;
  public response?: ResourceReference;
  public statusDate?: Date;
  public created?: Date;
  public target?: ResourceReference;
  public provider?: ResourceReference;
  public paymentStatus?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.hasOwnProperty('response')) {
        this.response = new ResourceReference(obj.response);
      }
      if (obj.hasOwnProperty('statusDate')) {
        this.statusDate = obj.statusDate;
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('target')) {
        this.target = new ResourceReference(obj.target);
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('paymentStatus')) {
        this.paymentStatus = new CodeableConcept(obj.paymentStatus);
      }
    }
  }

}

export class PaymentReconciliationDetailsComponent extends BackboneElement {
  public type: CodeableConcept;
  public request?: ResourceReference;
  public response?: ResourceReference;
  public submitter?: ResourceReference;
  public payee?: ResourceReference;
  public date?: Date;
  public amount?: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.hasOwnProperty('response')) {
        this.response = new ResourceReference(obj.response);
      }
      if (obj.hasOwnProperty('submitter')) {
        this.submitter = new ResourceReference(obj.submitter);
      }
      if (obj.hasOwnProperty('payee')) {
        this.payee = new ResourceReference(obj.payee);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Money(obj.amount);
      }
    }
  }

}

export class PaymentReconciliationNotesComponent extends BackboneElement {
  public type?: string;
  public text?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
    }
  }

}

export class PaymentReconciliation extends DomainResource {
  public resourceType = 'PaymentReconciliation';
  public identifier?: Identifier[];
  public status?: string;
  public period?: Period;
  public created?: Date;
  public organization?: ResourceReference;
  public request?: ResourceReference;
  public outcome?: string;
  public disposition?: string;
  public requestProvider?: ResourceReference;
  public detail?: PaymentReconciliationDetailsComponent[];
  public form?: CodeableConcept;
  public total?: Money;
  public processNote?: PaymentReconciliationNotesComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('organization')) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = obj.outcome;
      }
      if (obj.hasOwnProperty('disposition')) {
        this.disposition = obj.disposition;
      }
      if (obj.hasOwnProperty('requestProvider')) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new PaymentReconciliationDetailsComponent(o));
        }
      }
      if (obj.hasOwnProperty('form')) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.hasOwnProperty('total')) {
        this.total = new Money(obj.total);
      }
      if (obj.hasOwnProperty('processNote')) {
        this.processNote = [];
        for (const o of obj.processNote || []) {
          this.processNote.push(new PaymentReconciliationNotesComponent(o));
        }
      }
    }
  }

}

export class PersonLinkComponent extends BackboneElement {
  public target: ResourceReference;
  public assurance?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('target')) {
        this.target = new ResourceReference(obj.target);
      }
      if (obj.hasOwnProperty('assurance')) {
        this.assurance = obj.assurance;
      }
    }
  }

}

export class Person extends DomainResource {
  public resourceType = 'Person';
  public identifier?: Identifier[];
  public name?: HumanName[];
  public telecom?: ContactPoint[];
  public gender?: string;
  public birthDate?: Date;
  public address?: Address[];
  public photo?: Attachment;
  public managingOrganization?: ResourceReference;
  public active?: boolean;
  public link?: PersonLinkComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = [];
        for (const o of obj.name || []) {
          this.name.push(new HumanName(o));
        }
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = obj.gender;
      }
      if (obj.hasOwnProperty('birthDate')) {
        this.birthDate = obj.birthDate;
      }
      if (obj.hasOwnProperty('address')) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.hasOwnProperty('photo')) {
        this.photo = new Attachment(obj.photo);
      }
      if (obj.hasOwnProperty('managingOrganization')) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('link')) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new PersonLinkComponent(o));
        }
      }
    }
  }

}

export class PlanDefinitionTargetComponent extends BackboneElement {
  public measure?: CodeableConcept;
  public detail?: Element;
  public due?: Duration;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('measure')) {
        this.measure = new CodeableConcept(obj.measure);
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = new Element(obj.detail);
      }
      if (obj.hasOwnProperty('due')) {
        this.due = new Duration(obj.due);
      }
    }
  }

}

export class PlanDefinitionGoalComponent extends BackboneElement {
  public category?: CodeableConcept;
  public description: CodeableConcept;
  public priority?: CodeableConcept;
  public start?: CodeableConcept;
  public addresses?: CodeableConcept[];
  public documentation?: RelatedArtifact[];
  public target?: PlanDefinitionTargetComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = new CodeableConcept(obj.description);
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.hasOwnProperty('start')) {
        this.start = new CodeableConcept(obj.start);
      }
      if (obj.hasOwnProperty('addresses')) {
        this.addresses = [];
        for (const o of obj.addresses || []) {
          this.addresses.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = [];
        for (const o of obj.documentation || []) {
          this.documentation.push(new RelatedArtifact(o));
        }
      }
      if (obj.hasOwnProperty('target')) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new PlanDefinitionTargetComponent(o));
        }
      }
    }
  }

}

export class PlanDefinitionConditionComponent extends BackboneElement {
  public kind: string;
  public expression?: Expression;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('kind')) {
        this.kind = obj.kind;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = new Expression(obj.expression);
      }
    }
  }

}

export class PlanDefinitionRelatedActionComponent extends BackboneElement {
  public actionId: string;
  public relationship: string;
  public offset?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('actionId')) {
        this.actionId = obj.actionId;
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = obj.relationship;
      }
      if (obj.hasOwnProperty('offset')) {
        this.offset = new Element(obj.offset);
      }
    }
  }

}

export class PlanDefinitionParticipantComponent extends BackboneElement {
  public type: string;
  public role?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
    }
  }

}

export class PlanDefinitionDynamicValueComponent extends BackboneElement {
  public path?: string;
  public expression?: Expression;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = new Expression(obj.expression);
      }
    }
  }

}

export class PlanDefinitionActionComponent extends BackboneElement {
  public prefix?: string;
  public title?: string;
  public description?: string;
  public textEquivalent?: string;
  public priority?: string;
  public code?: CodeableConcept[];
  public reason?: CodeableConcept[];
  public documentation?: RelatedArtifact[];
  public goalId?: string[];
  public trigger?: TriggerDefinition[];
  public condition?: PlanDefinitionConditionComponent[];
  public input?: DataRequirement[];
  public output?: DataRequirement[];
  public relatedAction?: PlanDefinitionRelatedActionComponent[];
  public timing?: Element;
  public participant?: PlanDefinitionParticipantComponent[];
  public type?: CodeableConcept;
  public groupingBehavior?: string;
  public selectionBehavior?: string;
  public requiredBehavior?: string;
  public precheckBehavior?: string;
  public cardinalityBehavior?: string;
  public definition?: string;
  public transform?: string;
  public dynamicValue?: PlanDefinitionDynamicValueComponent[];
  public action?: PlanDefinitionActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('prefix')) {
        this.prefix = obj.prefix;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('textEquivalent')) {
        this.textEquivalent = obj.textEquivalent;
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = [];
        for (const o of obj.documentation || []) {
          this.documentation.push(new RelatedArtifact(o));
        }
      }
      if (obj.hasOwnProperty('goalId')) {
        this.goalId = obj.goalId;
      }
      if (obj.hasOwnProperty('trigger')) {
        this.trigger = [];
        for (const o of obj.trigger || []) {
          this.trigger.push(new TriggerDefinition(o));
        }
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = [];
        for (const o of obj.condition || []) {
          this.condition.push(new PlanDefinitionConditionComponent(o));
        }
      }
      if (obj.hasOwnProperty('input')) {
        this.input = [];
        for (const o of obj.input || []) {
          this.input.push(new DataRequirement(o));
        }
      }
      if (obj.hasOwnProperty('output')) {
        this.output = [];
        for (const o of obj.output || []) {
          this.output.push(new DataRequirement(o));
        }
      }
      if (obj.hasOwnProperty('relatedAction')) {
        this.relatedAction = [];
        for (const o of obj.relatedAction || []) {
          this.relatedAction.push(new PlanDefinitionRelatedActionComponent(o));
        }
      }
      if (obj.hasOwnProperty('timing')) {
        this.timing = new Element(obj.timing);
      }
      if (obj.hasOwnProperty('participant')) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new PlanDefinitionParticipantComponent(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('groupingBehavior')) {
        this.groupingBehavior = obj.groupingBehavior;
      }
      if (obj.hasOwnProperty('selectionBehavior')) {
        this.selectionBehavior = obj.selectionBehavior;
      }
      if (obj.hasOwnProperty('requiredBehavior')) {
        this.requiredBehavior = obj.requiredBehavior;
      }
      if (obj.hasOwnProperty('precheckBehavior')) {
        this.precheckBehavior = obj.precheckBehavior;
      }
      if (obj.hasOwnProperty('cardinalityBehavior')) {
        this.cardinalityBehavior = obj.cardinalityBehavior;
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('transform')) {
        this.transform = obj.transform;
      }
      if (obj.hasOwnProperty('dynamicValue')) {
        this.dynamicValue = [];
        for (const o of obj.dynamicValue || []) {
          this.dynamicValue.push(new PlanDefinitionDynamicValueComponent(o));
        }
      }
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new PlanDefinitionActionComponent(o));
        }
      }
    }
  }

}

export class PlanDefinition extends DomainResource {
  public resourceType = 'PlanDefinition';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public subtitle?: string;
  public type?: CodeableConcept;
  public status: string;
  public experimental?: boolean;
  public subject?: Element;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public usage?: string;
  public copyright?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public topic?: CodeableConcept[];
  public author?: ContactDetail[];
  public editor?: ContactDetail[];
  public reviewer?: ContactDetail[];
  public endorser?: ContactDetail[];
  public relatedArtifact?: RelatedArtifact[];
  public library?: string[];
  public goal?: PlanDefinitionGoalComponent[];
  public action?: PlanDefinitionActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('subtitle')) {
        this.subtitle = obj.subtitle;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new Element(obj.subject);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('usage')) {
        this.usage = obj.usage;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('approvalDate')) {
        this.approvalDate = obj.approvalDate;
      }
      if (obj.hasOwnProperty('lastReviewDate')) {
        this.lastReviewDate = obj.lastReviewDate;
      }
      if (obj.hasOwnProperty('effectivePeriod')) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.hasOwnProperty('topic')) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('author')) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('editor')) {
        this.editor = [];
        for (const o of obj.editor || []) {
          this.editor.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('reviewer')) {
        this.reviewer = [];
        for (const o of obj.reviewer || []) {
          this.reviewer.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('endorser')) {
        this.endorser = [];
        for (const o of obj.endorser || []) {
          this.endorser.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('relatedArtifact')) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.hasOwnProperty('library')) {
        this.library = obj.library;
      }
      if (obj.hasOwnProperty('goal')) {
        this.goal = [];
        for (const o of obj.goal || []) {
          this.goal.push(new PlanDefinitionGoalComponent(o));
        }
      }
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new PlanDefinitionActionComponent(o));
        }
      }
    }
  }

}

export class PractitionerQualificationComponent extends BackboneElement {
  public identifier?: Identifier[];
  public code: CodeableConcept;
  public period?: Period;
  public issuer?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('issuer')) {
        this.issuer = new ResourceReference(obj.issuer);
      }
    }
  }

}

export class Practitioner extends DomainResource implements IPractitioner {
  public resourceType = 'Practitioner';
  public identifier?: Identifier[];
  public active?: boolean;
  public name?: HumanName[];
  public telecom?: ContactPoint[];
  public address?: Address[];
  public gender?: string;
  public birthDate?: Date;
  public photo?: Attachment[];
  public qualification?: PractitionerQualificationComponent[];
  public communication?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = [];
        for (const o of obj.name || []) {
          this.name.push(new HumanName(o));
        }
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('address')) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = obj.gender;
      }
      if (obj.hasOwnProperty('birthDate')) {
        this.birthDate = obj.birthDate;
      }
      if (obj.hasOwnProperty('photo')) {
        this.photo = [];
        for (const o of obj.photo || []) {
          this.photo.push(new Attachment(o));
        }
      }
      if (obj.hasOwnProperty('qualification')) {
        this.qualification = [];
        for (const o of obj.qualification || []) {
          this.qualification.push(new PractitionerQualificationComponent(o));
        }
      }
      if (obj.hasOwnProperty('communication')) {
        this.communication = [];
        for (const o of obj.communication || []) {
          this.communication.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class PractitionerRoleAvailableTimeComponent extends BackboneElement {
  public daysOfWeek?: string[];
  public allDay?: boolean;
  public availableStartTime?: Date;
  public availableEndTime?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('daysOfWeek')) {
        this.daysOfWeek = obj.daysOfWeek;
      }
      if (obj.hasOwnProperty('allDay')) {
        this.allDay = obj.allDay;
      }
      if (obj.hasOwnProperty('availableStartTime')) {
        this.availableStartTime = obj.availableStartTime;
      }
      if (obj.hasOwnProperty('availableEndTime')) {
        this.availableEndTime = obj.availableEndTime;
      }
    }
  }

}

export class PractitionerRoleNotAvailableComponent extends BackboneElement {
  public description: string;
  public during?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('during')) {
        this.during = new Period(obj.during);
      }
    }
  }

}

export class PractitionerRole extends DomainResource {
  public resourceType = 'PractitionerRole';
  public identifier?: Identifier[];
  public active?: boolean;
  public period?: Period;
  public practitioner?: ResourceReference;
  public organization?: ResourceReference;
  public code?: CodeableConcept[];
  public specialty?: CodeableConcept[];
  public location?: ResourceReference[];
  public healthcareService?: ResourceReference[];
  public telecom?: ContactPoint[];
  public availableTime?: PractitionerRoleAvailableTimeComponent[];
  public notAvailable?: PractitionerRoleNotAvailableComponent[];
  public availabilityExceptions?: string;
  public endpoint?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('practitioner')) {
        this.practitioner = new ResourceReference(obj.practitioner);
      }
      if (obj.hasOwnProperty('organization')) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specialty')) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('location')) {
        this.location = [];
        for (const o of obj.location || []) {
          this.location.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('healthcareService')) {
        this.healthcareService = [];
        for (const o of obj.healthcareService || []) {
          this.healthcareService.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('availableTime')) {
        this.availableTime = [];
        for (const o of obj.availableTime || []) {
          this.availableTime.push(new PractitionerRoleAvailableTimeComponent(o));
        }
      }
      if (obj.hasOwnProperty('notAvailable')) {
        this.notAvailable = [];
        for (const o of obj.notAvailable || []) {
          this.notAvailable.push(new PractitionerRoleNotAvailableComponent(o));
        }
      }
      if (obj.hasOwnProperty('availabilityExceptions')) {
        this.availabilityExceptions = obj.availabilityExceptions;
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class ProcedurePerformerComponent extends BackboneElement {
  public function?: CodeableConcept;
  public actor: ResourceReference;
  public onBehalfOf?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('function')) {
        this.function = new CodeableConcept(obj.function);
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = new ResourceReference(obj.actor);
      }
      if (obj.hasOwnProperty('onBehalfOf')) {
        this.onBehalfOf = new ResourceReference(obj.onBehalfOf);
      }
    }
  }

}

export class ProcedureFocalDeviceComponent extends BackboneElement {
  public action?: CodeableConcept;
  public manipulated: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('action')) {
        this.action = new CodeableConcept(obj.action);
      }
      if (obj.hasOwnProperty('manipulated')) {
        this.manipulated = new ResourceReference(obj.manipulated);
      }
    }
  }

}

export class Procedure extends DomainResource {
  public resourceType = 'Procedure';
  public identifier?: Identifier[];
  public instantiatesCanonical?: string[];
  public instantiatesUri?: string[];
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status: string;
  public statusReason?: CodeableConcept;
  public category?: CodeableConcept;
  public code?: CodeableConcept;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public performed?: Element;
  public recorder?: ResourceReference;
  public asserter?: ResourceReference;
  public performer?: ProcedurePerformerComponent[];
  public location?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public bodySite?: CodeableConcept[];
  public outcome?: CodeableConcept;
  public report?: ResourceReference[];
  public complication?: CodeableConcept[];
  public complicationDetail?: ResourceReference[];
  public followUp?: CodeableConcept[];
  public note?: Annotation[];
  public focalDevice?: ProcedureFocalDeviceComponent[];
  public usedReference?: ResourceReference[];
  public usedCode?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = new CodeableConcept(obj.statusReason);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('performed')) {
        this.performed = new Element(obj.performed);
      }
      if (obj.hasOwnProperty('recorder')) {
        this.recorder = new ResourceReference(obj.recorder);
      }
      if (obj.hasOwnProperty('asserter')) {
        this.asserter = new ResourceReference(obj.asserter);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ProcedurePerformerComponent(o));
        }
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = [];
        for (const o of obj.bodySite || []) {
          this.bodySite.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.hasOwnProperty('report')) {
        this.report = [];
        for (const o of obj.report || []) {
          this.report.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('complication')) {
        this.complication = [];
        for (const o of obj.complication || []) {
          this.complication.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('complicationDetail')) {
        this.complicationDetail = [];
        for (const o of obj.complicationDetail || []) {
          this.complicationDetail.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('followUp')) {
        this.followUp = [];
        for (const o of obj.followUp || []) {
          this.followUp.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('focalDevice')) {
        this.focalDevice = [];
        for (const o of obj.focalDevice || []) {
          this.focalDevice.push(new ProcedureFocalDeviceComponent(o));
        }
      }
      if (obj.hasOwnProperty('usedReference')) {
        this.usedReference = [];
        for (const o of obj.usedReference || []) {
          this.usedReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('usedCode')) {
        this.usedCode = [];
        for (const o of obj.usedCode || []) {
          this.usedCode.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class ServiceRequest extends DomainResource {
  public resourceType = 'ServiceRequest';
  public identifier?: Identifier[];
  public instantiatesCanonical?: string[];
  public instantiatesUri?: string[];
  public basedOn?: ResourceReference[];
  public replaces?: ResourceReference[];
  public requisition?: Identifier;
  public status: string;
  public intent: string;
  public category?: CodeableConcept[];
  public priority?: string;
  public doNotPerform?: boolean;
  public code?: CodeableConcept;
  public orderDetail?: CodeableConcept[];
  public quantity?: Element;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public asNeeded?: Element;
  public authoredOn?: Date;
  public requester?: ResourceReference;
  public performerType?: CodeableConcept;
  public performer?: ResourceReference[];
  public locationCode?: CodeableConcept[];
  public locationReference?: ResourceReference[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public insurance?: ResourceReference[];
  public supportingInfo?: ResourceReference[];
  public specimen?: ResourceReference[];
  public bodySite?: CodeableConcept[];
  public note?: Annotation[];
  public patientInstruction?: string;
  public relevantHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('replaces')) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('requisition')) {
        this.requisition = new Identifier(obj.requisition);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('intent')) {
        this.intent = obj.intent;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('doNotPerform')) {
        this.doNotPerform = obj.doNotPerform;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('orderDetail')) {
        this.orderDetail = [];
        for (const o of obj.orderDetail || []) {
          this.orderDetail.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new Element(obj.quantity);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('occurrence')) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.hasOwnProperty('asNeeded')) {
        this.asNeeded = new Element(obj.asNeeded);
      }
      if (obj.hasOwnProperty('authoredOn')) {
        this.authoredOn = obj.authoredOn;
      }
      if (obj.hasOwnProperty('requester')) {
        this.requester = new ResourceReference(obj.requester);
      }
      if (obj.hasOwnProperty('performerType')) {
        this.performerType = new CodeableConcept(obj.performerType);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('locationCode')) {
        this.locationCode = [];
        for (const o of obj.locationCode || []) {
          this.locationCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('locationReference')) {
        this.locationReference = [];
        for (const o of obj.locationReference || []) {
          this.locationReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('insurance')) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('supportingInfo')) {
        this.supportingInfo = [];
        for (const o of obj.supportingInfo || []) {
          this.supportingInfo.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('specimen')) {
        this.specimen = [];
        for (const o of obj.specimen || []) {
          this.specimen.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = [];
        for (const o of obj.bodySite || []) {
          this.bodySite.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('patientInstruction')) {
        this.patientInstruction = obj.patientInstruction;
      }
      if (obj.hasOwnProperty('relevantHistory')) {
        this.relevantHistory = [];
        for (const o of obj.relevantHistory || []) {
          this.relevantHistory.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class ProcedureRequest extends ServiceRequest {
  public resourceType = 'ProcedureRequest';

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class ProcessRequestItemsComponent extends BackboneElement {
  public sequenceLinkId: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('sequenceLinkId')) {
        this.sequenceLinkId = obj.sequenceLinkId;
      }
    }
  }

}

export class ProcessRequest extends DomainResource {
  public resourceType = 'ProcessRequest';
  public identifier?: Identifier[];
  public status?: string;
  public action?: string;
  public target?: ResourceReference;
  public created?: Date;
  public provider?: ResourceReference;
  public request?: ResourceReference;
  public response?: ResourceReference;
  public nullify?: boolean;
  public reference?: string;
  public item?: ProcessRequestItemsComponent[];
  public include?: string[];
  public exclude?: string[];
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('action')) {
        this.action = obj.action;
      }
      if (obj.hasOwnProperty('target')) {
        this.target = new ResourceReference(obj.target);
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('provider')) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.hasOwnProperty('response')) {
        this.response = new ResourceReference(obj.response);
      }
      if (obj.hasOwnProperty('nullify')) {
        this.nullify = obj.nullify;
      }
      if (obj.hasOwnProperty('reference')) {
        this.reference = obj.reference;
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ProcessRequestItemsComponent(o));
        }
      }
      if (obj.hasOwnProperty('include')) {
        this.include = obj.include;
      }
      if (obj.hasOwnProperty('exclude')) {
        this.exclude = obj.exclude;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class ProcessResponseProcessNoteComponent extends BackboneElement {
  public type?: string;
  public text?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
    }
  }

}

export class ProcessResponse extends DomainResource {
  public resourceType = 'ProcessResponse';
  public identifier?: Identifier[];
  public status?: string;
  public created?: Date;
  public organization?: ResourceReference;
  public request?: ResourceReference;
  public outcome?: string;
  public disposition?: string;
  public requestProvider?: ResourceReference;
  public form?: CodeableConcept;
  public processNote?: ProcessResponseProcessNoteComponent[];
  public error?: CodeableConcept[];
  public communicationRequest?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('organization')) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.hasOwnProperty('request')) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = obj.outcome;
      }
      if (obj.hasOwnProperty('disposition')) {
        this.disposition = obj.disposition;
      }
      if (obj.hasOwnProperty('requestProvider')) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
      if (obj.hasOwnProperty('form')) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.hasOwnProperty('processNote')) {
        this.processNote = [];
        for (const o of obj.processNote || []) {
          this.processNote.push(new ProcessResponseProcessNoteComponent(o));
        }
      }
      if (obj.hasOwnProperty('error')) {
        this.error = [];
        for (const o of obj.error || []) {
          this.error.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('communicationRequest')) {
        this.communicationRequest = [];
        for (const o of obj.communicationRequest || []) {
          this.communicationRequest.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class ProvenanceAgentComponent extends BackboneElement {
  public type?: CodeableConcept;
  public role?: CodeableConcept[];
  public who: ResourceReference;
  public onBehalfOf?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('role')) {
        this.role = [];
        for (const o of obj.role || []) {
          this.role.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('who')) {
        this.who = new ResourceReference(obj.who);
      }
      if (obj.hasOwnProperty('onBehalfOf')) {
        this.onBehalfOf = new ResourceReference(obj.onBehalfOf);
      }
    }
  }

}

export class ProvenanceEntityComponent extends BackboneElement {
  public role: string;
  public what: ResourceReference;
  public agent?: ProvenanceAgentComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('role')) {
        this.role = obj.role;
      }
      if (obj.hasOwnProperty('what')) {
        this.what = new ResourceReference(obj.what);
      }
      if (obj.hasOwnProperty('agent')) {
        this.agent = [];
        for (const o of obj.agent || []) {
          this.agent.push(new ProvenanceAgentComponent(o));
        }
      }
    }
  }

}

export class Provenance extends DomainResource {
  public resourceType = 'Provenance';
  public target: ResourceReference[];
  public occurred?: Element;
  public recorded: Date;
  public policy?: string[];
  public location?: ResourceReference;
  public reason?: CodeableConcept[];
  public activity?: CodeableConcept;
  public agent: ProvenanceAgentComponent[];
  public entity?: ProvenanceEntityComponent[];
  public signature?: Signature[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('target')) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('occurred')) {
        this.occurred = new Element(obj.occurred);
      }
      if (obj.hasOwnProperty('recorded')) {
        this.recorded = obj.recorded;
      }
      if (obj.hasOwnProperty('policy')) {
        this.policy = obj.policy;
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('activity')) {
        this.activity = new CodeableConcept(obj.activity);
      }
      if (obj.hasOwnProperty('agent')) {
        this.agent = [];
        for (const o of obj.agent || []) {
          this.agent.push(new ProvenanceAgentComponent(o));
        }
      }
      if (obj.hasOwnProperty('entity')) {
        this.entity = [];
        for (const o of obj.entity || []) {
          this.entity.push(new ProvenanceEntityComponent(o));
        }
      }
      if (obj.hasOwnProperty('signature')) {
        this.signature = [];
        for (const o of obj.signature || []) {
          this.signature.push(new Signature(o));
        }
      }
    }
  }

}

export class QuestionnaireEnableWhenComponent extends BackboneElement {
  public question: string;
  public operator: string;
  public answer: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('question')) {
        this.question = obj.question;
      }
      if (obj.hasOwnProperty('operator')) {
        this.operator = obj.operator;
      }
      if (obj.hasOwnProperty('answer')) {
        this.answer = new Element(obj.answer);
      }
    }
  }

}

export class QuestionnaireAnswerOptionComponent extends BackboneElement {
  public valueInteger: number;
  public valueDate: string;
  public valueTime: string;
  public valueString: string;
  public valueCoding: Coding;
  public valueReference: ResourceReference;
  public initialSelected?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('valueInteger')) {
        this.valueInteger = obj.valueInteger;
      }
      if (obj.hasOwnProperty('valueDate')) {
        this.valueDate = obj.valueDate;
      }
      if (obj.hasOwnProperty('valueTime')) {
        this.valueTime = obj.valueTime;
      }
      if (obj.hasOwnProperty('valueString')) {
        this.valueString = obj.valueString;
      }
      if (obj.hasOwnProperty('valueCoding')) {
        this.valueCoding = new Coding(obj.valueCoding);
      }
      if (obj.hasOwnProperty('valueReference')) {
        this.valueReference = new ResourceReference(obj.valueReference);
      }
      if (obj.hasOwnProperty('initialSelected')) {
        this.initialSelected = obj.initialSelected;
      }
    }
  }

}

export class QuestionnaireInitialComponent extends BackboneElement {
  public valueBoolean: boolean;
  public valueDecimal: number;
  public valueInteger: number;
  public valueDate: string;
  public valueDateTime: string;
  public valueString: string;
  public valueUri: string;
  public valueAttachment: Attachment;
  public valueCoding: Coding;
  public valueQuantity: Quantity;
  public valueReference: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('valueBoolean')) {
        this.valueBoolean = obj.valueBoolean;
      }
      if (obj.hasOwnProperty('valueDecimal')) {
        this.valueDecimal = obj.valueDecimal;
      }
      if (obj.hasOwnProperty('valueInteger')) {
        this.valueInteger = obj.valueInteger;
      }
      if (obj.hasOwnProperty('valueDate')) {
        this.valueDate = obj.valueDate;
      }
      if (obj.hasOwnProperty('valueDateTime')) {
        this.valueDateTime = obj.valueDateTime;
      }
      if (obj.hasOwnProperty('valueString')) {
        this.valueString = obj.valueString;
      }
      if (obj.hasOwnProperty('valueUri')) {
        this.valueUri = obj.valueUri;
      }
      if (obj.hasOwnProperty('valueAttachment')) {
        this.valueAttachment = new Attachment(obj.valueAttachment);
      }
      if (obj.hasOwnProperty('valueCoding')) {
        this.valueCoding = new Coding(obj.valueCoding);
      }
      if (obj.hasOwnProperty('valueQuantity')) {
        this.valueQuantity = new Quantity(obj.valueQuantity);
      }
      if (obj.hasOwnProperty('valueReference')) {
        this.valueReference = new ResourceReference(obj.valueReference);
      }
    }
  }

}

export class QuestionnaireItemComponent extends BackboneElement {
  public linkId: string;
  public definition?: string;
  public code?: Coding[];
  public prefix?: string;
  public text?: string;
  public type: string;
  public enableWhen?: QuestionnaireEnableWhenComponent[];
  public enableBehavior?: string;
  public required?: boolean;
  public repeats?: boolean;
  public readOnly?: boolean;
  public maxLength?: number;
  public answerValueSet?: string;
  public answerOption?: QuestionnaireAnswerOptionComponent[];
  public initial?: QuestionnaireInitialComponent[];
  public item?: QuestionnaireItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('linkId')) {
        this.linkId = obj.linkId;
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('prefix')) {
        this.prefix = obj.prefix;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('enableWhen')) {
        this.enableWhen = [];
        for (const o of obj.enableWhen || []) {
          this.enableWhen.push(new QuestionnaireEnableWhenComponent(o));
        }
      }
      if (obj.hasOwnProperty('enableBehavior')) {
        this.enableBehavior = obj.enableBehavior;
      }
      if (obj.hasOwnProperty('required')) {
        this.required = obj.required;
      }
      if (obj.hasOwnProperty('repeats')) {
        this.repeats = obj.repeats;
      }
      if (obj.hasOwnProperty('readOnly')) {
        this.readOnly = obj.readOnly;
      }
      if (obj.hasOwnProperty('maxLength')) {
        this.maxLength = obj.maxLength;
      }
      if (obj.hasOwnProperty('answerValueSet')) {
        this.answerValueSet = obj.answerValueSet;
      }
      if (obj.hasOwnProperty('answerOption')) {
        this.answerOption = [];
        for (const o of obj.answerOption || []) {
          this.answerOption.push(new QuestionnaireAnswerOptionComponent(o));
        }
      }
      if (obj.hasOwnProperty('initial')) {
        this.initial = [];
        for (const o of obj.initial || []) {
          this.initial.push(new QuestionnaireInitialComponent(o));
        }
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new QuestionnaireItemComponent(o));
        }
      }
    }
  }

}

export class Questionnaire extends DomainResource {
  public resourceType = 'Questionnaire';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public derivedFrom?: string[];
  public status: string;
  public experimental?: boolean;
  public subjectType?: string[];
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public code?: Coding[];
  public item?: QuestionnaireItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('derivedFrom')) {
        this.derivedFrom = obj.derivedFrom;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('subjectType')) {
        this.subjectType = obj.subjectType;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('approvalDate')) {
        this.approvalDate = obj.approvalDate;
      }
      if (obj.hasOwnProperty('lastReviewDate')) {
        this.lastReviewDate = obj.lastReviewDate;
      }
      if (obj.hasOwnProperty('effectivePeriod')) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new Coding(o));
        }
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new QuestionnaireItemComponent(o));
        }
      }
    }
  }

}

export class QuestionnaireResponseAnswerComponent extends BackboneElement {
  public value?: Element;
  public item?: QuestionnaireResponseItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new QuestionnaireResponseItemComponent(o));
        }
      }
    }
  }

}

export class QuestionnaireResponseItemComponent extends BackboneElement {
  public linkId: string;
  public definition?: string;
  public text?: string;
  public answer?: QuestionnaireResponseAnswerComponent[];
  public item?: QuestionnaireResponseItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('linkId')) {
        this.linkId = obj.linkId;
      }
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('text')) {
        this.text = obj.text;
      }
      if (obj.hasOwnProperty('answer')) {
        this.answer = [];
        for (const o of obj.answer || []) {
          this.answer.push(new QuestionnaireResponseAnswerComponent(o));
        }
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new QuestionnaireResponseItemComponent(o));
        }
      }
    }
  }

}

export class QuestionnaireResponse extends DomainResource {
  public resourceType = 'QuestionnaireResponse';
  public identifier?: Identifier;
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public questionnaire?: string;
  public status: string;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public authored?: Date;
  public author?: ResourceReference;
  public source?: ResourceReference;
  public item?: QuestionnaireResponseItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('questionnaire')) {
        this.questionnaire = obj.questionnaire;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('authored')) {
        this.authored = obj.authored;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.hasOwnProperty('source')) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.hasOwnProperty('item')) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new QuestionnaireResponseItemComponent(o));
        }
      }
    }
  }

}

export class ReferralRequest extends ServiceRequest {
  public resourceType = 'ReferralRequest';

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class RelatedPerson extends DomainResource {
  public resourceType = 'RelatedPerson';
  public identifier?: Identifier[];
  public active?: boolean;
  public patient: ResourceReference;
  public relationship?: CodeableConcept[];
  public name?: HumanName[];
  public telecom?: ContactPoint[];
  public gender?: string;
  public birthDate?: Date;
  public address?: Address[];
  public photo?: Attachment[];
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = [];
        for (const o of obj.relationship || []) {
          this.relationship.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('name')) {
        this.name = [];
        for (const o of obj.name || []) {
          this.name.push(new HumanName(o));
        }
      }
      if (obj.hasOwnProperty('telecom')) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('gender')) {
        this.gender = obj.gender;
      }
      if (obj.hasOwnProperty('birthDate')) {
        this.birthDate = obj.birthDate;
      }
      if (obj.hasOwnProperty('address')) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.hasOwnProperty('photo')) {
        this.photo = [];
        for (const o of obj.photo || []) {
          this.photo.push(new Attachment(o));
        }
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class RequestGroupConditionComponent extends BackboneElement {
  public kind: string;
  public description?: string;
  public language?: string;
  public expression?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('kind')) {
        this.kind = obj.kind;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('language')) {
        this.language = obj.language;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
    }
  }

}

export class RequestGroupRelatedActionComponent extends BackboneElement {
  public actionId: string;
  public relationship: string;
  public offset?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('actionId')) {
        this.actionId = obj.actionId;
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = obj.relationship;
      }
      if (obj.hasOwnProperty('offset')) {
        this.offset = new Element(obj.offset);
      }
    }
  }

}

export class RequestGroupActionComponent extends BackboneElement {
  public prefix?: string;
  public title?: string;
  public description?: string;
  public textEquivalent?: string;
  public priority?: string;
  public code?: CodeableConcept[];
  public documentation?: RelatedArtifact[];
  public condition?: RequestGroupConditionComponent[];
  public relatedAction?: RequestGroupRelatedActionComponent[];
  public timing?: Element;
  public participant?: ResourceReference[];
  public type?: CodeableConcept;
  public groupingBehavior?: string;
  public selectionBehavior?: string;
  public requiredBehavior?: string;
  public precheckBehavior?: string;
  public cardinalityBehavior?: string;
  public resource?: ResourceReference;
  public action?: RequestGroupActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('prefix')) {
        this.prefix = obj.prefix;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('textEquivalent')) {
        this.textEquivalent = obj.textEquivalent;
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = [];
        for (const o of obj.documentation || []) {
          this.documentation.push(new RelatedArtifact(o));
        }
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = [];
        for (const o of obj.condition || []) {
          this.condition.push(new RequestGroupConditionComponent(o));
        }
      }
      if (obj.hasOwnProperty('relatedAction')) {
        this.relatedAction = [];
        for (const o of obj.relatedAction || []) {
          this.relatedAction.push(new RequestGroupRelatedActionComponent(o));
        }
      }
      if (obj.hasOwnProperty('timing')) {
        this.timing = new Element(obj.timing);
      }
      if (obj.hasOwnProperty('participant')) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('groupingBehavior')) {
        this.groupingBehavior = obj.groupingBehavior;
      }
      if (obj.hasOwnProperty('selectionBehavior')) {
        this.selectionBehavior = obj.selectionBehavior;
      }
      if (obj.hasOwnProperty('requiredBehavior')) {
        this.requiredBehavior = obj.requiredBehavior;
      }
      if (obj.hasOwnProperty('precheckBehavior')) {
        this.precheckBehavior = obj.precheckBehavior;
      }
      if (obj.hasOwnProperty('cardinalityBehavior')) {
        this.cardinalityBehavior = obj.cardinalityBehavior;
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = new ResourceReference(obj.resource);
      }
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new RequestGroupActionComponent(o));
        }
      }
    }
  }

}

export class RequestGroup extends DomainResource {
  public resourceType = 'RequestGroup';
  public identifier?: Identifier[];
  public instantiatesCanonical?: string[];
  public instantiatesUri?: string[];
  public basedOn?: ResourceReference[];
  public replaces?: ResourceReference[];
  public groupIdentifier?: Identifier;
  public status: string;
  public intent: string;
  public priority?: string;
  public code?: CodeableConcept;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public authoredOn?: Date;
  public author?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];
  public action?: RequestGroupActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('replaces')) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('groupIdentifier')) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('intent')) {
        this.intent = obj.intent;
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('authoredOn')) {
        this.authoredOn = obj.authoredOn;
      }
      if (obj.hasOwnProperty('author')) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new RequestGroupActionComponent(o));
        }
      }
    }
  }

}

export class ResearchStudyArmComponent extends BackboneElement {
  public name: string;
  public type?: CodeableConcept;
  public description?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
    }
  }

}

export class ResearchStudyObjectiveComponent extends BackboneElement {
  public name?: string;
  public type?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
    }
  }

}

export class ResearchStudy extends DomainResource {
  public resourceType = 'ResearchStudy';
  public identifier?: Identifier[];
  public title?: string;
  public protocol?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status: string;
  public primaryPurposeType?: CodeableConcept;
  public phase?: CodeableConcept;
  public category?: CodeableConcept[];
  public focus?: CodeableConcept[];
  public condition?: CodeableConcept[];
  public contact?: ContactDetail[];
  public relatedArtifact?: RelatedArtifact[];
  public keyword?: CodeableConcept[];
  public location?: CodeableConcept[];
  public description?: string;
  public enrollment?: ResourceReference[];
  public period?: Period;
  public sponsor?: ResourceReference;
  public principalInvestigator?: ResourceReference;
  public site?: ResourceReference[];
  public reasonStopped?: CodeableConcept;
  public note?: Annotation[];
  public arm?: ResearchStudyArmComponent[];
  public objective?: ResearchStudyObjectiveComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('protocol')) {
        this.protocol = [];
        for (const o of obj.protocol || []) {
          this.protocol.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('primaryPurposeType')) {
        this.primaryPurposeType = new CodeableConcept(obj.primaryPurposeType);
      }
      if (obj.hasOwnProperty('phase')) {
        this.phase = new CodeableConcept(obj.phase);
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('focus')) {
        this.focus = [];
        for (const o of obj.focus || []) {
          this.focus.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = [];
        for (const o of obj.condition || []) {
          this.condition.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('relatedArtifact')) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.hasOwnProperty('keyword')) {
        this.keyword = [];
        for (const o of obj.keyword || []) {
          this.keyword.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('location')) {
        this.location = [];
        for (const o of obj.location || []) {
          this.location.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('enrollment')) {
        this.enrollment = [];
        for (const o of obj.enrollment || []) {
          this.enrollment.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('sponsor')) {
        this.sponsor = new ResourceReference(obj.sponsor);
      }
      if (obj.hasOwnProperty('principalInvestigator')) {
        this.principalInvestigator = new ResourceReference(obj.principalInvestigator);
      }
      if (obj.hasOwnProperty('site')) {
        this.site = [];
        for (const o of obj.site || []) {
          this.site.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('reasonStopped')) {
        this.reasonStopped = new CodeableConcept(obj.reasonStopped);
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('arm')) {
        this.arm = [];
        for (const o of obj.arm || []) {
          this.arm.push(new ResearchStudyArmComponent(o));
        }
      }
      if (obj.hasOwnProperty('objective')) {
        this.objective = [];
        for (const o of obj.objective || []) {
          this.objective.push(new ResearchStudyObjectiveComponent(o));
        }
      }
    }
  }

}

export class ResearchSubject extends DomainResource {
  public resourceType = 'ResearchSubject';
  public identifier?: Identifier[];
  public status: string;
  public period?: Period;
  public study: ResourceReference;
  public individual: ResourceReference;
  public assignedArm?: string;
  public actualArm?: string;
  public consent?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('study')) {
        this.study = new ResourceReference(obj.study);
      }
      if (obj.hasOwnProperty('individual')) {
        this.individual = new ResourceReference(obj.individual);
      }
      if (obj.hasOwnProperty('assignedArm')) {
        this.assignedArm = obj.assignedArm;
      }
      if (obj.hasOwnProperty('actualArm')) {
        this.actualArm = obj.actualArm;
      }
      if (obj.hasOwnProperty('consent')) {
        this.consent = new ResourceReference(obj.consent);
      }
    }
  }

}

export class RiskAssessmentPredictionComponent extends BackboneElement {
  public outcome?: CodeableConcept;
  public probability?: Element;
  public qualitativeRisk?: CodeableConcept;
  public relativeRisk?: number;
  public when?: Element;
  public rationale?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('outcome')) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.hasOwnProperty('probability')) {
        this.probability = new Element(obj.probability);
      }
      if (obj.hasOwnProperty('qualitativeRisk')) {
        this.qualitativeRisk = new CodeableConcept(obj.qualitativeRisk);
      }
      if (obj.hasOwnProperty('relativeRisk')) {
        this.relativeRisk = obj.relativeRisk;
      }
      if (obj.hasOwnProperty('when')) {
        this.when = new Element(obj.when);
      }
      if (obj.hasOwnProperty('rationale')) {
        this.rationale = obj.rationale;
      }
    }
  }

}

export class RiskAssessment extends DomainResource {
  public resourceType = 'RiskAssessment';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference;
  public parent?: ResourceReference;
  public status: string;
  public method?: CodeableConcept;
  public code?: CodeableConcept;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public condition?: ResourceReference;
  public performer?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public basis?: ResourceReference[];
  public prediction?: RiskAssessmentPredictionComponent[];
  public mitigation?: string;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = new ResourceReference(obj.basedOn);
      }
      if (obj.hasOwnProperty('parent')) {
        this.parent = new ResourceReference(obj.parent);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('occurrence')) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = new ResourceReference(obj.condition);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('basis')) {
        this.basis = [];
        for (const o of obj.basis || []) {
          this.basis.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('prediction')) {
        this.prediction = [];
        for (const o of obj.prediction || []) {
          this.prediction.push(new RiskAssessmentPredictionComponent(o));
        }
      }
      if (obj.hasOwnProperty('mitigation')) {
        this.mitigation = obj.mitigation;
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class SampledData extends Element {
  public origin: Quantity;
  public period: number;
  public factor?: number;
  public lowerLimit?: number;
  public upperLimit?: number;
  public dimensions: number;
  public data?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('origin')) {
        this.origin = new Quantity(obj.origin);
      }
      if (obj.hasOwnProperty('period')) {
        this.period = obj.period;
      }
      if (obj.hasOwnProperty('factor')) {
        this.factor = obj.factor;
      }
      if (obj.hasOwnProperty('lowerLimit')) {
        this.lowerLimit = obj.lowerLimit;
      }
      if (obj.hasOwnProperty('upperLimit')) {
        this.upperLimit = obj.upperLimit;
      }
      if (obj.hasOwnProperty('dimensions')) {
        this.dimensions = obj.dimensions;
      }
      if (obj.hasOwnProperty('data')) {
        this.data = obj.data;
      }
    }
  }

}

export class Schedule extends DomainResource {
  public resourceType = 'Schedule';
  public identifier?: Identifier[];
  public active?: boolean;
  public serviceCategory?: CodeableConcept[];
  public serviceType?: CodeableConcept[];
  public specialty?: CodeableConcept[];
  public actor: ResourceReference[];
  public planningHorizon?: Period;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('active')) {
        this.active = obj.active;
      }
      if (obj.hasOwnProperty('serviceCategory')) {
        this.serviceCategory = [];
        for (const o of obj.serviceCategory || []) {
          this.serviceCategory.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('serviceType')) {
        this.serviceType = [];
        for (const o of obj.serviceType || []) {
          this.serviceType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specialty')) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('actor')) {
        this.actor = [];
        for (const o of obj.actor || []) {
          this.actor.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('planningHorizon')) {
        this.planningHorizon = new Period(obj.planningHorizon);
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
    }
  }

}

export class SearchParameterComponentComponent extends BackboneElement {
  public definition: string;
  public expression: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('definition')) {
        this.definition = obj.definition;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
    }
  }

}

export class SearchParameter extends DomainResource {
  public resourceType = 'SearchParameter';
  public url: string;
  public version?: string;
  public name: string;
  public derivedFrom?: string;
  public status = 'active';
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public code: string;
  public base: string[];
  public type: string;
  public expression?: string;
  public xpath?: string;
  public xpathUsage?: string;
  public target?: string[];
  public multipleOr?: boolean;
  public multipleAnd?: boolean;
  public comparator?: string[];
  public modifier?: string[];
  public chain?: string[];
  public component?: SearchParameterComponentComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('derivedFrom')) {
        this.derivedFrom = obj.derivedFrom;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('base')) {
        this.base = obj.base;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
      if (obj.hasOwnProperty('xpath')) {
        this.xpath = obj.xpath;
      }
      if (obj.hasOwnProperty('xpathUsage')) {
        this.xpathUsage = obj.xpathUsage;
      }
      if (obj.hasOwnProperty('target')) {
        this.target = obj.target;
      }
      if (obj.hasOwnProperty('multipleOr')) {
        this.multipleOr = obj.multipleOr;
      }
      if (obj.hasOwnProperty('multipleAnd')) {
        this.multipleAnd = obj.multipleAnd;
      }
      if (obj.hasOwnProperty('comparator')) {
        this.comparator = obj.comparator;
      }
      if (obj.hasOwnProperty('modifier')) {
        this.modifier = obj.modifier;
      }
      if (obj.hasOwnProperty('chain')) {
        this.chain = obj.chain;
      }
      if (obj.hasOwnProperty('component')) {
        this.component = [];
        for (const o of obj.component || []) {
          this.component.push(new SearchParameterComponentComponent(o));
        }
      }
    }
  }

}

export class SequenceReferenceSeqComponent extends BackboneElement {
  public chromosome?: CodeableConcept;
  public genomeBuild?: string;
  public orientation?: string;
  public referenceSeqId?: CodeableConcept;
  public referenceSeqPointer?: ResourceReference;
  public referenceSeqString?: string;
  public strand?: string;
  public windowStart: number;
  public windowEnd: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('chromosome')) {
        this.chromosome = new CodeableConcept(obj.chromosome);
      }
      if (obj.hasOwnProperty('genomeBuild')) {
        this.genomeBuild = obj.genomeBuild;
      }
      if (obj.hasOwnProperty('orientation')) {
        this.orientation = obj.orientation;
      }
      if (obj.hasOwnProperty('referenceSeqId')) {
        this.referenceSeqId = new CodeableConcept(obj.referenceSeqId);
      }
      if (obj.hasOwnProperty('referenceSeqPointer')) {
        this.referenceSeqPointer = new ResourceReference(obj.referenceSeqPointer);
      }
      if (obj.hasOwnProperty('referenceSeqString')) {
        this.referenceSeqString = obj.referenceSeqString;
      }
      if (obj.hasOwnProperty('strand')) {
        this.strand = obj.strand;
      }
      if (obj.hasOwnProperty('windowStart')) {
        this.windowStart = obj.windowStart;
      }
      if (obj.hasOwnProperty('windowEnd')) {
        this.windowEnd = obj.windowEnd;
      }
    }
  }

}

export class SequenceVariantComponent extends BackboneElement {
  public start?: number;
  public end?: number;
  public observedAllele?: string;
  public referenceAllele?: string;
  public cigar?: string;
  public variantPointer?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('start')) {
        this.start = obj.start;
      }
      if (obj.hasOwnProperty('end')) {
        this.end = obj.end;
      }
      if (obj.hasOwnProperty('observedAllele')) {
        this.observedAllele = obj.observedAllele;
      }
      if (obj.hasOwnProperty('referenceAllele')) {
        this.referenceAllele = obj.referenceAllele;
      }
      if (obj.hasOwnProperty('cigar')) {
        this.cigar = obj.cigar;
      }
      if (obj.hasOwnProperty('variantPointer')) {
        this.variantPointer = new ResourceReference(obj.variantPointer);
      }
    }
  }

}

export class SequenceRocComponent extends BackboneElement {
  public score?: number[];
  public numTP?: number[];
  public numFP?: number[];
  public numFN?: number[];
  public precision?: number[];
  public sensitivity?: number[];
  public fMeasure?: number[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('score')) {
        this.score = obj.score;
      }
      if (obj.hasOwnProperty('numTP')) {
        this.numTP = obj.numTP;
      }
      if (obj.hasOwnProperty('numFP')) {
        this.numFP = obj.numFP;
      }
      if (obj.hasOwnProperty('numFN')) {
        this.numFN = obj.numFN;
      }
      if (obj.hasOwnProperty('precision')) {
        this.precision = obj.precision;
      }
      if (obj.hasOwnProperty('sensitivity')) {
        this.sensitivity = obj.sensitivity;
      }
      if (obj.hasOwnProperty('fMeasure')) {
        this.fMeasure = obj.fMeasure;
      }
    }
  }

}

export class SequenceQualityComponent extends BackboneElement {
  public type: string;
  public standardSequence?: CodeableConcept;
  public start?: number;
  public end?: number;
  public score?: Quantity;
  public method?: CodeableConcept;
  public truthTP?: number;
  public queryTP?: number;
  public truthFN?: number;
  public queryFP?: number;
  public gtFP?: number;
  public precision?: number;
  public recall?: number;
  public fScore?: number;
  public roc?: SequenceRocComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('standardSequence')) {
        this.standardSequence = new CodeableConcept(obj.standardSequence);
      }
      if (obj.hasOwnProperty('start')) {
        this.start = obj.start;
      }
      if (obj.hasOwnProperty('end')) {
        this.end = obj.end;
      }
      if (obj.hasOwnProperty('score')) {
        this.score = new Quantity(obj.score);
      }
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.hasOwnProperty('truthTP')) {
        this.truthTP = obj.truthTP;
      }
      if (obj.hasOwnProperty('queryTP')) {
        this.queryTP = obj.queryTP;
      }
      if (obj.hasOwnProperty('truthFN')) {
        this.truthFN = obj.truthFN;
      }
      if (obj.hasOwnProperty('queryFP')) {
        this.queryFP = obj.queryFP;
      }
      if (obj.hasOwnProperty('gtFP')) {
        this.gtFP = obj.gtFP;
      }
      if (obj.hasOwnProperty('precision')) {
        this.precision = obj.precision;
      }
      if (obj.hasOwnProperty('recall')) {
        this.recall = obj.recall;
      }
      if (obj.hasOwnProperty('fScore')) {
        this.fScore = obj.fScore;
      }
      if (obj.hasOwnProperty('roc')) {
        this.roc = new SequenceRocComponent(obj.roc);
      }
    }
  }

}

export class SequenceRepositoryComponent extends BackboneElement {
  public type: string;
  public url?: string;
  public name?: string;
  public datasetId?: string;
  public variantsetId?: string;
  public readsetId?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('datasetId')) {
        this.datasetId = obj.datasetId;
      }
      if (obj.hasOwnProperty('variantsetId')) {
        this.variantsetId = obj.variantsetId;
      }
      if (obj.hasOwnProperty('readsetId')) {
        this.readsetId = obj.readsetId;
      }
    }
  }

}

export class SequenceOuterComponent extends BackboneElement {
  public start?: number;
  public end?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('start')) {
        this.start = obj.start;
      }
      if (obj.hasOwnProperty('end')) {
        this.end = obj.end;
      }
    }
  }

}

export class SequenceInnerComponent extends BackboneElement {
  public start?: number;
  public end?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('start')) {
        this.start = obj.start;
      }
      if (obj.hasOwnProperty('end')) {
        this.end = obj.end;
      }
    }
  }

}

export class SequenceStructureVariantComponent extends BackboneElement {
  public precision?: string;
  public reportedaCGHRatio?: number;
  public length?: number;
  public outer?: SequenceOuterComponent;
  public inner?: SequenceInnerComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('precision')) {
        this.precision = obj.precision;
      }
      if (obj.hasOwnProperty('reportedaCGHRatio')) {
        this.reportedaCGHRatio = obj.reportedaCGHRatio;
      }
      if (obj.hasOwnProperty('length')) {
        this.length = obj.length;
      }
      if (obj.hasOwnProperty('outer')) {
        this.outer = new SequenceOuterComponent(obj.outer);
      }
      if (obj.hasOwnProperty('inner')) {
        this.inner = new SequenceInnerComponent(obj.inner);
      }
    }
  }

}

export class Sequence extends DomainResource {
  public resourceType = 'Sequence';
  public identifier?: Identifier[];
  public type?: string;
  public coordinateSystem: number;
  public patient?: ResourceReference;
  public specimen?: ResourceReference;
  public device?: ResourceReference;
  public performer?: ResourceReference;
  public quantity?: Quantity;
  public referenceSeq?: SequenceReferenceSeqComponent;
  public variant?: SequenceVariantComponent[];
  public observedSeq?: string;
  public quality?: SequenceQualityComponent[];
  public readCoverage?: number;
  public repository?: SequenceRepositoryComponent[];
  public pointer?: ResourceReference[];
  public structureVariant?: SequenceStructureVariantComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('coordinateSystem')) {
        this.coordinateSystem = obj.coordinateSystem;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('specimen')) {
        this.specimen = new ResourceReference(obj.specimen);
      }
      if (obj.hasOwnProperty('device')) {
        this.device = new ResourceReference(obj.device);
      }
      if (obj.hasOwnProperty('performer')) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.hasOwnProperty('referenceSeq')) {
        this.referenceSeq = new SequenceReferenceSeqComponent(obj.referenceSeq);
      }
      if (obj.hasOwnProperty('variant')) {
        this.variant = [];
        for (const o of obj.variant || []) {
          this.variant.push(new SequenceVariantComponent(o));
        }
      }
      if (obj.hasOwnProperty('observedSeq')) {
        this.observedSeq = obj.observedSeq;
      }
      if (obj.hasOwnProperty('quality')) {
        this.quality = [];
        for (const o of obj.quality || []) {
          this.quality.push(new SequenceQualityComponent(o));
        }
      }
      if (obj.hasOwnProperty('readCoverage')) {
        this.readCoverage = obj.readCoverage;
      }
      if (obj.hasOwnProperty('repository')) {
        this.repository = [];
        for (const o of obj.repository || []) {
          this.repository.push(new SequenceRepositoryComponent(o));
        }
      }
      if (obj.hasOwnProperty('pointer')) {
        this.pointer = [];
        for (const o of obj.pointer || []) {
          this.pointer.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('structureVariant')) {
        this.structureVariant = [];
        for (const o of obj.structureVariant || []) {
          this.structureVariant.push(new SequenceStructureVariantComponent(o));
        }
      }
    }
  }

}

export class Slot extends DomainResource {
  public resourceType = 'Slot';
  public identifier?: Identifier[];
  public serviceCategory?: CodeableConcept[];
  public serviceType?: CodeableConcept[];
  public specialty?: CodeableConcept[];
  public appointmentType?: CodeableConcept;
  public schedule: ResourceReference;
  public status: string;
  public start: Date;
  public end: Date;
  public overbooked?: boolean;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('serviceCategory')) {
        this.serviceCategory = [];
        for (const o of obj.serviceCategory || []) {
          this.serviceCategory.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('serviceType')) {
        this.serviceType = [];
        for (const o of obj.serviceType || []) {
          this.serviceType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specialty')) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('appointmentType')) {
        this.appointmentType = new CodeableConcept(obj.appointmentType);
      }
      if (obj.hasOwnProperty('schedule')) {
        this.schedule = new ResourceReference(obj.schedule);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('start')) {
        this.start = obj.start;
      }
      if (obj.hasOwnProperty('end')) {
        this.end = obj.end;
      }
      if (obj.hasOwnProperty('overbooked')) {
        this.overbooked = obj.overbooked;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
    }
  }

}

export class SpecimenCollectionComponent extends BackboneElement {
  public collector?: ResourceReference;
  public collected?: Element;
  public duration?: Duration;
  public quantity?: SimpleQuantity;
  public method?: CodeableConcept;
  public bodySite?: CodeableConcept;
  public fastingStatus?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('collector')) {
        this.collector = new ResourceReference(obj.collector);
      }
      if (obj.hasOwnProperty('collected')) {
        this.collected = new Element(obj.collected);
      }
      if (obj.hasOwnProperty('duration')) {
        this.duration = new Duration(obj.duration);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.hasOwnProperty('bodySite')) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.hasOwnProperty('fastingStatus')) {
        this.fastingStatus = new Element(obj.fastingStatus);
      }
    }
  }

}

export class SpecimenProcessingComponent extends BackboneElement {
  public description?: string;
  public procedure?: CodeableConcept;
  public additive?: ResourceReference[];
  public time?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('procedure')) {
        this.procedure = new CodeableConcept(obj.procedure);
      }
      if (obj.hasOwnProperty('additive')) {
        this.additive = [];
        for (const o of obj.additive || []) {
          this.additive.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('time')) {
        this.time = new Element(obj.time);
      }
    }
  }

}

export class SpecimenContainerComponent extends BackboneElement {
  public identifier?: Identifier[];
  public description?: string;
  public type?: CodeableConcept;
  public capacity?: SimpleQuantity;
  public specimenQuantity?: SimpleQuantity;
  public additive?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('capacity')) {
        this.capacity = new SimpleQuantity(obj.capacity);
      }
      if (obj.hasOwnProperty('specimenQuantity')) {
        this.specimenQuantity = new SimpleQuantity(obj.specimenQuantity);
      }
      if (obj.hasOwnProperty('additive')) {
        this.additive = new Element(obj.additive);
      }
    }
  }

}

export class Specimen extends DomainResource {
  public resourceType = 'Specimen';
  public identifier?: Identifier[];
  public accessionIdentifier?: Identifier;
  public status?: string;
  public type?: CodeableConcept;
  public subject?: ResourceReference;
  public receivedTime?: Date;
  public parent?: ResourceReference[];
  public request?: ResourceReference[];
  public collection?: SpecimenCollectionComponent;
  public processing?: SpecimenProcessingComponent[];
  public container?: SpecimenContainerComponent[];
  public condition?: CodeableConcept[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('accessionIdentifier')) {
        this.accessionIdentifier = new Identifier(obj.accessionIdentifier);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('subject')) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.hasOwnProperty('receivedTime')) {
        this.receivedTime = obj.receivedTime;
      }
      if (obj.hasOwnProperty('parent')) {
        this.parent = [];
        for (const o of obj.parent || []) {
          this.parent.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('request')) {
        this.request = [];
        for (const o of obj.request || []) {
          this.request.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('collection')) {
        this.collection = new SpecimenCollectionComponent(obj.collection);
      }
      if (obj.hasOwnProperty('processing')) {
        this.processing = [];
        for (const o of obj.processing || []) {
          this.processing.push(new SpecimenProcessingComponent(o));
        }
      }
      if (obj.hasOwnProperty('container')) {
        this.container = [];
        for (const o of obj.container || []) {
          this.container.push(new SpecimenContainerComponent(o));
        }
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = [];
        for (const o of obj.condition || []) {
          this.condition.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class SpecimenDefinitionContainerAdditiveComponent extends BackboneElement {
  public additive: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('additive')) {
        this.additive = new Element(obj.additive);
      }
    }
  }

}

export class SpecimenDefinitionHandlingComponent extends BackboneElement {
  public conditionSet?: CodeableConcept;
  public tempRange?: Range;
  public maxDuration?: Duration;
  public lightExposure?: string;
  public instruction?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('conditionSet')) {
        this.conditionSet = new CodeableConcept(obj.conditionSet);
      }
      if (obj.hasOwnProperty('tempRange')) {
        this.tempRange = new Range(obj.tempRange);
      }
      if (obj.hasOwnProperty('maxDuration')) {
        this.maxDuration = new Duration(obj.maxDuration);
      }
      if (obj.hasOwnProperty('lightExposure')) {
        this.lightExposure = obj.lightExposure;
      }
      if (obj.hasOwnProperty('instruction')) {
        this.instruction = obj.instruction;
      }
    }
  }

}

export class SpecimenDefinitionSpecimenToLabComponent extends BackboneElement {
  public isDerived: boolean;
  public type?: CodeableConcept;
  public preference: string;
  public containerMaterial?: CodeableConcept;
  public containerType?: CodeableConcept;
  public containerCap?: CodeableConcept;
  public containerDescription?: string;
  public containerCapacity?: SimpleQuantity;
  public containerMinimumVolume?: SimpleQuantity;
  public containerAdditive?: SpecimenDefinitionContainerAdditiveComponent[];
  public containerPreparation?: string;
  public requirement?: string;
  public retentionTime?: Duration;
  public rejectionCriterion?: CodeableConcept[];
  public handling?: SpecimenDefinitionHandlingComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('isDerived')) {
        this.isDerived = obj.isDerived;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('preference')) {
        this.preference = obj.preference;
      }
      if (obj.hasOwnProperty('containerMaterial')) {
        this.containerMaterial = new CodeableConcept(obj.containerMaterial);
      }
      if (obj.hasOwnProperty('containerType')) {
        this.containerType = new CodeableConcept(obj.containerType);
      }
      if (obj.hasOwnProperty('containerCap')) {
        this.containerCap = new CodeableConcept(obj.containerCap);
      }
      if (obj.hasOwnProperty('containerDescription')) {
        this.containerDescription = obj.containerDescription;
      }
      if (obj.hasOwnProperty('containerCapacity')) {
        this.containerCapacity = new SimpleQuantity(obj.containerCapacity);
      }
      if (obj.hasOwnProperty('containerMinimumVolume')) {
        this.containerMinimumVolume = new SimpleQuantity(obj.containerMinimumVolume);
      }
      if (obj.hasOwnProperty('containerAdditive')) {
        this.containerAdditive = [];
        for (const o of obj.containerAdditive || []) {
          this.containerAdditive.push(new SpecimenDefinitionContainerAdditiveComponent(o));
        }
      }
      if (obj.hasOwnProperty('containerPreparation')) {
        this.containerPreparation = obj.containerPreparation;
      }
      if (obj.hasOwnProperty('requirement')) {
        this.requirement = obj.requirement;
      }
      if (obj.hasOwnProperty('retentionTime')) {
        this.retentionTime = new Duration(obj.retentionTime);
      }
      if (obj.hasOwnProperty('rejectionCriterion')) {
        this.rejectionCriterion = [];
        for (const o of obj.rejectionCriterion || []) {
          this.rejectionCriterion.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('handling')) {
        this.handling = [];
        for (const o of obj.handling || []) {
          this.handling.push(new SpecimenDefinitionHandlingComponent(o));
        }
      }
    }
  }

}

export class SpecimenDefinition extends DomainResource {
  public resourceType = 'SpecimenDefinition';
  public identifier?: Identifier;
  public typeCollected?: CodeableConcept;
  public patientPreparation?: string;
  public timeAspect?: string;
  public collection?: CodeableConcept[];
  public specimenToLab?: SpecimenDefinitionSpecimenToLabComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('typeCollected')) {
        this.typeCollected = new CodeableConcept(obj.typeCollected);
      }
      if (obj.hasOwnProperty('patientPreparation')) {
        this.patientPreparation = obj.patientPreparation;
      }
      if (obj.hasOwnProperty('timeAspect')) {
        this.timeAspect = obj.timeAspect;
      }
      if (obj.hasOwnProperty('collection')) {
        this.collection = [];
        for (const o of obj.collection || []) {
          this.collection.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('specimenToLab')) {
        this.specimenToLab = [];
        for (const o of obj.specimenToLab || []) {
          this.specimenToLab.push(new SpecimenDefinitionSpecimenToLabComponent(o));
        }
      }
    }
  }

}

export class StructureMapStructureComponent extends BackboneElement {
  public url: string;
  public mode: string;
  public alias?: string;
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('alias')) {
        this.alias = obj.alias;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class StructureMapInputComponent extends BackboneElement {
  public name: string;
  public type?: string;
  public mode: string;
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('mode')) {
        this.mode = obj.mode;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class StructureMapSourceComponent extends BackboneElement {
  public context: string;
  public min?: number;
  public max?: string;
  public type?: string;
  public defaultValue?: Element;
  public element?: string;
  public listMode?: string;
  public variable?: string;
  public condition?: string;
  public check?: string;
  public logMessage?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('context')) {
        this.context = obj.context;
      }
      if (obj.hasOwnProperty('min')) {
        this.min = obj.min;
      }
      if (obj.hasOwnProperty('max')) {
        this.max = obj.max;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('defaultValue')) {
        this.defaultValue = new Element(obj.defaultValue);
      }
      if (obj.hasOwnProperty('element')) {
        this.element = obj.element;
      }
      if (obj.hasOwnProperty('listMode')) {
        this.listMode = obj.listMode;
      }
      if (obj.hasOwnProperty('variable')) {
        this.variable = obj.variable;
      }
      if (obj.hasOwnProperty('condition')) {
        this.condition = obj.condition;
      }
      if (obj.hasOwnProperty('check')) {
        this.check = obj.check;
      }
      if (obj.hasOwnProperty('logMessage')) {
        this.logMessage = obj.logMessage;
      }
    }
  }

}

export class StructureMapParameterComponent extends BackboneElement {
  public value: Element;      // TODO: Replace with parameters for each option

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class StructureMapTargetComponent extends BackboneElement {
  public context?: string;
  public contextType?: string;
  public element?: string;
  public variable?: string;
  public listMode?: string[];
  public listRuleId?: string;
  public transform?: string;
  public parameter?: StructureMapParameterComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('context')) {
        this.context = obj.context;
      }
      if (obj.hasOwnProperty('contextType')) {
        this.contextType = obj.contextType;
      }
      if (obj.hasOwnProperty('element')) {
        this.element = obj.element;
      }
      if (obj.hasOwnProperty('variable')) {
        this.variable = obj.variable;
      }
      if (obj.hasOwnProperty('listMode')) {
        this.listMode = obj.listMode;
      }
      if (obj.hasOwnProperty('listRuleId')) {
        this.listRuleId = obj.listRuleId;
      }
      if (obj.hasOwnProperty('transform')) {
        this.transform = obj.transform;
      }
      if (obj.hasOwnProperty('parameter')) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new StructureMapParameterComponent(o));
        }
      }
    }
  }

}

export class StructureMapDependentComponent extends BackboneElement {
  public name: string;
  public variable: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('variable')) {
        this.variable = obj.variable;
      }
    }
  }

}

export class StructureMapRuleComponent extends BackboneElement {
  public name: string;
  public source: StructureMapSourceComponent[];
  public target?: StructureMapTargetComponent[];
  public rule?: StructureMapRuleComponent[];
  public dependent?: StructureMapDependentComponent[];
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('source')) {
        this.source = [];
        for (const o of obj.source || []) {
          this.source.push(new StructureMapSourceComponent(o));
        }
      }
      if (obj.hasOwnProperty('target')) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new StructureMapTargetComponent(o));
        }
      }
      if (obj.hasOwnProperty('rule')) {
        this.rule = [];
        for (const o of obj.rule || []) {
          this.rule.push(new StructureMapRuleComponent(o));
        }
      }
      if (obj.hasOwnProperty('dependent')) {
        this.dependent = [];
        for (const o of obj.dependent || []) {
          this.dependent.push(new StructureMapDependentComponent(o));
        }
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class StructureMapGroupComponent extends BackboneElement {
  public name: string;
  public extends?: string;
  public typeMode: string;
  public documentation?: string;
  public input: StructureMapInputComponent[];
  public rule: StructureMapRuleComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('extends')) {
        this.extends = obj.extends;
      }
      if (obj.hasOwnProperty('typeMode')) {
        this.typeMode = obj.typeMode;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
      if (obj.hasOwnProperty('input')) {
        this.input = [];
        for (const o of obj.input || []) {
          this.input.push(new StructureMapInputComponent(o));
        }
      }
      if (obj.hasOwnProperty('rule')) {
        this.rule = [];
        for (const o of obj.rule || []) {
          this.rule.push(new StructureMapRuleComponent(o));
        }
      }
    }
  }

}

export class StructureMap extends DomainResource {
  public resourceType = 'StructureMap';
  public url: string;
  public identifier?: Identifier[];
  public version?: string;
  public name: string;
  public title?: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public structure?: StructureMapStructureComponent[];
  public import?: string[];
  public group: StructureMapGroupComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('structure')) {
        this.structure = [];
        for (const o of obj.structure || []) {
          this.structure.push(new StructureMapStructureComponent(o));
        }
      }
      if (obj.hasOwnProperty('import')) {
        this.import = obj.import;
      }
      if (obj.hasOwnProperty('group')) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new StructureMapGroupComponent(o));
        }
      }
    }
  }

}

export class SubscriptionChannelComponent extends BackboneElement {
  public type: string;
  public endpoint?: string;
  public payload?: string;
  public header?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('endpoint')) {
        this.endpoint = obj.endpoint;
      }
      if (obj.hasOwnProperty('payload')) {
        this.payload = obj.payload;
      }
      if (obj.hasOwnProperty('header')) {
        this.header = obj.header;
      }
    }
  }

}

export class Subscription extends DomainResource {
  public resourceType = 'Subscription';
  public status: string;
  public contact?: ContactPoint[];
  public end?: Date;
  public reason: string;
  public criteria: string;
  public error?: string;
  public channel: SubscriptionChannelComponent;
  public tag?: Coding[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactPoint(o));
        }
      }
      if (obj.hasOwnProperty('end')) {
        this.end = obj.end;
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = obj.reason;
      }
      if (obj.hasOwnProperty('criteria')) {
        this.criteria = obj.criteria;
      }
      if (obj.hasOwnProperty('error')) {
        this.error = obj.error;
      }
      if (obj.hasOwnProperty('channel')) {
        this.channel = new SubscriptionChannelComponent(obj.channel);
      }
      if (obj.hasOwnProperty('tag')) {
        this.tag = [];
        for (const o of obj.tag || []) {
          this.tag.push(new Coding(o));
        }
      }
    }
  }

}

export class SubstanceInstanceComponent extends BackboneElement {
  public identifier?: Identifier;
  public expiry?: Date;
  public quantity?: SimpleQuantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('expiry')) {
        this.expiry = obj.expiry;
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
    }
  }

}

export class SubstanceIngredientComponent extends BackboneElement {
  public quantity?: Ratio;
  public substance: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new Ratio(obj.quantity);
      }
      if (obj.hasOwnProperty('substance')) {
        this.substance = new Element(obj.substance);
      }
    }
  }

}

export class Substance extends DomainResource {
  public resourceType = 'Substance';
  public identifier?: Identifier[];
  public status?: string;
  public category?: CodeableConcept[];
  public code: CodeableConcept;
  public description?: string;
  public instance?: SubstanceInstanceComponent[];
  public ingredient?: SubstanceIngredientComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('instance')) {
        this.instance = [];
        for (const o of obj.instance || []) {
          this.instance.push(new SubstanceInstanceComponent(o));
        }
      }
      if (obj.hasOwnProperty('ingredient')) {
        this.ingredient = [];
        for (const o of obj.ingredient || []) {
          this.ingredient.push(new SubstanceIngredientComponent(o));
        }
      }
    }
  }

}

export class SubstanceAmountReferenceRangeComponent extends Element {
  public lowLimit?: Quantity;
  public highLimit?: Quantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('lowLimit')) {
        this.lowLimit = new Quantity(obj.lowLimit);
      }
      if (obj.hasOwnProperty('highLimit')) {
        this.highLimit = new Quantity(obj.highLimit);
      }
    }
  }

}

export class SubstanceAmount extends BackboneElement {
  public amount?: Element;
  public amountType?: CodeableConcept;
  public amountText?: string;
  public referenceRange?: SubstanceAmountReferenceRangeComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Element(obj.amount);
      }
      if (obj.hasOwnProperty('amountType')) {
        this.amountType = new CodeableConcept(obj.amountType);
      }
      if (obj.hasOwnProperty('amountText')) {
        this.amountText = obj.amountText;
      }
      if (obj.hasOwnProperty('referenceRange')) {
        this.referenceRange = new SubstanceAmountReferenceRangeComponent(obj.referenceRange);
      }
    }
  }

}

export class SubstanceMoiety extends BackboneElement {
  public role?: CodeableConcept;
  public identifier?: Identifier;
  public name?: string;
  public stereochemistry?: CodeableConcept;
  public opticalActivity?: CodeableConcept;
  public molecularFormula?: string;
  public amount?: SubstanceAmount;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('stereochemistry')) {
        this.stereochemistry = new CodeableConcept(obj.stereochemistry);
      }
      if (obj.hasOwnProperty('opticalActivity')) {
        this.opticalActivity = new CodeableConcept(obj.opticalActivity);
      }
      if (obj.hasOwnProperty('molecularFormula')) {
        this.molecularFormula = obj.molecularFormula;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new SubstanceAmount(obj.amount);
      }
    }
  }

}

export class SubstancePolymerStartingMaterialComponent extends BackboneElement {
  public material?: CodeableConcept;
  public type?: CodeableConcept;
  public isDefining?: boolean;
  public amount?: SubstanceAmount;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('material')) {
        this.material = new CodeableConcept(obj.material);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('isDefining')) {
        this.isDefining = obj.isDefining;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new SubstanceAmount(obj.amount);
      }
    }
  }

}

export class SubstancePolymerMonomerSetComponent extends BackboneElement {
  public ratioType?: CodeableConcept;
  public startingMaterial?: SubstancePolymerStartingMaterialComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('ratioType')) {
        this.ratioType = new CodeableConcept(obj.ratioType);
      }
      if (obj.hasOwnProperty('startingMaterial')) {
        this.startingMaterial = [];
        for (const o of obj.startingMaterial || []) {
          this.startingMaterial.push(new SubstancePolymerStartingMaterialComponent(o));
        }
      }
    }
  }

}

export class SubstancePolymerDegreeOfPolymerisationComponent extends BackboneElement {
  public degree?: CodeableConcept;
  public amount?: SubstanceAmount;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('degree')) {
        this.degree = new CodeableConcept(obj.degree);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new SubstanceAmount(obj.amount);
      }
    }
  }

}

export class SubstancePolymerStructuralRepresentationComponent extends BackboneElement {
  public type?: CodeableConcept;
  public representation?: string;
  public attachment?: Attachment;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('representation')) {
        this.representation = obj.representation;
      }
      if (obj.hasOwnProperty('attachment')) {
        this.attachment = new Attachment(obj.attachment);
      }
    }
  }

}

export class SubstancePolymerRepeatUnitComponent extends BackboneElement {
  public orientationOfPolymerisation?: CodeableConcept;
  public repeatUnit?: string;
  public amount?: SubstanceAmount;
  public degreeOfPolymerisation?: SubstancePolymerDegreeOfPolymerisationComponent[];
  public structuralRepresentation?: SubstancePolymerStructuralRepresentationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('orientationOfPolymerisation')) {
        this.orientationOfPolymerisation = new CodeableConcept(obj.orientationOfPolymerisation);
      }
      if (obj.hasOwnProperty('repeatUnit')) {
        this.repeatUnit = obj.repeatUnit;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new SubstanceAmount(obj.amount);
      }
      if (obj.hasOwnProperty('degreeOfPolymerisation')) {
        this.degreeOfPolymerisation = [];
        for (const o of obj.degreeOfPolymerisation || []) {
          this.degreeOfPolymerisation.push(new SubstancePolymerDegreeOfPolymerisationComponent(o));
        }
      }
      if (obj.hasOwnProperty('structuralRepresentation')) {
        this.structuralRepresentation = [];
        for (const o of obj.structuralRepresentation || []) {
          this.structuralRepresentation.push(new SubstancePolymerStructuralRepresentationComponent(o));
        }
      }
    }
  }

}

export class SubstancePolymerRepeatComponent extends BackboneElement {
  public numberOfUnits?: number;
  public averageMolecularFormula?: string;
  public repeatUnitAmountType?: CodeableConcept;
  public repeatUnit?: SubstancePolymerRepeatUnitComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('numberOfUnits')) {
        this.numberOfUnits = obj.numberOfUnits;
      }
      if (obj.hasOwnProperty('averageMolecularFormula')) {
        this.averageMolecularFormula = obj.averageMolecularFormula;
      }
      if (obj.hasOwnProperty('repeatUnitAmountType')) {
        this.repeatUnitAmountType = new CodeableConcept(obj.repeatUnitAmountType);
      }
      if (obj.hasOwnProperty('repeatUnit')) {
        this.repeatUnit = [];
        for (const o of obj.repeatUnit || []) {
          this.repeatUnit.push(new SubstancePolymerRepeatUnitComponent(o));
        }
      }
    }
  }

}

export class SubstancePolymer extends DomainResource {
  public resourceType = 'SubstancePolymer';
  public class?: CodeableConcept;
  public geometry?: CodeableConcept;
  public copolymerConnectivity?: CodeableConcept[];
  public modification?: string[];
  public monomerSet?: SubstancePolymerMonomerSetComponent[];
  public repeat?: SubstancePolymerRepeatComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('class')) {
        this.class = new CodeableConcept(obj.class);
      }
      if (obj.hasOwnProperty('geometry')) {
        this.geometry = new CodeableConcept(obj.geometry);
      }
      if (obj.hasOwnProperty('copolymerConnectivity')) {
        this.copolymerConnectivity = [];
        for (const o of obj.copolymerConnectivity || []) {
          this.copolymerConnectivity.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('modification')) {
        this.modification = obj.modification;
      }
      if (obj.hasOwnProperty('monomerSet')) {
        this.monomerSet = [];
        for (const o of obj.monomerSet || []) {
          this.monomerSet.push(new SubstancePolymerMonomerSetComponent(o));
        }
      }
      if (obj.hasOwnProperty('repeat')) {
        this.repeat = [];
        for (const o of obj.repeat || []) {
          this.repeat.push(new SubstancePolymerRepeatComponent(o));
        }
      }
    }
  }

}

export class SubstanceReferenceInformationGeneComponent extends BackboneElement {
  public geneSequenceOrigin?: CodeableConcept;
  public gene?: CodeableConcept;
  public source?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('geneSequenceOrigin')) {
        this.geneSequenceOrigin = new CodeableConcept(obj.geneSequenceOrigin);
      }
      if (obj.hasOwnProperty('gene')) {
        this.gene = new CodeableConcept(obj.gene);
      }
      if (obj.hasOwnProperty('source')) {
        this.source = [];
        for (const o of obj.source || []) {
          this.source.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class SubstanceReferenceInformationGeneElementComponent extends BackboneElement {
  public type?: CodeableConcept;
  public element?: Identifier;
  public source?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('element')) {
        this.element = new Identifier(obj.element);
      }
      if (obj.hasOwnProperty('source')) {
        this.source = [];
        for (const o of obj.source || []) {
          this.source.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class SubstanceReferenceInformationClassificationComponent extends BackboneElement {
  public domain?: CodeableConcept;
  public classification?: CodeableConcept;
  public subtype?: CodeableConcept[];
  public source?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('domain')) {
        this.domain = new CodeableConcept(obj.domain);
      }
      if (obj.hasOwnProperty('classification')) {
        this.classification = new CodeableConcept(obj.classification);
      }
      if (obj.hasOwnProperty('subtype')) {
        this.subtype = [];
        for (const o of obj.subtype || []) {
          this.subtype.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('source')) {
        this.source = [];
        for (const o of obj.source || []) {
          this.source.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class SubstanceReferenceInformationRelationshipComponent extends BackboneElement {
  public substance?: Element;
  public relationship?: CodeableConcept;
  public interaction?: CodeableConcept;
  public isDefining?: boolean;
  public amount?: Element;
  public amountType?: CodeableConcept;
  public amountText?: string;
  public source?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('substance')) {
        this.substance = new Element(obj.substance);
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = new CodeableConcept(obj.relationship);
      }
      if (obj.hasOwnProperty('interaction')) {
        this.interaction = new CodeableConcept(obj.interaction);
      }
      if (obj.hasOwnProperty('isDefining')) {
        this.isDefining = obj.isDefining;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Element(obj.amount);
      }
      if (obj.hasOwnProperty('amountType')) {
        this.amountType = new CodeableConcept(obj.amountType);
      }
      if (obj.hasOwnProperty('amountText')) {
        this.amountText = obj.amountText;
      }
      if (obj.hasOwnProperty('source')) {
        this.source = [];
        for (const o of obj.source || []) {
          this.source.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class SubstanceReferenceInformationTargetComponent extends BackboneElement {
  public target?: Identifier;
  public type?: CodeableConcept;
  public interaction?: CodeableConcept;
  public organism?: CodeableConcept;
  public organismType?: CodeableConcept;
  public source?: ResourceReference[];
  public amount?: Element;
  public amountType?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('target')) {
        this.target = new Identifier(obj.target);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('interaction')) {
        this.interaction = new CodeableConcept(obj.interaction);
      }
      if (obj.hasOwnProperty('organism')) {
        this.organism = new CodeableConcept(obj.organism);
      }
      if (obj.hasOwnProperty('organismType')) {
        this.organismType = new CodeableConcept(obj.organismType);
      }
      if (obj.hasOwnProperty('source')) {
        this.source = [];
        for (const o of obj.source || []) {
          this.source.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = new Element(obj.amount);
      }
      if (obj.hasOwnProperty('amountType')) {
        this.amountType = new CodeableConcept(obj.amountType);
      }
    }
  }

}

export class SubstanceReferenceInformation extends DomainResource {
  public resourceType = 'SubstanceReferenceInformation';
  public comment?: string;
  public gene?: SubstanceReferenceInformationGeneComponent[];
  public geneElement?: SubstanceReferenceInformationGeneElementComponent[];
  public classification?: SubstanceReferenceInformationClassificationComponent[];
  public relationship?: SubstanceReferenceInformationRelationshipComponent[];
  public target?: SubstanceReferenceInformationTargetComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('gene')) {
        this.gene = [];
        for (const o of obj.gene || []) {
          this.gene.push(new SubstanceReferenceInformationGeneComponent(o));
        }
      }
      if (obj.hasOwnProperty('geneElement')) {
        this.geneElement = [];
        for (const o of obj.geneElement || []) {
          this.geneElement.push(new SubstanceReferenceInformationGeneElementComponent(o));
        }
      }
      if (obj.hasOwnProperty('classification')) {
        this.classification = [];
        for (const o of obj.classification || []) {
          this.classification.push(new SubstanceReferenceInformationClassificationComponent(o));
        }
      }
      if (obj.hasOwnProperty('relationship')) {
        this.relationship = [];
        for (const o of obj.relationship || []) {
          this.relationship.push(new SubstanceReferenceInformationRelationshipComponent(o));
        }
      }
      if (obj.hasOwnProperty('target')) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new SubstanceReferenceInformationTargetComponent(o));
        }
      }
    }
  }

}

export class SubstanceSpecificationMoietyComponent extends BackboneElement {
  public role?: CodeableConcept;
  public identifier?: Identifier;
  public name?: string;
  public stereochemistry?: CodeableConcept;
  public opticalActivity?: CodeableConcept;
  public molecularFormula?: string;
  public amount?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('role')) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('stereochemistry')) {
        this.stereochemistry = new CodeableConcept(obj.stereochemistry);
      }
      if (obj.hasOwnProperty('opticalActivity')) {
        this.opticalActivity = new CodeableConcept(obj.opticalActivity);
      }
      if (obj.hasOwnProperty('molecularFormula')) {
        this.molecularFormula = obj.molecularFormula;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = obj.amount;
      }
    }
  }

}

export class SubstanceSpecificationPropertyComponent extends BackboneElement {
  public type?: CodeableConcept;
  public name?: CodeableConcept;
  public parameters?: string;
  public substanceId?: Identifier;
  public substanceName?: string;
  public amount?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = new CodeableConcept(obj.name);
      }
      if (obj.hasOwnProperty('parameters')) {
        this.parameters = obj.parameters;
      }
      if (obj.hasOwnProperty('substanceId')) {
        this.substanceId = new Identifier(obj.substanceId);
      }
      if (obj.hasOwnProperty('substanceName')) {
        this.substanceName = obj.substanceName;
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = obj.amount;
      }
    }
  }

}

export class SubstanceSpecificationMolecularWeightComponent extends BackboneElement {
  public method?: CodeableConcept;
  public type?: CodeableConcept;
  public amount?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = obj.amount;
      }
    }
  }

}

export class SubstanceSpecificationIsotopeComponent extends BackboneElement {
  public nuclideId?: Identifier;
  public nuclideName?: CodeableConcept;
  public substitutionType?: CodeableConcept;
  public nuclideHalfLife?: Quantity;
  public amount?: string;
  public molecularWeight?: SubstanceSpecificationMolecularWeightComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('nuclideId')) {
        this.nuclideId = new Identifier(obj.nuclideId);
      }
      if (obj.hasOwnProperty('nuclideName')) {
        this.nuclideName = new CodeableConcept(obj.nuclideName);
      }
      if (obj.hasOwnProperty('substitutionType')) {
        this.substitutionType = new CodeableConcept(obj.substitutionType);
      }
      if (obj.hasOwnProperty('nuclideHalfLife')) {
        this.nuclideHalfLife = new Quantity(obj.nuclideHalfLife);
      }
      if (obj.hasOwnProperty('amount')) {
        this.amount = obj.amount;
      }
      if (obj.hasOwnProperty('molecularWeight')) {
        this.molecularWeight = new SubstanceSpecificationMolecularWeightComponent(obj.molecularWeight);
      }
    }
  }

}

export class SubstanceSpecificationStructuralRepresentationComponent extends BackboneElement {
  public type?: CodeableConcept;
  public representation?: string;
  public attachment?: Attachment;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('representation')) {
        this.representation = obj.representation;
      }
      if (obj.hasOwnProperty('attachment')) {
        this.attachment = new Attachment(obj.attachment);
      }
    }
  }

}

export class SubstanceSpecificationStructureComponent extends BackboneElement {
  public stereochemistry?: CodeableConcept;
  public opticalActivity?: CodeableConcept;
  public molecularFormula?: string;
  public molecularFormulaByMoiety?: string;
  public isotope?: SubstanceSpecificationIsotopeComponent[];
  public molecularWeight?: SubstanceSpecificationMolecularWeightComponent;
  public referenceSource?: ResourceReference[];
  public structuralRepresentation?: SubstanceSpecificationStructuralRepresentationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('stereochemistry')) {
        this.stereochemistry = new CodeableConcept(obj.stereochemistry);
      }
      if (obj.hasOwnProperty('opticalActivity')) {
        this.opticalActivity = new CodeableConcept(obj.opticalActivity);
      }
      if (obj.hasOwnProperty('molecularFormula')) {
        this.molecularFormula = obj.molecularFormula;
      }
      if (obj.hasOwnProperty('molecularFormulaByMoiety')) {
        this.molecularFormulaByMoiety = obj.molecularFormulaByMoiety;
      }
      if (obj.hasOwnProperty('isotope')) {
        this.isotope = [];
        for (const o of obj.isotope || []) {
          this.isotope.push(new SubstanceSpecificationIsotopeComponent(o));
        }
      }
      if (obj.hasOwnProperty('molecularWeight')) {
        this.molecularWeight = new SubstanceSpecificationMolecularWeightComponent(obj.molecularWeight);
      }
      if (obj.hasOwnProperty('referenceSource')) {
        this.referenceSource = [];
        for (const o of obj.referenceSource || []) {
          this.referenceSource.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('structuralRepresentation')) {
        this.structuralRepresentation = [];
        for (const o of obj.structuralRepresentation || []) {
          this.structuralRepresentation.push(new SubstanceSpecificationStructuralRepresentationComponent(o));
        }
      }
    }
  }

}

export class SubstanceSpecificationSubstanceCodeComponent extends BackboneElement {
  public code?: CodeableConcept;
  public status?: CodeableConcept;
  public statusDate?: Date;
  public comment?: string;
  public referenceSource?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = new CodeableConcept(obj.status);
      }
      if (obj.hasOwnProperty('statusDate')) {
        this.statusDate = obj.statusDate;
      }
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('referenceSource')) {
        this.referenceSource = obj.referenceSource;
      }
    }
  }

}

export class SubstanceSpecificationOfficialNameComponent extends BackboneElement {
  public authority?: CodeableConcept;
  public status?: CodeableConcept;
  public date?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('authority')) {
        this.authority = new CodeableConcept(obj.authority);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = new CodeableConcept(obj.status);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
    }
  }

}

export class SubstanceSpecificationSubstanceNameComponent extends BackboneElement {
  public name?: string;
  public type?: CodeableConcept;
  public language?: CodeableConcept[];
  public domain?: CodeableConcept[];
  public jurisdiction?: CodeableConcept[];
  public officialName?: SubstanceSpecificationOfficialNameComponent[];
  public referenceSource?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('language')) {
        this.language = [];
        for (const o of obj.language || []) {
          this.language.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('domain')) {
        this.domain = [];
        for (const o of obj.domain || []) {
          this.domain.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('officialName')) {
        this.officialName = [];
        for (const o of obj.officialName || []) {
          this.officialName.push(new SubstanceSpecificationOfficialNameComponent(o));
        }
      }
      if (obj.hasOwnProperty('referenceSource')) {
        this.referenceSource = obj.referenceSource;
      }
    }
  }

}

export class SubstanceSpecification extends DomainResource {
  public resourceType = 'SubstanceSpecification';
  public comment?: string;
  public stoichiometric?: boolean;
  public identifier?: Identifier;
  public type?: CodeableConcept;
  public referenceSource?: string[];
  public moiety?: SubstanceSpecificationMoietyComponent[];
  public property?: SubstanceSpecificationPropertyComponent[];
  public referenceInformation?: ResourceReference;
  public structure?: SubstanceSpecificationStructureComponent;
  public substanceCode?: SubstanceSpecificationSubstanceCodeComponent[];
  public substanceName?: SubstanceSpecificationSubstanceNameComponent[];
  public molecularWeight?: SubstanceSpecificationMolecularWeightComponent[];
  public polymer?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('comment')) {
        this.comment = obj.comment;
      }
      if (obj.hasOwnProperty('stoichiometric')) {
        this.stoichiometric = obj.stoichiometric;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('referenceSource')) {
        this.referenceSource = obj.referenceSource;
      }
      if (obj.hasOwnProperty('moiety')) {
        this.moiety = [];
        for (const o of obj.moiety || []) {
          this.moiety.push(new SubstanceSpecificationMoietyComponent(o));
        }
      }
      if (obj.hasOwnProperty('property')) {
        this.property = [];
        for (const o of obj.property || []) {
          this.property.push(new SubstanceSpecificationPropertyComponent(o));
        }
      }
      if (obj.hasOwnProperty('referenceInformation')) {
        this.referenceInformation = new ResourceReference(obj.referenceInformation);
      }
      if (obj.hasOwnProperty('structure')) {
        this.structure = new SubstanceSpecificationStructureComponent(obj.structure);
      }
      if (obj.hasOwnProperty('substanceCode')) {
        this.substanceCode = [];
        for (const o of obj.substanceCode || []) {
          this.substanceCode.push(new SubstanceSpecificationSubstanceCodeComponent(o));
        }
      }
      if (obj.hasOwnProperty('substanceName')) {
        this.substanceName = [];
        for (const o of obj.substanceName || []) {
          this.substanceName.push(new SubstanceSpecificationSubstanceNameComponent(o));
        }
      }
      if (obj.hasOwnProperty('molecularWeight')) {
        this.molecularWeight = [];
        for (const o of obj.molecularWeight || []) {
          this.molecularWeight.push(new SubstanceSpecificationMolecularWeightComponent(o));
        }
      }
      if (obj.hasOwnProperty('polymer')) {
        this.polymer = new ResourceReference(obj.polymer);
      }
    }
  }

}

export class SupplyDeliverySuppliedItemComponent extends BackboneElement {
  public quantity?: SimpleQuantity;
  public item?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.hasOwnProperty('item')) {
        this.item = new Element(obj.item);
      }
    }
  }

}

export class SupplyDelivery extends DomainResource {
  public resourceType = 'SupplyDelivery';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status?: string;
  public patient?: ResourceReference;
  public type?: CodeableConcept;
  public suppliedItem?: SupplyDeliverySuppliedItemComponent;
  public occurrence?: Element;
  public supplier?: ResourceReference;
  public destination?: ResourceReference;
  public receiver?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('suppliedItem')) {
        this.suppliedItem = new SupplyDeliverySuppliedItemComponent(obj.suppliedItem);
      }
      if (obj.hasOwnProperty('occurrence')) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.hasOwnProperty('supplier')) {
        this.supplier = new ResourceReference(obj.supplier);
      }
      if (obj.hasOwnProperty('destination')) {
        this.destination = new ResourceReference(obj.destination);
      }
      if (obj.hasOwnProperty('receiver')) {
        this.receiver = [];
        for (const o of obj.receiver || []) {
          this.receiver.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class SupplyRequestParameterComponent extends BackboneElement {
  public code?: CodeableConcept;
  public value?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class SupplyRequest extends DomainResource {
  public resourceType = 'SupplyRequest';
  public identifier?: Identifier;
  public status?: string;
  public category?: CodeableConcept;
  public priority?: string;
  public item: Element;
  public quantity: Quantity;
  public parameter?: SupplyRequestParameterComponent[];
  public occurrence?: Element;
  public authoredOn?: Date;
  public requester?: ResourceReference;
  public supplier?: ResourceReference[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public deliverFrom?: ResourceReference;
  public deliverTo?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('category')) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('item')) {
        this.item = new Element(obj.item);
      }
      if (obj.hasOwnProperty('quantity')) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.hasOwnProperty('parameter')) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new SupplyRequestParameterComponent(o));
        }
      }
      if (obj.hasOwnProperty('occurrence')) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.hasOwnProperty('authoredOn')) {
        this.authoredOn = obj.authoredOn;
      }
      if (obj.hasOwnProperty('requester')) {
        this.requester = new ResourceReference(obj.requester);
      }
      if (obj.hasOwnProperty('supplier')) {
        this.supplier = [];
        for (const o of obj.supplier || []) {
          this.supplier.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('deliverFrom')) {
        this.deliverFrom = new ResourceReference(obj.deliverFrom);
      }
      if (obj.hasOwnProperty('deliverTo')) {
        this.deliverTo = new ResourceReference(obj.deliverTo);
      }
    }
  }

}

export class TaskRestrictionComponent extends BackboneElement {
  public repetitions?: number;
  public period?: Period;
  public recipient?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('repetitions')) {
        this.repetitions = obj.repetitions;
      }
      if (obj.hasOwnProperty('period')) {
        this.period = new Period(obj.period);
      }
      if (obj.hasOwnProperty('recipient')) {
        this.recipient = [];
        for (const o of obj.recipient || []) {
          this.recipient.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class TaskParameterComponent extends BackboneElement {
  public type: CodeableConcept;
  public value: Element;        // TODO: Replace with parameters for each option

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class TaskOutputComponent extends BackboneElement {
  public type: CodeableConcept;
  public value: Element;        // TODO: Replace with parameters for each option

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class Task extends DomainResource {
  public resourceType = 'Task';
  public identifier?: Identifier[];
  public instantiatesCanonical?: string;
  public instantiatesUri?: string;
  public basedOn?: ResourceReference[];
  public groupIdentifier?: Identifier;
  public partOf?: ResourceReference[];
  public status: string;
  public statusReason?: CodeableConcept;
  public businessStatus?: CodeableConcept;
  public intent: string;
  public priority?: string;
  public code?: CodeableConcept;
  public description?: string;
  public focus?: ResourceReference;
  public for?: ResourceReference;
  public context?: ResourceReference;
  public executionPeriod?: Period;
  public authoredOn?: Date;
  public lastModified?: Date;
  public requester?: ResourceReference;
  public performerType?: CodeableConcept[];
  public owner?: ResourceReference;
  public location?: ResourceReference;
  public reasonCode?: CodeableConcept;
  public reasonReference?: ResourceReference;
  public insurance?: ResourceReference[];
  public note?: Annotation[];
  public relevantHistory?: ResourceReference[];
  public restriction?: TaskRestrictionComponent;
  public input?: TaskParameterComponent[];
  public output?: TaskOutputComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('instantiatesCanonical')) {
        this.instantiatesCanonical = obj.instantiatesCanonical;
      }
      if (obj.hasOwnProperty('instantiatesUri')) {
        this.instantiatesUri = obj.instantiatesUri;
      }
      if (obj.hasOwnProperty('basedOn')) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('groupIdentifier')) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.hasOwnProperty('partOf')) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusReason')) {
        this.statusReason = new CodeableConcept(obj.statusReason);
      }
      if (obj.hasOwnProperty('businessStatus')) {
        this.businessStatus = new CodeableConcept(obj.businessStatus);
      }
      if (obj.hasOwnProperty('intent')) {
        this.intent = obj.intent;
      }
      if (obj.hasOwnProperty('priority')) {
        this.priority = obj.priority;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('focus')) {
        this.focus = new ResourceReference(obj.focus);
      }
      if (obj.hasOwnProperty('for')) {
        this.for = new ResourceReference(obj.for);
      }
      if (obj.hasOwnProperty('context')) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.hasOwnProperty('executionPeriod')) {
        this.executionPeriod = new Period(obj.executionPeriod);
      }
      if (obj.hasOwnProperty('authoredOn')) {
        this.authoredOn = obj.authoredOn;
      }
      if (obj.hasOwnProperty('lastModified')) {
        this.lastModified = obj.lastModified;
      }
      if (obj.hasOwnProperty('requester')) {
        this.requester = new ResourceReference(obj.requester);
      }
      if (obj.hasOwnProperty('performerType')) {
        this.performerType = [];
        for (const o of obj.performerType || []) {
          this.performerType.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('owner')) {
        this.owner = new ResourceReference(obj.owner);
      }
      if (obj.hasOwnProperty('location')) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.hasOwnProperty('reasonCode')) {
        this.reasonCode = new CodeableConcept(obj.reasonCode);
      }
      if (obj.hasOwnProperty('reasonReference')) {
        this.reasonReference = new ResourceReference(obj.reasonReference);
      }
      if (obj.hasOwnProperty('insurance')) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.hasOwnProperty('relevantHistory')) {
        this.relevantHistory = [];
        for (const o of obj.relevantHistory || []) {
          this.relevantHistory.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('restriction')) {
        this.restriction = new TaskRestrictionComponent(obj.restriction);
      }
      if (obj.hasOwnProperty('input')) {
        this.input = [];
        for (const o of obj.input || []) {
          this.input.push(new TaskParameterComponent(o));
        }
      }
      if (obj.hasOwnProperty('output')) {
        this.output = [];
        for (const o of obj.output || []) {
          this.output.push(new TaskOutputComponent(o));
        }
      }
    }
  }

}

export class ModelInfo {

  constructor(obj?: any) {
    if (obj) {
    }
  }

}

export class TerminologyCapabilitiesSoftwareComponent extends BackboneElement {
  public name: string;
  public version?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
    }
  }

}

export class TerminologyCapabilitiesImplementationComponent extends BackboneElement {
  public description: string;
  public url?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
    }
  }

}

export class TerminologyCapabilitiesFilterComponent extends BackboneElement {
  public code: string;
  public op: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('op')) {
        this.op = obj.op;
      }
    }
  }

}

export class TerminologyCapabilitiesVersionComponent extends BackboneElement {
  public code?: string;
  public isDefault?: boolean;
  public compositional?: boolean;
  public language?: string[];
  public filter?: TerminologyCapabilitiesFilterComponent[];
  public property?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('isDefault')) {
        this.isDefault = obj.isDefault;
      }
      if (obj.hasOwnProperty('compositional')) {
        this.compositional = obj.compositional;
      }
      if (obj.hasOwnProperty('language')) {
        this.language = obj.language;
      }
      if (obj.hasOwnProperty('filter')) {
        this.filter = [];
        for (const o of obj.filter || []) {
          this.filter.push(new TerminologyCapabilitiesFilterComponent(o));
        }
      }
      if (obj.hasOwnProperty('property')) {
        this.property = obj.property;
      }
    }
  }

}

export class TerminologyCapabilitiesCodeSystemComponent extends BackboneElement {
  public uri?: string;
  public version?: TerminologyCapabilitiesVersionComponent[];
  public subsumption?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('uri')) {
        this.uri = obj.uri;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = [];
        for (const o of obj.version || []) {
          this.version.push(new TerminologyCapabilitiesVersionComponent(o));
        }
      }
      if (obj.hasOwnProperty('subsumption')) {
        this.subsumption = obj.subsumption;
      }
    }
  }

}

export class TerminologyCapabilitiesParameterComponent extends BackboneElement {
  public name: string;
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('documentation')) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class TerminologyCapabilitiesExpansionComponent extends BackboneElement {
  public hierarchical?: boolean;
  public paging?: boolean;
  public incomplete?: boolean;
  public parameter?: TerminologyCapabilitiesParameterComponent[];
  public textFilter?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('hierarchical')) {
        this.hierarchical = obj.hierarchical;
      }
      if (obj.hasOwnProperty('paging')) {
        this.paging = obj.paging;
      }
      if (obj.hasOwnProperty('incomplete')) {
        this.incomplete = obj.incomplete;
      }
      if (obj.hasOwnProperty('parameter')) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new TerminologyCapabilitiesParameterComponent(o));
        }
      }
      if (obj.hasOwnProperty('textFilter')) {
        this.textFilter = obj.textFilter;
      }
    }
  }

}

export class TerminologyCapabilitiesValidateCodeComponent extends BackboneElement {
  public translations: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('translations')) {
        this.translations = obj.translations;
      }
    }
  }

}

export class TerminologyCapabilitiesTranslationComponent extends BackboneElement {
  public needsMap: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('needsMap')) {
        this.needsMap = obj.needsMap;
      }
    }
  }

}

export class TerminologyCapabilitiesClosureComponent extends BackboneElement {
  public translation?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('translation')) {
        this.translation = obj.translation;
      }
    }
  }

}

export class TerminologyCapabilities extends DomainResource {
  public resourceType = 'TerminologyCapabilities';
  public url?: string;
  public version?: string;
  public name?: string;
  public title?: string;
  public status: string;
  public experimental?: boolean;
  public date: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public kind: string;
  public software?: TerminologyCapabilitiesSoftwareComponent;
  public implementation?: TerminologyCapabilitiesImplementationComponent;
  public lockedDate?: boolean;
  public codeSystem?: TerminologyCapabilitiesCodeSystemComponent[];
  public expansion?: TerminologyCapabilitiesExpansionComponent;
  public codeSearch?: string;
  public validateCode?: TerminologyCapabilitiesValidateCodeComponent;
  public translation?: TerminologyCapabilitiesTranslationComponent;
  public closure?: TerminologyCapabilitiesClosureComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('kind')) {
        this.kind = obj.kind;
      }
      if (obj.hasOwnProperty('software')) {
        this.software = new TerminologyCapabilitiesSoftwareComponent(obj.software);
      }
      if (obj.hasOwnProperty('implementation')) {
        this.implementation = new TerminologyCapabilitiesImplementationComponent(obj.implementation);
      }
      if (obj.hasOwnProperty('lockedDate')) {
        this.lockedDate = obj.lockedDate;
      }
      if (obj.hasOwnProperty('codeSystem')) {
        this.codeSystem = [];
        for (const o of obj.codeSystem || []) {
          this.codeSystem.push(new TerminologyCapabilitiesCodeSystemComponent(o));
        }
      }
      if (obj.hasOwnProperty('expansion')) {
        this.expansion = new TerminologyCapabilitiesExpansionComponent(obj.expansion);
      }
      if (obj.hasOwnProperty('codeSearch')) {
        this.codeSearch = obj.codeSearch;
      }
      if (obj.hasOwnProperty('validateCode')) {
        this.validateCode = new TerminologyCapabilitiesValidateCodeComponent(obj.validateCode);
      }
      if (obj.hasOwnProperty('translation')) {
        this.translation = new TerminologyCapabilitiesTranslationComponent(obj.translation);
      }
      if (obj.hasOwnProperty('closure')) {
        this.closure = new TerminologyCapabilitiesClosureComponent(obj.closure);
      }
    }
  }

}

export class TestReportParticipantComponent extends BackboneElement {
  public type: string;
  public uri: string;
  public display?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('uri')) {
        this.uri = obj.uri;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
    }
  }

}

export class TestReportOperationComponent extends BackboneElement {
  public result: string;
  public message?: string;
  public detail?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('result')) {
        this.result = obj.result;
      }
      if (obj.hasOwnProperty('message')) {
        this.message = obj.message;
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = obj.detail;
      }
    }
  }

}

export class TestReportAssertComponent extends BackboneElement {
  public result: string;
  public message?: string;
  public detail?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('result')) {
        this.result = obj.result;
      }
      if (obj.hasOwnProperty('message')) {
        this.message = obj.message;
      }
      if (obj.hasOwnProperty('detail')) {
        this.detail = obj.detail;
      }
    }
  }

}

export class TestReportSetupActionComponent extends BackboneElement {
  public operation?: TestReportOperationComponent;
  public assert?: TestReportAssertComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('operation')) {
        this.operation = new TestReportOperationComponent(obj.operation);
      }
      if (obj.hasOwnProperty('assert')) {
        this.assert = new TestReportAssertComponent(obj.assert);
      }
    }
  }

}

export class TestReportSetupComponent extends BackboneElement {
  public action: TestReportSetupActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new TestReportSetupActionComponent(o));
        }
      }
    }
  }

}

export class TestReportTestActionComponent extends BackboneElement {
  public operation?: TestReportOperationComponent;
  public assert?: TestReportAssertComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('operation')) {
        this.operation = new TestReportOperationComponent(obj.operation);
      }
      if (obj.hasOwnProperty('assert')) {
        this.assert = new TestReportAssertComponent(obj.assert);
      }
    }
  }

}

export class TestReportTestComponent extends BackboneElement {
  public name?: string;
  public description?: string;
  public action: TestReportTestActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new TestReportTestActionComponent(o));
        }
      }
    }
  }

}

export class TestReportTeardownActionComponent extends BackboneElement {
  public operation: TestReportOperationComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('operation')) {
        this.operation = new TestReportOperationComponent(obj.operation);
      }
    }
  }

}

export class TestReportTeardownComponent extends BackboneElement {
  public action: TestReportTeardownActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new TestReportTeardownActionComponent(o));
        }
      }
    }
  }

}

export class TestReport extends DomainResource {
  public resourceType = 'TestReport';
  public identifier?: Identifier;
  public name?: string;
  public status: string;
  public testScript: ResourceReference;
  public result: string;
  public score?: number;
  public tester?: string;
  public issued?: Date;
  public participant?: TestReportParticipantComponent[];
  public setup?: TestReportSetupComponent;
  public test?: TestReportTestComponent[];
  public teardown?: TestReportTeardownComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('testScript')) {
        this.testScript = new ResourceReference(obj.testScript);
      }
      if (obj.hasOwnProperty('result')) {
        this.result = obj.result;
      }
      if (obj.hasOwnProperty('score')) {
        this.score = obj.score;
      }
      if (obj.hasOwnProperty('tester')) {
        this.tester = obj.tester;
      }
      if (obj.hasOwnProperty('issued')) {
        this.issued = obj.issued;
      }
      if (obj.hasOwnProperty('participant')) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new TestReportParticipantComponent(o));
        }
      }
      if (obj.hasOwnProperty('setup')) {
        this.setup = new TestReportSetupComponent(obj.setup);
      }
      if (obj.hasOwnProperty('test')) {
        this.test = [];
        for (const o of obj.test || []) {
          this.test.push(new TestReportTestComponent(o));
        }
      }
      if (obj.hasOwnProperty('teardown')) {
        this.teardown = new TestReportTeardownComponent(obj.teardown);
      }
    }
  }

}

export class TestScriptOriginComponent extends BackboneElement {
  public index: number;
  public profile: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('index')) {
        this.index = obj.index;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = new Coding(obj.profile);
      }
    }
  }

}

export class TestScriptDestinationComponent extends BackboneElement {
  public index: number;
  public profile: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('index')) {
        this.index = obj.index;
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = new Coding(obj.profile);
      }
    }
  }

}

export class TestScriptLinkComponent extends BackboneElement {
  public url: string;
  public description?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
    }
  }

}

export class TestScriptCapabilityComponent extends BackboneElement {
  public required: boolean;
  public validated: boolean;
  public description?: string;
  public origin?: number[];
  public destination?: number;
  public link?: string[];
  public capabilities: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('required')) {
        this.required = obj.required;
      }
      if (obj.hasOwnProperty('validated')) {
        this.validated = obj.validated;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('origin')) {
        this.origin = obj.origin;
      }
      if (obj.hasOwnProperty('destination')) {
        this.destination = obj.destination;
      }
      if (obj.hasOwnProperty('link')) {
        this.link = obj.link;
      }
      if (obj.hasOwnProperty('capabilities')) {
        this.capabilities = obj.capabilities;
      }
    }
  }

}

export class TestScriptMetadataComponent extends BackboneElement {
  public link?: TestScriptLinkComponent[];
  public capability: TestScriptCapabilityComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('link')) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new TestScriptLinkComponent(o));
        }
      }
      if (obj.hasOwnProperty('capability')) {
        this.capability = [];
        for (const o of obj.capability || []) {
          this.capability.push(new TestScriptCapabilityComponent(o));
        }
      }
    }
  }

}

export class TestScriptFixtureComponent extends BackboneElement {
  public autocreate: boolean;
  public autodelete: boolean;
  public resource?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('autocreate')) {
        this.autocreate = obj.autocreate;
      }
      if (obj.hasOwnProperty('autodelete')) {
        this.autodelete = obj.autodelete;
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = new ResourceReference(obj.resource);
      }
    }
  }

}

export class TestScriptVariableComponent extends BackboneElement {
  public name: string;
  public defaultValue?: string;
  public description?: string;
  public expression?: string;
  public headerField?: string;
  public hint?: string;
  public path?: string;
  public sourceId?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('defaultValue')) {
        this.defaultValue = obj.defaultValue;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
      if (obj.hasOwnProperty('headerField')) {
        this.headerField = obj.headerField;
      }
      if (obj.hasOwnProperty('hint')) {
        this.hint = obj.hint;
      }
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('sourceId')) {
        this.sourceId = obj.sourceId;
      }
    }
  }

}

export class TestScriptRuleParamComponent extends BackboneElement {
  public name: string;
  public value?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class TestScriptRuleComponent extends BackboneElement {
  public resource: ResourceReference;
  public param?: TestScriptRuleParamComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('resource')) {
        this.resource = new ResourceReference(obj.resource);
      }
      if (obj.hasOwnProperty('param')) {
        this.param = [];
        for (const o of obj.param || []) {
          this.param.push(new TestScriptRuleParamComponent(o));
        }
      }
    }
  }

}

export class TestScriptRulesetRuleParamComponent extends BackboneElement {
  public name: string;
  public value?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class TestScriptRulesetRuleComponent extends BackboneElement {
  public ruleId: string;
  public param?: TestScriptRulesetRuleParamComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('ruleId')) {
        this.ruleId = obj.ruleId;
      }
      if (obj.hasOwnProperty('param')) {
        this.param = [];
        for (const o of obj.param || []) {
          this.param.push(new TestScriptRulesetRuleParamComponent(o));
        }
      }
    }
  }

}

export class TestScriptRulesetComponent extends BackboneElement {
  public resource: ResourceReference;
  public rule: TestScriptRulesetRuleComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('resource')) {
        this.resource = new ResourceReference(obj.resource);
      }
      if (obj.hasOwnProperty('rule')) {
        this.rule = [];
        for (const o of obj.rule || []) {
          this.rule.push(new TestScriptRulesetRuleComponent(o));
        }
      }
    }
  }

}

export class TestScriptRequestHeaderComponent extends BackboneElement {
  public field: string;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('field')) {
        this.field = obj.field;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class TestScriptOperationComponent extends BackboneElement {
  public type?: Coding;
  public resource?: string;
  public label?: string;
  public description?: string;
  public accept?: string;
  public contentType?: string;
  public destination?: number;
  public encodeRequestUrl: boolean;
  public origin?: number;
  public params?: string;
  public requestHeader?: TestScriptRequestHeaderComponent[];
  public requestId?: string;
  public responseId?: string;
  public sourceId?: string;
  public targetId?: string;
  public url?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = new Coding(obj.type);
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = obj.resource;
      }
      if (obj.hasOwnProperty('label')) {
        this.label = obj.label;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('accept')) {
        this.accept = obj.accept;
      }
      if (obj.hasOwnProperty('contentType')) {
        this.contentType = obj.contentType;
      }
      if (obj.hasOwnProperty('destination')) {
        this.destination = obj.destination;
      }
      if (obj.hasOwnProperty('encodeRequestUrl')) {
        this.encodeRequestUrl = obj.encodeRequestUrl;
      }
      if (obj.hasOwnProperty('origin')) {
        this.origin = obj.origin;
      }
      if (obj.hasOwnProperty('params')) {
        this.params = obj.params;
      }
      if (obj.hasOwnProperty('requestHeader')) {
        this.requestHeader = [];
        for (const o of obj.requestHeader || []) {
          this.requestHeader.push(new TestScriptRequestHeaderComponent(o));
        }
      }
      if (obj.hasOwnProperty('requestId')) {
        this.requestId = obj.requestId;
      }
      if (obj.hasOwnProperty('responseId')) {
        this.responseId = obj.responseId;
      }
      if (obj.hasOwnProperty('sourceId')) {
        this.sourceId = obj.sourceId;
      }
      if (obj.hasOwnProperty('targetId')) {
        this.targetId = obj.targetId;
      }
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
    }
  }

}

export class TestScriptActionAssertRuleParamComponent extends BackboneElement {
  public name: string;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class TestScriptActionAssertRuleComponent extends BackboneElement {
  public ruleId: string;
  public param?: TestScriptActionAssertRuleParamComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('ruleId')) {
        this.ruleId = obj.ruleId;
      }
      if (obj.hasOwnProperty('param')) {
        this.param = [];
        for (const o of obj.param || []) {
          this.param.push(new TestScriptActionAssertRuleParamComponent(o));
        }
      }
    }
  }

}

export class TestScriptParamComponent extends BackboneElement {
  public name: string;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class TestScriptActionAssertRulesetRuleComponent extends BackboneElement {
  public ruleId: string;
  public param?: TestScriptParamComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('ruleId')) {
        this.ruleId = obj.ruleId;
      }
      if (obj.hasOwnProperty('param')) {
        this.param = [];
        for (const o of obj.param || []) {
          this.param.push(new TestScriptParamComponent(o));
        }
      }
    }
  }

}

export class TestScriptActionAssertRulesetComponent extends BackboneElement {
  public rulesetId: string;
  public rule?: TestScriptActionAssertRulesetRuleComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('rulesetId')) {
        this.rulesetId = obj.rulesetId;
      }
      if (obj.hasOwnProperty('rule')) {
        this.rule = [];
        for (const o of obj.rule || []) {
          this.rule.push(new TestScriptActionAssertRulesetRuleComponent(o));
        }
      }
    }
  }

}

export class TestScriptAssertComponent extends BackboneElement {
  public label?: string;
  public description?: string;
  public direction?: string;
  public compareToSourceId?: string;
  public compareToSourceExpression?: string;
  public compareToSourcePath?: string;
  public contentType?: string;
  public expression?: string;
  public headerField?: string;
  public minimumId?: string;
  public navigationLinks?: boolean;
  public operator?: string;
  public path?: string;
  public requestMethod?: string;
  public requestURL?: string;
  public resource?: string;
  public response?: string;
  public responseCode?: string;
  public rule?: TestScriptActionAssertRuleComponent;
  public ruleset?: TestScriptActionAssertRulesetComponent;
  public sourceId?: string;
  public validateProfileId?: string;
  public value?: string;
  public warningOnly: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('label')) {
        this.label = obj.label;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('direction')) {
        this.direction = obj.direction;
      }
      if (obj.hasOwnProperty('compareToSourceId')) {
        this.compareToSourceId = obj.compareToSourceId;
      }
      if (obj.hasOwnProperty('compareToSourceExpression')) {
        this.compareToSourceExpression = obj.compareToSourceExpression;
      }
      if (obj.hasOwnProperty('compareToSourcePath')) {
        this.compareToSourcePath = obj.compareToSourcePath;
      }
      if (obj.hasOwnProperty('contentType')) {
        this.contentType = obj.contentType;
      }
      if (obj.hasOwnProperty('expression')) {
        this.expression = obj.expression;
      }
      if (obj.hasOwnProperty('headerField')) {
        this.headerField = obj.headerField;
      }
      if (obj.hasOwnProperty('minimumId')) {
        this.minimumId = obj.minimumId;
      }
      if (obj.hasOwnProperty('navigationLinks')) {
        this.navigationLinks = obj.navigationLinks;
      }
      if (obj.hasOwnProperty('operator')) {
        this.operator = obj.operator;
      }
      if (obj.hasOwnProperty('path')) {
        this.path = obj.path;
      }
      if (obj.hasOwnProperty('requestMethod')) {
        this.requestMethod = obj.requestMethod;
      }
      if (obj.hasOwnProperty('requestURL')) {
        this.requestURL = obj.requestURL;
      }
      if (obj.hasOwnProperty('resource')) {
        this.resource = obj.resource;
      }
      if (obj.hasOwnProperty('response')) {
        this.response = obj.response;
      }
      if (obj.hasOwnProperty('responseCode')) {
        this.responseCode = obj.responseCode;
      }
      if (obj.hasOwnProperty('rule')) {
        this.rule = new TestScriptActionAssertRuleComponent(obj.rule);
      }
      if (obj.hasOwnProperty('ruleset')) {
        this.ruleset = new TestScriptActionAssertRulesetComponent(obj.ruleset);
      }
      if (obj.hasOwnProperty('sourceId')) {
        this.sourceId = obj.sourceId;
      }
      if (obj.hasOwnProperty('validateProfileId')) {
        this.validateProfileId = obj.validateProfileId;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
      if (obj.hasOwnProperty('warningOnly')) {
        this.warningOnly = obj.warningOnly;
      }
    }
  }

}

export class TestScriptSetupActionComponent extends BackboneElement {
  public operation?: TestScriptOperationComponent;
  public assert?: TestScriptAssertComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('operation')) {
        this.operation = new TestScriptOperationComponent(obj.operation);
      }
      if (obj.hasOwnProperty('assert')) {
        this.assert = new TestScriptAssertComponent(obj.assert);
      }
    }
  }

}

export class TestScriptSetupComponent extends BackboneElement {
  public action: TestScriptSetupActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new TestScriptSetupActionComponent(o));
        }
      }
    }
  }

}

export class TestScriptTestActionComponent extends BackboneElement {
  public operation?: TestScriptOperationComponent;
  public assert?: TestScriptAssertComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('operation')) {
        this.operation = new TestScriptOperationComponent(obj.operation);
      }
      if (obj.hasOwnProperty('assert')) {
        this.assert = new TestScriptAssertComponent(obj.assert);
      }
    }
  }

}

export class TestScriptTestComponent extends BackboneElement {
  public name?: string;
  public description?: string;
  public action: TestScriptTestActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new TestScriptTestActionComponent(o));
        }
      }
    }
  }

}

export class TestScriptTeardownActionComponent extends BackboneElement {
  public operation: TestScriptOperationComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('operation')) {
        this.operation = new TestScriptOperationComponent(obj.operation);
      }
    }
  }

}

export class TestScriptTeardownComponent extends BackboneElement {
  public action: TestScriptTeardownActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('action')) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new TestScriptTeardownActionComponent(o));
        }
      }
    }
  }

}

export class TestScript extends DomainResource {
  public resourceType = 'TestScript';
  public url: string;
  public identifier?: Identifier;
  public version?: string;
  public name: string;
  public title?: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public origin?: TestScriptOriginComponent[];
  public destination?: TestScriptDestinationComponent[];
  public metadata?: TestScriptMetadataComponent;
  public fixture?: TestScriptFixtureComponent[];
  public profile?: ResourceReference[];
  public variable?: TestScriptVariableComponent[];
  public rule?: TestScriptRuleComponent[];
  public ruleset?: TestScriptRulesetComponent[];
  public setup?: TestScriptSetupComponent;
  public test?: TestScriptTestComponent[];
  public teardown?: TestScriptTeardownComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('origin')) {
        this.origin = [];
        for (const o of obj.origin || []) {
          this.origin.push(new TestScriptOriginComponent(o));
        }
      }
      if (obj.hasOwnProperty('destination')) {
        this.destination = [];
        for (const o of obj.destination || []) {
          this.destination.push(new TestScriptDestinationComponent(o));
        }
      }
      if (obj.hasOwnProperty('metadata')) {
        this.metadata = new TestScriptMetadataComponent(obj.metadata);
      }
      if (obj.hasOwnProperty('fixture')) {
        this.fixture = [];
        for (const o of obj.fixture || []) {
          this.fixture.push(new TestScriptFixtureComponent(o));
        }
      }
      if (obj.hasOwnProperty('profile')) {
        this.profile = [];
        for (const o of obj.profile || []) {
          this.profile.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('variable')) {
        this.variable = [];
        for (const o of obj.variable || []) {
          this.variable.push(new TestScriptVariableComponent(o));
        }
      }
      if (obj.hasOwnProperty('rule')) {
        this.rule = [];
        for (const o of obj.rule || []) {
          this.rule.push(new TestScriptRuleComponent(o));
        }
      }
      if (obj.hasOwnProperty('ruleset')) {
        this.ruleset = [];
        for (const o of obj.ruleset || []) {
          this.ruleset.push(new TestScriptRulesetComponent(o));
        }
      }
      if (obj.hasOwnProperty('setup')) {
        this.setup = new TestScriptSetupComponent(obj.setup);
      }
      if (obj.hasOwnProperty('test')) {
        this.test = [];
        for (const o of obj.test || []) {
          this.test.push(new TestScriptTestComponent(o));
        }
      }
      if (obj.hasOwnProperty('teardown')) {
        this.teardown = new TestScriptTeardownComponent(obj.teardown);
      }
    }
  }

}

export class UserSessionStatusComponent extends BackboneElement {
  public code: string;
  public source: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('source')) {
        this.source = obj.source;
      }
    }
  }

}

export class UserSessionContextComponent extends BackboneElement {
  public type: string;
  public value?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('type')) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class UserSession extends DomainResource {
  public resourceType = 'UserSession';
  public identifier?: Identifier;
  public user: ResourceReference;
  public status?: UserSessionStatusComponent;
  public workstation?: Identifier;
  public focus?: ResourceReference[];
  public created?: Date;
  public expires?: Date;
  public context?: UserSessionContextComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.hasOwnProperty('user')) {
        this.user = new ResourceReference(obj.user);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = new UserSessionStatusComponent(obj.status);
      }
      if (obj.hasOwnProperty('workstation')) {
        this.workstation = new Identifier(obj.workstation);
      }
      if (obj.hasOwnProperty('focus')) {
        this.focus = [];
        for (const o of obj.focus || []) {
          this.focus.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('created')) {
        this.created = obj.created;
      }
      if (obj.hasOwnProperty('expires')) {
        this.expires = obj.expires;
      }
      if (obj.hasOwnProperty('context')) {
        this.context = [];
        for (const o of obj.context || []) {
          this.context.push(new UserSessionContextComponent(o));
        }
      }
    }
  }

}

export class ValueSetDesignationComponent extends BackboneElement {
  public language?: string;
  public use?: Coding;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('language')) {
        this.language = obj.language;
      }
      if (obj.hasOwnProperty('use')) {
        this.use = new Coding(obj.use);
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class ValueSetConceptReferenceComponent extends BackboneElement {
  public code: string;
  public display?: string;
  public designation?: ValueSetDesignationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
      if (obj.hasOwnProperty('designation')) {
        this.designation = [];
        for (const o of obj.designation || []) {
          this.designation.push(new ValueSetDesignationComponent(o));
        }
      }
    }
  }

}

export class ValueSetFilterComponent extends BackboneElement {
  public property: string;
  public op: string;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('property')) {
        this.property = obj.property;
      }
      if (obj.hasOwnProperty('op')) {
        this.op = obj.op;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = obj.value;
      }
    }
  }

}

export class ValueSetConceptSetComponent extends BackboneElement {
  public system?: string;
  public version?: string;
  public concept?: ValueSetConceptReferenceComponent[];
  public filter?: ValueSetFilterComponent[];
  public valueSet?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('system')) {
        this.system = obj.system;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('concept')) {
        this.concept = [];
        for (const o of obj.concept || []) {
          this.concept.push(new ValueSetConceptReferenceComponent(o));
        }
      }
      if (obj.hasOwnProperty('filter')) {
        this.filter = [];
        for (const o of obj.filter || []) {
          this.filter.push(new ValueSetFilterComponent(o));
        }
      }
      if (obj.hasOwnProperty('valueSet')) {
        this.valueSet = obj.valueSet;
      }
    }
  }

}

export class ValueSetComposeComponent extends BackboneElement {
  public lockedDate?: Date;
  public inactive?: boolean;
  public include: ValueSetConceptSetComponent[];
  public exclude?: ValueSetConceptSetComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('lockedDate')) {
        this.lockedDate = obj.lockedDate;
      }
      if (obj.hasOwnProperty('inactive')) {
        this.inactive = obj.inactive;
      }
      if (obj.hasOwnProperty('include')) {
        this.include = [];
        for (const o of obj.include || []) {
          this.include.push(new ValueSetConceptSetComponent(o));
        }
      }
      if (obj.hasOwnProperty('exclude')) {
        this.exclude = [];
        for (const o of obj.exclude || []) {
          this.exclude.push(new ValueSetConceptSetComponent(o));
        }
      }
    }
  }

}

export class ValueSetParameterComponent extends BackboneElement {
  public name: string;
  public value?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('value')) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class ValueSetContainsComponent extends BackboneElement {
  public system?: string;
  public abstract?: boolean;
  public inactive?: boolean;
  public version?: string;
  public code?: string;
  public display?: string;
  public designation?: ValueSetDesignationComponent[];
  public contains?: ValueSetContainsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('system')) {
        this.system = obj.system;
      }
      if (obj.hasOwnProperty('abstract')) {
        this.abstract = obj.abstract;
      }
      if (obj.hasOwnProperty('inactive')) {
        this.inactive = obj.inactive;
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('code')) {
        this.code = obj.code;
      }
      if (obj.hasOwnProperty('display')) {
        this.display = obj.display;
      }
      if (obj.hasOwnProperty('designation')) {
        this.designation = [];
        for (const o of obj.designation || []) {
          this.designation.push(new ValueSetDesignationComponent(o));
        }
      }
      if (obj.hasOwnProperty('contains')) {
        this.contains = [];
        for (const o of obj.contains || []) {
          this.contains.push(new ValueSetContainsComponent(o));
        }
      }
    }
  }

}

export class ValueSetExpansionComponent extends BackboneElement {
  public identifier?: string;
  public timestamp: Date;
  public total?: number;
  public offset?: number;
  public parameter?: ValueSetParameterComponent[];
  public contains?: ValueSetContainsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = obj.identifier;
      }
      if (obj.hasOwnProperty('timestamp')) {
        this.timestamp = obj.timestamp;
      }
      if (obj.hasOwnProperty('total')) {
        this.total = obj.total;
      }
      if (obj.hasOwnProperty('offset')) {
        this.offset = obj.offset;
      }
      if (obj.hasOwnProperty('parameter')) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new ValueSetParameterComponent(o));
        }
      }
      if (obj.hasOwnProperty('contains')) {
        this.contains = [];
        for (const o of obj.contains || []) {
          this.contains.push(new ValueSetContainsComponent(o));
        }
      }
    }
  }

}

export class ValueSet extends DomainResource implements IValueSet {
  public resourceType = 'ValueSet';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public immutable?: boolean;
  public purpose?: string;
  public copyright?: string;
  public compose?: ValueSetComposeComponent;
  public expansion?: ValueSetExpansionComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('url')) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('version')) {
        this.version = obj.version;
      }
      if (obj.hasOwnProperty('name')) {
        this.name = obj.name;
      }
      if (obj.hasOwnProperty('title')) {
        this.title = obj.title;
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('experimental')) {
        this.experimental = obj.experimental;
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('publisher')) {
        this.publisher = obj.publisher;
      }
      if (obj.hasOwnProperty('contact')) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.hasOwnProperty('description')) {
        this.description = obj.description;
      }
      if (obj.hasOwnProperty('useContext')) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.hasOwnProperty('jurisdiction')) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('immutable')) {
        this.immutable = obj.immutable;
      }
      if (obj.hasOwnProperty('purpose')) {
        this.purpose = obj.purpose;
      }
      if (obj.hasOwnProperty('copyright')) {
        this.copyright = obj.copyright;
      }
      if (obj.hasOwnProperty('compose')) {
        this.compose = new ValueSetComposeComponent(obj.compose);
      }
      if (obj.hasOwnProperty('expansion')) {
        this.expansion = new ValueSetExpansionComponent(obj.expansion);
      }
    }
  }

}

export class VerificationResultPrimarySourceComponent extends BackboneElement {
  public organization?: ResourceReference;
  public type?: CodeableConcept[];
  public validationProcess?: CodeableConcept[];
  public validationStatus?: CodeableConcept;
  public validationDate?: Date;
  public canPushUpdates?: CodeableConcept;
  public pushTypeAvailable?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('organization')) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.hasOwnProperty('type')) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('validationProcess')) {
        this.validationProcess = [];
        for (const o of obj.validationProcess || []) {
          this.validationProcess.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('validationStatus')) {
        this.validationStatus = new CodeableConcept(obj.validationStatus);
      }
      if (obj.hasOwnProperty('validationDate')) {
        this.validationDate = obj.validationDate;
      }
      if (obj.hasOwnProperty('canPushUpdates')) {
        this.canPushUpdates = new CodeableConcept(obj.canPushUpdates);
      }
      if (obj.hasOwnProperty('pushTypeAvailable')) {
        this.pushTypeAvailable = [];
        for (const o of obj.pushTypeAvailable || []) {
          this.pushTypeAvailable.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class VerificationResultAttestationComponent extends BackboneElement {
  public source?: ResourceReference;
  public organization?: ResourceReference;
  public method?: CodeableConcept;
  public date?: Date;
  public sourceIdentityCertificate?: string;
  public proxyIdentityCertificate?: string;
  public signedProxyRight?: Element;
  public signedSourceAttestation?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('source')) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.hasOwnProperty('organization')) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.hasOwnProperty('method')) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.hasOwnProperty('date')) {
        this.date = obj.date;
      }
      if (obj.hasOwnProperty('sourceIdentityCertificate')) {
        this.sourceIdentityCertificate = obj.sourceIdentityCertificate;
      }
      if (obj.hasOwnProperty('proxyIdentityCertificate')) {
        this.proxyIdentityCertificate = obj.proxyIdentityCertificate;
      }
      if (obj.hasOwnProperty('signedProxyRight')) {
        this.signedProxyRight = new Element(obj.signedProxyRight);
      }
      if (obj.hasOwnProperty('signedSourceAttestation')) {
        this.signedSourceAttestation = new Element(obj.signedSourceAttestation);
      }
    }
  }

}

export class VerificationResultValidatorComponent extends BackboneElement {
  public organization: ResourceReference;
  public identityCertificate?: string;
  public signedValidatorAttestation?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('organization')) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.hasOwnProperty('identityCertificate')) {
        this.identityCertificate = obj.identityCertificate;
      }
      if (obj.hasOwnProperty('signedValidatorAttestation')) {
        this.signedValidatorAttestation = new Element(obj.signedValidatorAttestation);
      }
    }
  }

}

export class VerificationResult extends DomainResource {
  public resourceType = 'VerificationResult';
  public target?: ResourceReference[];
  public targetLocation?: string[];
  public need?: CodeableConcept;
  public status: string;
  public statusDate?: Date;
  public validationType?: CodeableConcept;
  public validationProcess?: CodeableConcept[];
  public frequency?: Timing;
  public lastPerformed?: Date;
  public nextScheduled?: Date;
  public failureAction?: CodeableConcept;
  public primarySource?: VerificationResultPrimarySourceComponent[];
  public attestation?: VerificationResultAttestationComponent;
  public validator?: VerificationResultValidatorComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('target')) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new ResourceReference(o));
        }
      }
      if (obj.hasOwnProperty('targetLocation')) {
        this.targetLocation = obj.targetLocation;
      }
      if (obj.hasOwnProperty('need')) {
        this.need = new CodeableConcept(obj.need);
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('statusDate')) {
        this.statusDate = obj.statusDate;
      }
      if (obj.hasOwnProperty('validationType')) {
        this.validationType = new CodeableConcept(obj.validationType);
      }
      if (obj.hasOwnProperty('validationProcess')) {
        this.validationProcess = [];
        for (const o of obj.validationProcess || []) {
          this.validationProcess.push(new CodeableConcept(o));
        }
      }
      if (obj.hasOwnProperty('frequency')) {
        this.frequency = new Timing(obj.frequency);
      }
      if (obj.hasOwnProperty('lastPerformed')) {
        this.lastPerformed = obj.lastPerformed;
      }
      if (obj.hasOwnProperty('nextScheduled')) {
        this.nextScheduled = obj.nextScheduled;
      }
      if (obj.hasOwnProperty('failureAction')) {
        this.failureAction = new CodeableConcept(obj.failureAction);
      }
      if (obj.hasOwnProperty('primarySource')) {
        this.primarySource = [];
        for (const o of obj.primarySource || []) {
          this.primarySource.push(new VerificationResultPrimarySourceComponent(o));
        }
      }
      if (obj.hasOwnProperty('attestation')) {
        this.attestation = new VerificationResultAttestationComponent(obj.attestation);
      }
      if (obj.hasOwnProperty('validator')) {
        this.validator = [];
        for (const o of obj.validator || []) {
          this.validator.push(new VerificationResultValidatorComponent(o));
        }
      }
    }
  }

}

export class VisionPrescriptionPrismComponent extends BackboneElement {
  public amount: number;
  public base: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('amount')) {
        this.amount = obj.amount;
      }
      if (obj.hasOwnProperty('base')) {
        this.base = obj.base;
      }
    }
  }

}

export class VisionPrescriptionDispenseComponent extends BackboneElement {
  public product?: CodeableConcept;
  public eye?: string;
  public sphere?: number;
  public cylinder?: number;
  public axis?: number;
  public prism?: VisionPrescriptionPrismComponent[];
  public add?: number;
  public power?: number;
  public backCurve?: number;
  public diameter?: number;
  public duration?: SimpleQuantity;
  public color?: string;
  public brand?: string;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('product')) {
        this.product = new CodeableConcept(obj.product);
      }
      if (obj.hasOwnProperty('eye')) {
        this.eye = obj.eye;
      }
      if (obj.hasOwnProperty('sphere')) {
        this.sphere = obj.sphere;
      }
      if (obj.hasOwnProperty('cylinder')) {
        this.cylinder = obj.cylinder;
      }
      if (obj.hasOwnProperty('axis')) {
        this.axis = obj.axis;
      }
      if (obj.hasOwnProperty('prism')) {
        this.prism = [];
        for (const o of obj.prism || []) {
          this.prism.push(new VisionPrescriptionPrismComponent(o));
        }
      }
      if (obj.hasOwnProperty('add')) {
        this.add = obj.add;
      }
      if (obj.hasOwnProperty('power')) {
        this.power = obj.power;
      }
      if (obj.hasOwnProperty('backCurve')) {
        this.backCurve = obj.backCurve;
      }
      if (obj.hasOwnProperty('diameter')) {
        this.diameter = obj.diameter;
      }
      if (obj.hasOwnProperty('duration')) {
        this.duration = new SimpleQuantity(obj.duration);
      }
      if (obj.hasOwnProperty('color')) {
        this.color = obj.color;
      }
      if (obj.hasOwnProperty('brand')) {
        this.brand = obj.brand;
      }
      if (obj.hasOwnProperty('note')) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class VisionPrescription extends DomainResource {
  public resourceType = 'VisionPrescription';
  public identifier?: Identifier[];
  public status?: string;
  public patient?: ResourceReference;
  public encounter?: ResourceReference;
  public dateWritten?: Date;
  public prescriber?: ResourceReference;
  public reason?: Element;
  public dispense?: VisionPrescriptionDispenseComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('identifier')) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.hasOwnProperty('status')) {
        this.status = obj.status;
      }
      if (obj.hasOwnProperty('patient')) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.hasOwnProperty('encounter')) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.hasOwnProperty('dateWritten')) {
        this.dateWritten = obj.dateWritten;
      }
      if (obj.hasOwnProperty('prescriber')) {
        this.prescriber = new ResourceReference(obj.prescriber);
      }
      if (obj.hasOwnProperty('reason')) {
        this.reason = new Element(obj.reason);
      }
      if (obj.hasOwnProperty('dispense')) {
        this.dispense = [];
        for (const o of obj.dispense || []) {
          this.dispense.push(new VisionPrescriptionDispenseComponent(o));
        }
      }
    }
  }
}

export const classMapping = {
  'Account': Account,
  'ActivityDefinition': ActivityDefinition,
  'AdverseEvent': AdverseEvent,
  'AllergyIntolerance': AllergyIntolerance,
  'Appointment': Appointment,
  'AppointmentResponse': AppointmentResponse,
  'AuditEvent': AuditEvent,
  'Basic': Basic,
  'Binary': Binary,
  'BiologicallyDerivedProduct': BiologicallyDerivedProduct,
  'BodyStructure': BodyStructure,
  'Bundle': Bundle,
  'CapabilityStatement': CapabilityStatement,
  'CarePlan': CarePlan,
  'CareTeam': CareTeam,
  //'CatalogEntry': CatalogEntry,
  'ChargeItem': ChargeItem,
  'ChargeItemDefinition': ChargeItemDefinition,
  'Claim': Claim,
  'ClaimResponse': ClaimResponse,
  'ClinicalImpression': ClinicalImpression,
  'CodeSystem': CodeSystem,
  'Communication': Communication,
  'CommunicationRequest': CommunicationRequest,
  'CompartmentDefinition': CompartmentDefinition,
  'Composition': Composition,
  'ConceptMap': ConceptMap,
  'Condition': Condition,
  'Consent': Consent,
  'Contract': Contract,
  'Coverage': Coverage,
  'CoverageEligibilityRequest': CoverageEligibilityRequest,
  'CoverageEligibilityResponse': CoverageEligibilityResponse,
  'DetectedIssue': DetectedIssue,
  'Device': Device,
  'DeviceDefinition': DeviceDefinition,
  'DeviceMetric': DeviceMetric,
  'DeviceRequest': DeviceRequest,
  'DeviceUseStatement': DeviceUseStatement,
  'DiagnosticReport': DiagnosticReport,
  'DocumentManifest': DocumentManifest,
  'DocumentReference': DocumentReference,
  //'EffectEvidenceSynthesis': EffectEvidenceSynthesis,
  'Encounter': Encounter,
  'Endpoint': Endpoint,
  'EnrollmentRequest': EnrollmentRequest,
  'EnrollmentResponse': EnrollmentResponse,
  'EpisodeOfCare': EpisodeOfCare,
  'EventDefinition': EventDefinition,
  //'Evidence': Evidence,
  //'EvidenceVariable': EvidenceVariable,
  'ExampleScenario': ExampleScenario,
  'ExplanationOfBenefit': ExplanationOfBenefit,
  'FamilyMemberHistory': FamilyMemberHistory,
  'Flag': Flag,
  'Goal': Goal,
  'GraphDefinition': GraphDefinition,
  'Group': Group,
  'GuidanceResponse': GuidanceResponse,
  'HealthcareService': HealthcareService,
  'ImagingStudy': ImagingStudy,
  'Immunization': Immunization,
  'ImmunizationEvaluation': ImmunizationEvaluation,
  'ImmunizationRecommendation': ImmunizationRecommendation,
  'ImplementationGuide': ImplementationGuide,
  'InsurancePlan': InsurancePlan,
  'Invoice': Invoice,
  'Library': Library,
  'Linkage': Linkage,
  'List': List,
  'Location': Location,
  'Measure': Measure,
  'MeasureReport': MeasureReport,
  'Media': Media,
  'Medication': Medication,
  'MedicationAdministration': MedicationAdministration,
  'MedicationDispense': MedicationDispense,
  'MedicationKnowledge': MedicationKnowledge,
  'MedicationRequest': MedicationRequest,
  'MedicationStatement': MedicationStatement,
  'MedicinalProduct': MedicinalProduct,
  'MedicinalProductAuthorization': MedicinalProductAuthorization,
  'MedicinalProductContraindication': MedicinalProductContraindication,
  'MedicinalProductIndication': MedicinalProductIndication,
  'MedicinalProductIngredient': MedicinalProductIngredient,
  'MedicinalProductInteraction': MedicinalProductInteraction,
  'MedicinalProductManufactured': MedicinalProductManufactured,
  'MedicinalProductPackaged': MedicinalProductPackaged,
  'MedicinalProductPharmaceutical': MedicinalProductPharmaceutical,
  'MedicinalProductUndesirableEffect': MedicinalProductUndesirableEffect,
  'MessageDefinition': MessageDefinition,
  'MessageHeader': MessageHeader,
  //'MolecularSequence': MolecularSequence,
  'NamingSystem': NamingSystem,
  'NutritionOrder': NutritionOrder,
  'Observation': Observation,
  'ObservationDefinition': ObservationDefinition,
  'OperationDefinition': OperationDefinition,
  'OperationOutcome': OperationOutcome,
  'Organization': Organization,
  'OrganizationAffiliation': OrganizationAffiliation,
  'Parameters': Parameters,
  'Patient': Patient,
  'PaymentNotice': PaymentNotice,
  'PaymentReconciliation': PaymentReconciliation,
  'Person': Person,
  'PlanDefinition': PlanDefinition,
  'Practitioner': Practitioner,
  'PractitionerRole': PractitionerRole,
  'Procedure': Procedure,
  'Provenance': Provenance,
  'Questionnaire': Questionnaire,
  'QuestionnaireResponse': QuestionnaireResponse,
  'RelatedPerson': RelatedPerson,
  'RequestGroup': RequestGroup,
  //'ResearchDefinition': ResearchDefinition,
  //'ResearchElementDefinition': ResearchElementDefinition,
  'ResearchStudy': ResearchStudy,
  'ResearchSubject': ResearchSubject,
  'RiskAssessment': RiskAssessment,
  //'RiskEvidenceSynthesis': RiskEvidenceSynthesis,
  'Schedule': Schedule,
  'SearchParameter': SearchParameter,
  'ServiceRequest': ServiceRequest,
  'Slot': Slot,
  'Specimen': Specimen,
  'SpecimenDefinition': SpecimenDefinition,
  'StructureDefinition': StructureDefinition,
  'StructureMap': StructureMap,
  'Subscription': Subscription,
  'Substance': Substance,
  'SubstancePolymer': SubstancePolymer,
  //'SubstanceProtein': SubstanceProtein,
  'SubstanceReferenceInformation': SubstanceReferenceInformation,
  'SubstanceSpecification': SubstanceSpecification,
  //'SubstanceSourceMaterial': SubstanceSourceMaterial,
  'SupplyDelivery': SupplyDelivery,
  'SupplyRequest': SupplyRequest,
  'Task': Task,
  'TerminologyCapabilities': TerminologyCapabilities,
  'TestReport': TestReport,
  'TestScript': TestScript,
  'ValueSet': ValueSet,
  'VerificationResult': VerificationResult,
  'VisionPrescription': VisionPrescription,
};
