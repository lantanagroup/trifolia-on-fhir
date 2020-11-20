import '../date-extensions';
import {
  IAgentComponent, IAttachment,
  IAuditEvent,
  IBundle,
  ICodeableConcept,
  ICodeSystem,
  ICoding,
  IContactDetail,
  IContactPoint,
  IDetailComponent,
  IDomainResource,
  IElementDefinition,
  IElementDefinitionSlicing,
  IElementDefinitionType,
  IEntityComponent,
  IExtension,
  IHumanName,
  IImplementationGuide,
  INetworkComponent,
  IPractitioner,
  IResourceReference,
  IStructureDefinition,
  setChoice
} from '../fhirInterfaces';
import {Globals} from '../globals';

export class Base {
  public fhir_comments?: string[];

  constructor(obj?: any) {
    if (obj) {
      if (obj.fhir_comments) {
        this.fhir_comments = obj.fhir_comments;
      }
    }
  }
}

export class Element extends Base {
  public id?: string;
  public extension?: Extension[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.id) {
        this.id = obj.id;
      }
      if (obj.extension) {
        this.extension = [];
        for (const o of obj.extension || []) {
          this.extension.push(new Extension(o));
        }
      }
    }
  }

}

export class Extension extends Element implements IExtension {
  public url: string;
  public valueCode?: string;
  public valueCodeableConcept?: CodeableConcept;
  public valueCoding?: Coding;
  public valueBoolean?: boolean;
  public valueString?: string;
  public valueReference?: ResourceReference;
  public valueUri?: string;
  public valueMarkdown?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.hasOwnProperty('valueCode')) {
        this.valueCode = obj.valueCode;
      }
      if (obj.hasOwnProperty('valueString')) {
        this.valueString = obj.valueString;
      }
      if (obj.valueCodeableConcept) {
        this.valueCodeableConcept = obj.valueCodeableConcept;
      }
      if (obj.valueCoding) {
        this.valueCoding = obj.valueCoding;
      }
      if (obj.hasOwnProperty('valueBoolean')) {
        this.valueBoolean = obj.valueBoolean;
      }
      if (obj.valueReference) {
        this.valueReference = new ResourceReference(obj.valueReference);
      }
      if (obj.hasOwnProperty('valueMarkdown')) {
        this.valueMarkdown = obj.valueMarkdown;
      }
      if (obj.hasOwnProperty('valueUri')) {
        this.valueUri = obj.valueUri;
      }
    }
  }

}

export class Coding extends Element implements ICoding {
  public system?: string;
  public version?: string;
  public code?: string;
  public display?: string;
  public userSelected?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.display) {
        this.display = obj.display;
      }
      if (obj.userSelected) {
        this.userSelected = obj.userSelected;
      }
    }
  }

}

export class Meta extends Element {
  public versionId?: string;
  public lastUpdated?: string;
  public profile?: string[];
  public security?: Coding[];
  public tag?: Coding[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.versionId) {
        this.versionId = obj.versionId;
      }
      if (obj.lastUpdated) {
        this.lastUpdated = obj.lastUpdated;
      }
      if (obj.profile) {
        this.profile = obj.profile;
      }
      if (obj.security) {
        this.security = [];
        for (const o of obj.security || []) {
          this.security.push(new Coding(o));
        }
      }
      if (obj.tag) {
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
      if (obj.id) {
        this.id = obj.id;
      }
      if (obj.meta) {
        this.meta = new Meta(obj.meta);
      }
      if (obj.implicitRules) {
        this.implicitRules = obj.implicitRules;
      }
      if (obj.language) {
        this.language = obj.language;
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
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.div) {
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
      this.resourceType = obj.resourceType;
      if (obj.text) {
        this.text = new Narrative(obj.text);
      }
      if (obj.contained) {
        this.contained = [];
        for (const o of obj.contained || []) {
          if (o.resourceType && classMapping[o.resourceType]) {
            const contained = new classMapping[o.resourceType](o);
            this.contained.push(<DomainResource> contained);
          }
        }
      }
      if (obj.extension) {
        this.extension = [];
        for (const o of obj.extension || []) {
          this.extension.push(new Extension(o));
        }
      }
      if (obj.modifierExtension) {
        this.modifierExtension = [];
        for (const o of obj.modifierExtension || []) {
          this.modifierExtension.push(new Extension(o));
        }
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
      if (obj.coding) {
        this.coding = [];
        for (const o of obj.coding || []) {
          this.coding.push(new Coding(o));
        }
      }
      if (obj.text) {
        this.text = obj.text;
      }
    }
  }

}

export class Period extends Element {
  public start?: Date;
  public end?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.start) {
        this.start = new Date(obj.start);
      }
      if (obj.end) {
        this.end = new Date(obj.end);
      }
    }
  }

}

export class ResourceReference extends Element implements IResourceReference {
  public reference?: string;
  public identifier?: Identifier;
  public display?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.reference) {
        this.reference = obj.reference;
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.display) {
        this.display = obj.display;
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
      if (obj.use) {
        this.use = obj.use;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.value) {
        this.value = obj.value;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.assigner) {
        this.assigner = new ResourceReference(obj.assigner);
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
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.value) {
        this.value = obj.value;
      }
      if (obj.use) {
        this.use = obj.use;
      }
      if (obj.rank) {
        this.rank = obj.rank;
      }
      if (obj.period) {
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
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.telecom) {
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
  public valueCodeableConcept?: CodeableConcept;
  public valueQuantity?: Quantity;
  public valueRange?: Range;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = new Coding(obj.code);
      }
      if (obj.valueCodeableConcept) {
        this.valueCodeableConcept = new CodeableConcept(obj.valueQuantity);
      }
      if (obj.valueQuantity) {
        this.valueQuantity = new Quantity(obj.valueQuantity);
      }
      if (obj.valueRange) {
        this.valueRange = new Range(obj.valueRange);
      }
    }
  }

}

export class BackboneElement extends Element {
  public modifierExtension?: Extension[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.modifierExtension) {
        this.modifierExtension = [];
        for (const o of obj.modifierExtension || []) {
          this.modifierExtension.push(new Extension(o));
        }
      }
    }
  }

}

export class ElementDefinitionMappingComponent extends BackboneElement {
  public identity: string;
  public language?: string;
  public map: string;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identity) {
        this.identity = obj.identity;
      }
      if (obj.language) {
        this.language = obj.language;
      }
      if (obj.map) {
        this.map = obj.map;
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
    }
  }

}

export class MappingComponent extends BackboneElement {
  public identity: string;
  public uri?: string;
  public name?: string;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identity) {
        this.identity = obj.identity;
      }
      if (obj.uri) {
        this.uri = obj.uri;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
    }
  }

}

export class DiscriminatorComponent extends Element {
  public type: string;
  public path: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.path) {
        this.path = obj.path;
      }
    }
  }
}

export class SlicingComponent extends Element implements IElementDefinitionSlicing {
  public discriminator?: DiscriminatorComponent[];
  public description?: string;
  public ordered?: boolean;
  public rules: 'closed'|'open'|'openAtEnd';

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.discriminator) {
        this.discriminator = [];
        for (const o of obj.discriminator || []) {
          this.discriminator.push(new DiscriminatorComponent(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.ordered) {
        this.ordered = obj.ordered;
      }
      if (obj.rules) {
        this.rules = obj.rules;
      }
    }
  }

}

export class BaseComponent extends Element {
  public path: string;
  public min: number;
  public max: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.path) {
        this.path = obj.path;
      }
      if (obj.min) {
        this.min = obj.min;
      }
      if (obj.max) {
        this.max = obj.max;
      }
    }
  }

}

export class TypeRefComponent extends Element implements IElementDefinitionType {
  public code: string;
  public profile?: string;
  public _profile?: Element | Element[];
  public targetProfile?: string;
  public aggregation?: string[];
  public versioning?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.profile) {
        this.profile = obj.profile;
      }
      if (obj.targetProfile) {
        this.targetProfile = obj.targetProfile;
      }
      if (obj.aggregation) {
        this.aggregation = obj.aggregation;
      }
      if (obj.versioning) {
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

export class ExampleComponent extends Element {
  public label: string;

  // Value Choices
  public valueBoolean?: string;
  public valueInteger?: boolean;
  public valueDecimal?: string;
  public valueBase64Binary?: string;
  public valueInstant?: string;
  public valueString?: string;
  public valueUri?: number;
  public valueDate?: string;
  public valueDateTime?: number;
  public valueTime?: number;
  public valueCode?: string;
  public valueOid?: string;
  public valueId?: number;
  public valueUnsignedInt?: string;
  public valuePositiveInt?: string;
  public valueMarkdown?: number;
  public valueAnnotation?: string;
  public valueAttachment?: string;
  public valueIdentifier?: string;
  public valueCodeableConcept?: CodeableConcept;
  public valueCoding?: Coding;
  public valueQuantity?: Quantity;
  public valueRange?: Range;
  public valuePeriod?: Period;
  public valueRatio?: Ratio;
  public valueSampledData?: SampledData;
  public valueSignature?: Signature;
  public valueHumanName?: HumanName;
  public valueAddress?: Address;
  public valueContactPoint?: ContactPoint;
  public valueTiming?: Timing;
  public valueReference?: ResourceReference;
  public valueMeta?: Meta;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.label) {
        this.label = obj.label;
      }

      setChoice(obj, this, 'value', 'boolean', 'integer', 'decimal', 'base64Binary', 'instant', 'string', 'uri', 'date', 'dateTime', 'time', 'code', 'oid', 'id', 'unsignedInt', 'positiveInt', 'markdown', 'Annotation', 'Attachment', 'Identifier', 'CodeableConcept', 'Coding', 'Quantity', 'Range', 'Period', 'Ratio', 'SampledData', 'Signature', 'HumanName', 'Address', 'ContactPoint', 'Timing', 'Reference', 'Meta');
    }
  }
}

export class ConstraintComponent extends Element {
  public key: string;
  public requirements?: string;
  public severity: string;
  public human: string;
  public expression: string;
  public xpath?: string;
  public source?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.key) {
        this.key = obj.key;
      }
      if (obj.requirements) {
        this.requirements = obj.requirements;
      }
      if (obj.severity) {
        this.severity = obj.severity;
      }
      if (obj.human) {
        this.human = obj.human;
      }
      if (obj.expression) {
        this.expression = obj.expression;
      }
      if (obj.xpath) {
        this.xpath = obj.xpath;
      }
      if (obj.source) {
        this.source = obj.source;
      }
    }
  }

}

export class ElementDefinitionBindingComponent extends Element {
  public strength: string;
  public description?: string;
  public valueSetUri?: string;
  public valueSetReference?: ResourceReference;

  public get valueSet(): string | ResourceReference {
    return this.valueSetUri || this.valueSetReference;
  }

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.strength) {
        this.strength = obj.strength;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.valueSetUri) {
        this.valueSetUri = obj.valueSetUri;
      }
      if (obj.valueSetReference) {
        this.valueSetReference = new ResourceReference(obj.valueSetReference);
      }
    }
  }

}

export class ElementDefinition extends Element implements IElementDefinition {
  public path: string;
  public representation?: string[];
  public sliceName?: string;
  public label?: string;
  public code?: Coding[];
  public slicing?: SlicingComponent;
  public short?: string;
  public definition?: string;
  public comment?: string;
  public requirements?: string;
  public alias?: string[];
  public min?: number;
  public max?: string;
  public base?: BaseComponent;
  public contentReference?: string;
  public type?: TypeRefComponent[];
  public defaultValue?: Element;
  public meaningWhenMissing?: string;
  public orderMeaning?: string;
  public example?: ExampleComponent[];
  public maxLength?: number;
  public condition?: string[];
  public constraint?: ConstraintComponent[];
  public mustSupport?: boolean;
  public isModifier?: boolean;
  public isSummary?: boolean;
  public binding?: ElementDefinitionBindingComponent;
  public mapping?: ElementDefinitionMappingComponent[];

  // Fixed Choices
  public fixedBoolean?: string;
  public fixedInteger?: boolean;
  public fixedDecimal?: string;
  public fixedBase64Binary?: string;
  public fixedInstant?: string;
  public fixedString?: string;
  public fixedUri?: number;
  public fixedDate?: string;
  public fixedDateTime?: number;
  public fixedTime?: number;
  public fixedCode?: string;
  public fixedOid?: string;
  public fixedId?: number;
  public fixedUnsignedInt?: string;
  public fixedPositiveInt?: string;
  public fixedMarkdown?: number;
  public fixedAnnotation?: string;
  public fixedAttachment?: string;
  public fixedIdentifier?: string;
  public fixedCodeableConcept?: CodeableConcept;
  public fixedCoding?: Coding;
  public fixedQuantity?: Quantity;
  public fixedRange?: Range;
  public fixedPeriod?: Period;
  public fixedRatio?: Ratio;
  public fixedSampledData?: SampledData;
  public fixedSignature?: Signature;
  public fixedHumanName?: HumanName;
  public fixedAddress?: Address;
  public fixedContactPoint?: ContactPoint;
  public fixedTiming?: Timing;
  public fixedReference?: ResourceReference;
  public fixedMeta?: Meta;

  // Pattern Choices
  public patternBoolean?: string;
  public patternInteger?: boolean;
  public patternDecimal?: string;
  public patternBase64Binary?: string;
  public patternInstant?: string;
  public patternString?: string;
  public patternUri?: number;
  public patternDate?: string;
  public patternDateTime?: number;
  public patternTime?: number;
  public patternCode?: string;
  public patternOid?: string;
  public patternId?: number;
  public patternUnsignedInt?: string;
  public patternPositiveInt?: string;
  public patternMarkdown?: number;
  public patternAnnotation?: string;
  public patternAttachment?: string;
  public patternIdentifier?: string;
  public patternCodeableConcept?: CodeableConcept;
  public patternCoding?: Coding;
  public patternQuantity?: Quantity;
  public patternRange?: Range;
  public patternPeriod?: Period;
  public patternRatio?: Ratio;
  public patternSampledData?: SampledData;
  public patternSignature?: Signature;
  public patternHumanName?: HumanName;
  public patternAddress?: Address;
  public patternContactPoint?: ContactPoint;
  public patternTiming?: Timing;
  public patternReference?: ResourceReference;
  public patternMeta?: Meta;

  // Min Value Choices
  public minValueBoolean?: string;
  public minValueInteger?: boolean;
  public minValueDecimal?: string;
  public minValueBase64Binary?: string;
  public minValueInstant?: string;
  public minValueString?: string;
  public minValueUri?: number;
  public minValueDate?: string;
  public minValueDateTime?: number;
  public minValueTime?: number;
  public minValueCode?: string;
  public minValueOid?: string;
  public minValueId?: number;
  public minValueUnsignedInt?: string;
  public minValuePositiveInt?: string;
  public minValueMarkdown?: number;
  public minValueAnnotation?: string;
  public minValueAttachment?: string;
  public minValueIdentifier?: string;
  public minValueCodeableConcept?: CodeableConcept;
  public minValueCoding?: Coding;
  public minValueQuantity?: Quantity;
  public minValueRange?: Range;
  public minValuePeriod?: Period;
  public minValueRatio?: Ratio;
  public minValueSampledData?: SampledData;
  public minValueSignature?: Signature;
  public minValueHumanName?: HumanName;
  public minValueAddress?: Address;
  public minValueContactPoint?: ContactPoint;
  public minValueTiming?: Timing;
  public minValueReference?: ResourceReference;
  public minValueMeta?: Meta;

  // Max Value Choices
  public maxValueBoolean?: string;
  public maxValueInteger?: boolean;
  public maxValueDecimal?: string;
  public maxValueBase64Binary?: string;
  public maxValueInstant?: string;
  public maxValueString?: string;
  public maxValueUri?: number;
  public maxValueDate?: string;
  public maxValueDateTime?: number;
  public maxValueTime?: number;
  public maxValueCode?: string;
  public maxValueOid?: string;
  public maxValueId?: number;
  public maxValueUnsignedInt?: string;
  public maxValuePositiveInt?: string;
  public maxValueMarkdown?: number;
  public maxValueAnnotation?: string;
  public maxValueAttachment?: string;
  public maxValueIdentifier?: string;
  public maxValueCodeableConcept?: CodeableConcept;
  public maxValueCoding?: Coding;
  public maxValueQuantity?: Quantity;
  public maxValueRange?: Range;
  public maxValuePeriod?: Period;
  public maxValueRatio?: Ratio;
  public maxValueSampledData?: SampledData;
  public maxValueSignature?: Signature;
  public maxValueHumanName?: HumanName;
  public maxValueAddress?: Address;
  public maxValueContactPoint?: ContactPoint;
  public maxValueTiming?: Timing;
  public maxValueReference?: ResourceReference;
  public maxValueMeta?: Meta;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.path) {
        this.path = obj.path;
      }
      if (obj.representation) {
        this.representation = obj.representation;
      }
      if (obj.sliceName) {
        this.sliceName = obj.sliceName;
      }
      if (obj.label) {
        this.label = obj.label;
      }
      if (obj.code) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new Coding(o));
        }
      }
      if (obj.slicing) {
        this.slicing = new SlicingComponent(obj.slicing);
      }
      if (obj.short) {
        this.short = obj.short;
      }
      if (obj.definition) {
        this.definition = obj.definition;
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
      if (obj.requirements) {
        this.requirements = obj.requirements;
      }
      if (obj.alias) {
        this.alias = obj.alias;
      }
      if (obj.min) {
        this.min = obj.min;
      }
      if (obj.max) {
        this.max = obj.max;
      }
      if (obj.base) {
        this.base = new BaseComponent(obj.base);
      }
      if (obj.contentReference) {
        this.contentReference = obj.contentReference;
      }
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new TypeRefComponent(o));
        }
      }
      if (obj.defaultValue) {
        this.defaultValue = new Element(obj.defaultValue);
      }
      if (obj.meaningWhenMissing) {
        this.meaningWhenMissing = obj.meaningWhenMissing;
      }
      if (obj.orderMeaning) {
        this.orderMeaning = obj.orderMeaning;
      }
      if (obj.example) {
        this.example = [];
        for (const o of obj.example || []) {
          this.example.push(new ExampleComponent(o));
        }
      }
      if (obj.maxLength) {
        this.maxLength = obj.maxLength;
      }
      if (obj.condition) {
        this.condition = obj.condition;
      }
      if (obj.constraint) {
        this.constraint = [];
        for (const o of obj.constraint || []) {
          this.constraint.push(new ConstraintComponent(o));
        }
      }
      if (obj.mustSupport) {
        this.mustSupport = obj.mustSupport;
      }
      if (obj.isModifier) {
        this.isModifier = obj.isModifier;
      }
      if (obj.isSummary) {
        this.isSummary = obj.isSummary;
      }
      if (obj.binding) {
        this.binding = new ElementDefinitionBindingComponent(obj.binding);
      }
      if (obj.mapping) {
        this.mapping = [];
        for (const o of obj.mapping || []) {
          this.mapping.push(new ElementDefinitionMappingComponent(o));
        }
      }

      setChoice(obj, this, 'fixed', 'boolean', 'integer', 'decimal', 'base64Binary', 'instant', 'string', 'uri', 'date', 'dateTime', 'time', 'code', 'oid', 'id', 'unsignedInt', 'positiveInt', 'markdown', 'Annotation', 'Attachment', 'Identifier', 'CodeableConcept', 'Coding', 'Quantity', 'Range', 'Period', 'Ratio', 'SampledData', 'Signature', 'HumanName', 'Address', 'ContactPoint', 'Timing', 'Reference', 'Meta');
      setChoice(obj, this, 'pattern', 'boolean', 'integer', 'decimal', 'base64Binary', 'instant', 'string', 'uri', 'date', 'dateTime', 'time', 'code', 'oid', 'id', 'unsignedInt', 'positiveInt', 'markdown', 'Annotation', 'Attachment', 'Identifier', 'CodeableConcept', 'Coding', 'Quantity', 'Range', 'Period', 'Ratio', 'SampledData', 'Signature', 'HumanName', 'Address', 'ContactPoint', 'Timing', 'Reference', 'Meta');
      setChoice(obj, this, 'minValue', 'date', 'dateTime', 'instant', 'time', 'decimal', 'integer', 'positiveInt', 'unsignedInt', 'Quantity');
      setChoice(obj, this, 'maxValue', 'date', 'dateTime', 'instant', 'time', 'decimal', 'integer', 'positiveInt', 'unsignedInt', 'Quantity');
    }
  }

}

export class SnapshotComponent extends BackboneElement {
  public element: ElementDefinition[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.element) {
        this.element = [];
        for (const o of obj.element || []) {
          this.element.push(new ElementDefinition(o));
        }
      }
    }
  }

}

export class DifferentialComponent extends BackboneElement {
  public element: ElementDefinition[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.element) {
        this.element = [];
        for (const o of obj.element || []) {
          this.element.push(new ElementDefinition(o));
        }
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
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public keyword?: Coding[];
  public fhirVersion?: string;
  public mapping?: MappingComponent[];
  public kind: 'primitive-type'|'complex-type'|'resource'|'logical' = 'resource';
  public abstract = false;
  public contextType?: string;
  public context?: string[];
  public contextInvariant?: string[];
  public type: string;
  public baseDefinition?: string;
  public derivation = 'constraint';
  public snapshot?: SnapshotComponent;
  public differential?: DifferentialComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.keyword) {
        this.keyword = [];
        for (const o of obj.keyword || []) {
          this.keyword.push(new Coding(o));
        }
      }
      if (obj.fhirVersion) {
        this.fhirVersion = obj.fhirVersion;
      }
      if (obj.mapping) {
        this.mapping = [];
        for (const o of obj.mapping || []) {
          this.mapping.push(new MappingComponent(o));
        }
      }
      if (obj.kind) {
        this.kind = obj.kind;
      }
      if (obj.abstract) {
        this.abstract = obj.abstract;
      }
      if (obj.contextType) {
        this.contextType = obj.contextType;
      }
      if (obj.context) {
        this.context = obj.context;
      }
      if (obj.contextInvariant) {
        this.contextInvariant = obj.contextInvariant;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.baseDefinition) {
        this.baseDefinition = obj.baseDefinition;
      }
      if (obj.derivation) {
        this.derivation = obj.derivation;
      }
      if (obj.snapshot) {
        this.snapshot = new SnapshotComponent(obj.snapshot);
      }
      if (obj.differential) {
        this.differential = new DifferentialComponent(obj.differential);
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

export class ParameterComponent extends BackboneElement {
  public name: string;
  public use: string;
  public min: number;
  public max: string;
  public documentation: string;
  public type?: string;
  public searchType?: string;
  public profile?: ResourceReference;
  public binding?: ParameterBindingComponent;
  public part?: ParameterComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.use) {
        this.use = obj.use;
      }
      if (obj.min) {
        this.min = obj.min;
      }
      if (obj.max) {
        this.max = obj.max;
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.searchType) {
        this.searchType = obj.searchType;
      }
      if (obj.profile) {
        this.profile = new ResourceReference(obj.profile);
      }
      if (obj.binding) {
        this.binding = new ParameterBindingComponent(obj.binding);
      }
      if (obj.part) {
        this.part = [];
        for (const o of obj.part || []) {
          this.part.push(new ParameterComponent(o));
        }
      }
    }
  }
}

export class ParameterBindingComponent extends BackboneElement {
  public strength: string;
  public valueSetUri?: string;
  public valueSetReference?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.strength) {
        this.strength = obj.strength;
      }
      if (obj.valueSetUri) {
        this.valueSetUri = obj.valueSetUri;
      }
      if (obj.valueSetReference) {
        this.valueSetReference = new ResourceReference(obj.valueSetReference);
      }
    }
  }

  public get valueSet(): string | ResourceReference {
    if (this.hasOwnProperty('valueSetUri')) {
      return this.valueSetUri;
    } else if (this.hasOwnProperty('valueSetReference')) {
      return this.valueSetReference;
    }
  }

  public set valueSet(value: string | ResourceReference) {
    if (typeof value === 'string') {
      this.valueSetUri = value;
      delete this.valueSetReference;
    } else if (value instanceof ResourceReference) {
      this.valueSetReference = value;
      delete this.valueSetUri;
    }
  }
}

export class Parameters extends Resource {
  public resourceType = 'Parameters';
  public parameter?: ParameterComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.parameter) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new ParameterComponent(o));
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

export class LinkComponent extends BackboneElement {
  public relation: string;
  public url: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.relation) {
        this.relation = obj.relation;
      }
      if (obj.url) {
        this.url = obj.url;
      }
    }
  }

}

export class
SearchComponent extends BackboneElement {
  public mode?: string;
  public score?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.score) {
        this.score = obj.score;
      }
    }
  }

}

export class RequestComponent extends BackboneElement {
  public method: 'GET'|'POST'|'PUT'|'DELETE';
  public url: string;
  public ifNoneMatch?: string;
  public ifModifiedSince?: Date;
  public ifMatch?: string;
  public ifNoneExist?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.method) {
        this.method = obj.method;
      }
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.ifNoneMatch) {
        this.ifNoneMatch = obj.ifNoneMatch;
      }
      if (obj.ifModifiedSince) {
        this.ifModifiedSince = new Date(obj.ifModifiedSince);
      }
      if (obj.ifMatch) {
        this.ifMatch = obj.ifMatch;
      }
      if (obj.ifNoneExist) {
        this.ifNoneExist = obj.ifNoneExist;
      }
    }
  }

}

export class ResponseComponent extends BackboneElement {
  public status: string;
  public location?: string;
  public etag?: string;
  public lastModified?: Date;
  public outcome?: DomainResource;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.location) {
        this.location = obj.location;
      }
      if (obj.etag) {
        this.etag = obj.etag;
      }
      if (obj.lastModified) {
        this.lastModified = new Date(obj.lastModified);
      }
      if (obj.outcome) {
        this.outcome = new DomainResource(obj.outcome);
      }
    }
  }

}

export class EntryComponent extends BackboneElement {
  public link?: LinkComponent[];
  public fullUrl?: string;
  public resource?: DomainResource;
  public search?: SearchComponent;
  public request?: RequestComponent;
  public response?: ResponseComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.link) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new LinkComponent(o));
        }
      }
      if (obj.fullUrl) {
        this.fullUrl = obj.fullUrl;
      }
      if (obj.resource) {
        this.resource = new DomainResource(obj.resource);
      }
      if (obj.search) {
        this.search = new SearchComponent(obj.search);
      }
      if (obj.request) {
        this.request = new RequestComponent(obj.request);
      }
      if (obj.response) {
        this.response = new ResponseComponent(obj.response);
      }
    }
  }

}

export class ResourceEntry extends EntryComponent {

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
  public category?: CodeableConcept;
  public code: CodeableConcept;
  public subject: ResourceReference;
  public period?: Period;
  public encounter?: ResourceReference;
  public author?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.encounter) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.author) {
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
      if (obj.value) {
        this.value = obj.value;
      }
      if (obj.comparator) {
        this.comparator = obj.comparator;
      }
      if (obj.unit) {
        this.unit = obj.unit;
      }
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.code) {
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
      if (obj.low) {
        this.low = new Quantity(obj.low);
      }
      if (obj.high) {
        this.high = new Quantity(obj.high);
      }
    }
  }

}

export class ReferenceRangeComponent extends BackboneElement {
  public low?: SimpleQuantity;
  public high?: SimpleQuantity;
  public type?: CodeableConcept;
  public appliesTo?: CodeableConcept[];
  public age?: Range;
  public text?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.low) {
        this.low = new SimpleQuantity(obj.low);
      }
      if (obj.high) {
        this.high = new SimpleQuantity(obj.high);
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.appliesTo) {
        this.appliesTo = [];
        for (const o of obj.appliesTo || []) {
          this.appliesTo.push(new CodeableConcept(o));
        }
      }
      if (obj.age) {
        this.age = new Range(obj.age);
      }
      if (obj.text) {
        this.text = obj.text;
      }
    }
  }

}

export class RelatedComponent extends BackboneElement {
  public type?: string;
  public target: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.target) {
        this.target = new ResourceReference(obj.target);
      }
    }
  }

}

export class ComponentComponent extends BackboneElement {
  public code: CodeableConcept;
  public value?: Element;
  public dataAbsentReason?: CodeableConcept;
  public interpretation?: CodeableConcept;
  public referenceRange?: ReferenceRangeComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.value) {
        this.value = new Element(obj.value);
      }
      if (obj.dataAbsentReason) {
        this.dataAbsentReason = new CodeableConcept(obj.dataAbsentReason);
      }
      if (obj.interpretation) {
        this.interpretation = new CodeableConcept(obj.interpretation);
      }
      if (obj.referenceRange) {
        this.referenceRange = [];
        for (const o of obj.referenceRange || []) {
          this.referenceRange.push(new ReferenceRangeComponent(o));
        }
      }
    }
  }

}

export class Observation extends DomainResource {
  public resourceType = 'Observation';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference[];
  public status: string;
  public category?: CodeableConcept[];
  public code: CodeableConcept;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public effective?: Element;
  public issued?: Date;
  public performer?: ResourceReference[];
  public value?: Element;
  public dataAbsentReason?: CodeableConcept;
  public interpretation?: CodeableConcept;
  public comment?: string;
  public bodySite?: CodeableConcept;
  public method?: CodeableConcept;
  public specimen?: ResourceReference;
  public device?: ResourceReference;
  public referenceRange?: ReferenceRangeComponent[];
  public related?: RelatedComponent[];
  public component?: ComponentComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.effective) {
        this.effective = new Element(obj.effective);
      }
      if (obj.issued) {
        this.issued = new Date(obj.issued);
      }
      if (obj.performer) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new ResourceReference(o));
        }
      }
      if (obj.value) {
        this.value = new Element(obj.value);
      }
      if (obj.dataAbsentReason) {
        this.dataAbsentReason = new CodeableConcept(obj.dataAbsentReason);
      }
      if (obj.interpretation) {
        this.interpretation = new CodeableConcept(obj.interpretation);
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
      if (obj.bodySite) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.method) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.specimen) {
        this.specimen = new ResourceReference(obj.specimen);
      }
      if (obj.device) {
        this.device = new ResourceReference(obj.device);
      }
      if (obj.referenceRange) {
        this.referenceRange = [];
        for (const o of obj.referenceRange || []) {
          this.referenceRange.push(new ReferenceRangeComponent(o));
        }
      }
      if (obj.related) {
        this.related = [];
        for (const o of obj.related || []) {
          this.related.push(new RelatedComponent(o));
        }
      }
      if (obj.component) {
        this.component = [];
        for (const o of obj.component || []) {
          this.component.push(new ComponentComponent(o));
        }
      }
    }
  }

}

export class Binary extends Resource {
  public resourceType = 'Binary';
  public contentType: string;
  public securityContext?: ResourceReference;
  public content: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.contentType) {
        this.contentType = obj.contentType;
      }
      if (obj.securityContext) {
        this.securityContext = new ResourceReference(obj.securityContext);
      }
      if (obj.content) {
        this.content = obj.content;
      }
    }
  }

}

export class Signature extends Element {
  public type: Coding[];
  public when: Date;
  public who: Element;
  public onBehalfOf?: Element;
  public contentType?: string;
  public blob?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new Coding(o));
        }
      }
      if (obj.when) {
        this.when = new Date(obj.when);
      }
      if (obj.who) {
        this.who = new Element(obj.who);
      }
      if (obj.onBehalfOf) {
        this.onBehalfOf = new Element(obj.onBehalfOf);
      }
      if (obj.contentType) {
        this.contentType = obj.contentType;
      }
      if (obj.blob) {
        this.blob = obj.blob;
      }
    }
  }

}

export type BundleTypes = 'document'|'message'|'transaction'|'transaction-response'|'batch'|'batch-response'|'history'|'searchset'|'collection';

export class Bundle extends Resource implements IBundle {
  public resourceType = 'Bundle';
  public identifier?: Identifier;
  public type: BundleTypes;
  public total?: number;
  public link?: LinkComponent[];
  public entry?: EntryComponent[] = [];
  public signature?: Signature;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.total) {
        this.total = obj.total;
      }
      if (obj.link) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new LinkComponent(o));
        }
      }
      if (obj.entry) {
        this.entry = [];
        for (const o of obj.entry || []) {
          this.entry.push(new EntryComponent(o));
        }
      }
      if (obj.signature) {
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

export class FilterComponent extends BackboneElement {
  public code: string;
  public description?: string;
  public operator: string[];
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.operator) {
        this.operator = obj.operator;
      }
      if (obj.value) {
        this.value = obj.value;
      }
    }
  }

}

export class PropertyComponent extends BackboneElement {
  public code: string;
  public uri?: string;
  public description?: string;
  public type: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.uri) {
        this.uri = obj.uri;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.type) {
        this.type = obj.type;
      }
    }
  }

}

export class DesignationComponent extends BackboneElement {
  public language?: string;
  public use?: Coding;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.language) {
        this.language = obj.language;
      }
      if (obj.use) {
        this.use = new Coding(obj.use);
      }
      if (obj.value) {
        this.value = obj.value;
      }
    }
  }

}

export class ConceptPropertyComponent extends BackboneElement {
  public code: string;
  public valueString: string;
  public valueCoding: Coding;
  public valueCode: string;
  public valueInteger: number;
  public valueBoolean: boolean;
  public valueDateTime: string;

  public get value(): string | number | boolean | Coding {
    if (this.hasOwnProperty('valueCode')) {
      return this.valueCode;
    }
    if (this.hasOwnProperty('valueCoding')) {
      return this.valueCoding;
    }
    if (this.hasOwnProperty('valueString')) {
      return this.valueString;
    }
    if (this.hasOwnProperty('valueInteger')) {
      return this.valueInteger;
    }
    if (this.hasOwnProperty('valueBoolean')) {
      return this.valueBoolean;
    }
    if (this.hasOwnProperty('valueDateTime')) {
      return this.valueDateTime;
    }

    return;
  }

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.valueCode) {
        this.valueCode = obj.valueCode;
      }
      if (obj.valueCoding) {
        this.valueCoding = new Coding(obj.valueCoding);
      }
      if (obj.valueString) {
        this.valueString = obj.valueString;
      }
      if (obj.hasOwnProperty('valueInteger')) {
        this.valueInteger = obj.valueInteger;
      }
      if (obj.hasOwnProperty('valueBoolean')) {
        this.valueBoolean = obj.valueBoolean;
      }
      if (obj.valueDateTime) {
        this.valueDateTime = obj.valueDateTime;
      }
    }
  }

}

export class ConceptDefinitionComponent extends BackboneElement {
  public code: string;
  public display?: string;
  public definition?: string;
  public designation?: DesignationComponent[];
  public property?: ConceptPropertyComponent[];
  public concept?: ConceptDefinitionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.display) {
        this.display = obj.display;
      }
      if (obj.definition) {
        this.definition = obj.definition;
      }
      if (obj.designation) {
        this.designation = [];
        for (const o of obj.designation || []) {
          this.designation.push(new DesignationComponent(o));
        }
      }
      if (obj.property) {
        this.property = [];
        for (const o of obj.property || []) {
          this.property.push(new ConceptPropertyComponent(o));
        }
      }
      if (obj.concept) {
        this.concept = [];
        for (const o of obj.concept || []) {
          this.concept.push(new ConceptDefinitionComponent(o));
        }
      }
    }
  }

}

export class CodeSystem extends DomainResource implements ICodeSystem {
  public resourceType = 'CodeSystem';
  public url?: string;
  public identifier?: Identifier;
  public version?: string;
  public name?: string;
  public title?: string;
  public status = 'draft';
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
  public content = 'not-present';
  public count?: number;
  public filter?: FilterComponent[];
  public property?: PropertyComponent[];
  public concept?: ConceptDefinitionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.caseSensitive) {
        this.caseSensitive = obj.caseSensitive;
      }
      if (obj.valueSet) {
        this.valueSet = obj.valueSet;
      }
      if (obj.hierarchyMeaning) {
        this.hierarchyMeaning = obj.hierarchyMeaning;
      }
      if (obj.compositional) {
        this.compositional = obj.compositional;
      }
      if (obj.versionNeeded) {
        this.versionNeeded = obj.versionNeeded;
      }
      if (obj.content) {
        this.content = obj.content;
      }
      if (obj.count) {
        this.count = obj.count;
      }
      if (obj.filter) {
        this.filter = [];
        for (const o of obj.filter || []) {
          this.filter.push(new FilterComponent(o));
        }
      }
      if (obj.property) {
        this.property = [];
        for (const o of obj.property || []) {
          this.property.push(new PropertyComponent(o));
        }
      }
      if (obj.concept) {
        this.concept = [];
        for (const o of obj.concept || []) {
          this.concept.push(new ConceptDefinitionComponent(o));
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

export class OtherElementComponent extends BackboneElement {
  public property: string;
  public system?: string;
  public code: string;
  public display?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.property) {
        this.property = obj.property;
      }
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.display) {
        this.display = obj.display;
      }
    }
  }

}

export class TargetElementComponent extends BackboneElement {
  public code?: string;
  public display?: string;
  public equivalence?: string;
  public comment?: string;
  public dependsOn?: OtherElementComponent[];
  public product?: OtherElementComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.display) {
        this.display = obj.display;
      }
      if (obj.equivalence) {
        this.equivalence = obj.equivalence;
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
      if (obj.dependsOn) {
        this.dependsOn = [];
        for (const o of obj.dependsOn || []) {
          this.dependsOn.push(new OtherElementComponent(o));
        }
      }
      if (obj.product) {
        this.product = [];
        for (const o of obj.product || []) {
          this.product.push(new OtherElementComponent(o));
        }
      }
    }
  }

}

export class SourceElementComponent extends BackboneElement {
  public code?: string;
  public display?: string;
  public target?: TargetElementComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.display) {
        this.display = obj.display;
      }
      if (obj.target) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new TargetElementComponent(o));
        }
      }
    }
  }

}

export class UnmappedComponent extends BackboneElement {
  public mode: string;
  public code?: string;
  public display?: string;
  public url?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.display) {
        this.display = obj.display;
      }
      if (obj.url) {
        this.url = obj.url;
      }
    }
  }

}

export class GroupComponent extends BackboneElement {
  public source?: string;
  public sourceVersion?: string;
  public target?: string;
  public targetVersion?: string;
  public element: SourceElementComponent[];
  public unmapped?: UnmappedComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.source) {
        this.source = obj.source;
      }
      if (obj.sourceVersion) {
        this.sourceVersion = obj.sourceVersion;
      }
      if (obj.target) {
        this.target = obj.target;
      }
      if (obj.targetVersion) {
        this.targetVersion = obj.targetVersion;
      }
      if (obj.element) {
        this.element = [];
        for (const o of obj.element || []) {
          this.element.push(new SourceElementComponent(o));
        }
      }
      if (obj.unmapped) {
        this.unmapped = new UnmappedComponent(obj.unmapped);
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
  public group?: GroupComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.source) {
        this.source = new Element(obj.source);
      }
      if (obj.target) {
        this.target = new Element(obj.target);
      }
      if (obj.group) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new GroupComponent(o));
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

export class Money extends Quantity {

  constructor(obj?: any) {
    super(obj);
    if (obj) {
    }
  }

}

export class CoverageComponent extends BackboneElement {
  public coverage: ResourceReference;
  public priority?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.coverage) {
        this.coverage = new ResourceReference(obj.coverage);
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
    }
  }

}

export class GuarantorComponent extends BackboneElement {
  public party: ResourceReference;
  public onHold?: boolean;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.party) {
        this.party = new ResourceReference(obj.party);
      }
      if (obj.onHold) {
        this.onHold = obj.onHold;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class Account extends DomainResource {
  public resourceType = 'Account';
  public identifier?: Identifier[];
  public status?: string;
  public type?: CodeableConcept;
  public name?: string;
  public subject?: ResourceReference;
  public period?: Period;
  public active?: Period;
  public balance?: Money;
  public coverage?: CoverageComponent[];
  public owner?: ResourceReference;
  public description?: string;
  public guarantor?: GuarantorComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.active) {
        this.active = new Period(obj.active);
      }
      if (obj.balance) {
        this.balance = new Money(obj.balance);
      }
      if (obj.coverage) {
        this.coverage = [];
        for (const o of obj.coverage || []) {
          this.coverage.push(new CoverageComponent(o));
        }
      }
      if (obj.owner) {
        this.owner = new ResourceReference(obj.owner);
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.guarantor) {
        this.guarantor = [];
        for (const o of obj.guarantor || []) {
          this.guarantor.push(new GuarantorComponent(o));
        }
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
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
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
      if (obj.contentType) {
        this.contentType = obj.contentType;
      }
      if (obj.language) {
        this.language = obj.language;
      }
      if (obj.data) {
        this.data = obj.data;
      }
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.size) {
        this.size = obj.size;
      }
      if (obj.hash) {
        this.hash = obj.hash;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.creation) {
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
  public resource?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.display) {
        this.display = obj.display;
      }
      if (obj.citation) {
        this.citation = obj.citation;
      }
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.document) {
        this.document = new Attachment(obj.document);
      }
      if (obj.resource) {
        this.resource = new ResourceReference(obj.resource);
      }
    }
  }

}

export class ParticipantComponent extends BackboneElement {
  public type: string;
  public role?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.role) {
        this.role = new CodeableConcept(obj.role);
      }
    }
  }

}

export class RepeatComponent extends Element {
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
  public timeOfDay?: Date[];
  public when?: string[];
  public offset?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.bounds) {
        this.bounds = new Element(obj.bounds);
      }
      if (obj.count) {
        this.count = obj.count;
      }
      if (obj.countMax) {
        this.countMax = obj.countMax;
      }
      if (obj.duration) {
        this.duration = obj.duration;
      }
      if (obj.durationMax) {
        this.durationMax = obj.durationMax;
      }
      if (obj.durationUnit) {
        this.durationUnit = obj.durationUnit;
      }
      if (obj.frequency) {
        this.frequency = obj.frequency;
      }
      if (obj.frequencyMax) {
        this.frequencyMax = obj.frequencyMax;
      }
      if (obj.period) {
        this.period = obj.period;
      }
      if (obj.periodMax) {
        this.periodMax = obj.periodMax;
      }
      if (obj.periodUnit) {
        this.periodUnit = obj.periodUnit;
      }
      if (obj.dayOfWeek) {
        this.dayOfWeek = obj.dayOfWeek;
      }
      if (obj.timeOfDay) {
        this.timeOfDay = obj.timeOfDay;
      }
      if (obj.when) {
        this.when = obj.when;
      }
      if (obj.offset) {
        this.offset = obj.offset;
      }
    }
  }

}

export class Timing extends Element {
  public event?: Date[];
  public repeat?: RepeatComponent;
  public code?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.event) {
        this.event = obj.event;
      }
      if (obj.repeat) {
        this.repeat = new RepeatComponent(obj.repeat);
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
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
      if (obj.numerator) {
        this.numerator = new Quantity(obj.numerator);
      }
      if (obj.denominator) {
        this.denominator = new Quantity(obj.denominator);
      }
    }
  }

}

export class Dosage extends Element {
  public sequence?: number;
  public text?: string;
  public additionalInstruction?: CodeableConcept[];
  public patientInstruction?: string;
  public timing?: Timing;
  public asNeeded?: Element;
  public site?: CodeableConcept;
  public route?: CodeableConcept;
  public method?: CodeableConcept;
  public dose?: Element;
  public maxDosePerPeriod?: Ratio;
  public maxDosePerAdministration?: Quantity;
  public maxDosePerLifetime?: Quantity;
  public rate?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequence) {
        this.sequence = obj.sequence;
      }
      if (obj.text) {
        this.text = obj.text;
      }
      if (obj.additionalInstruction) {
        this.additionalInstruction = [];
        for (const o of obj.additionalInstruction || []) {
          this.additionalInstruction.push(new CodeableConcept(o));
        }
      }
      if (obj.patientInstruction) {
        this.patientInstruction = obj.patientInstruction;
      }
      if (obj.timing) {
        this.timing = new Timing(obj.timing);
      }
      if (obj.asNeeded) {
        this.asNeeded = new Element(obj.asNeeded);
      }
      if (obj.site) {
        this.site = new CodeableConcept(obj.site);
      }
      if (obj.route) {
        this.route = new CodeableConcept(obj.route);
      }
      if (obj.method) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.dose) {
        this.dose = new Element(obj.dose);
      }
      if (obj.maxDosePerPeriod) {
        this.maxDosePerPeriod = new Ratio(obj.maxDosePerPeriod);
      }
      if (obj.maxDosePerAdministration) {
        this.maxDosePerAdministration = new Quantity(obj.maxDosePerAdministration);
      }
      if (obj.maxDosePerLifetime) {
        this.maxDosePerLifetime = new Quantity(obj.maxDosePerLifetime);
      }
      if (obj.rate) {
        this.rate = new Element(obj.rate);
      }
    }
  }

}

export class DynamicValueComponent extends BackboneElement {
  public description?: string;
  public path?: string;
  public language?: string;
  public expression?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.path) {
        this.path = obj.path;
      }
      if (obj.language) {
        this.language = obj.language;
      }
      if (obj.expression) {
        this.expression = obj.expression;
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
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public description?: string;
  public purpose?: string;
  public usage?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public topic?: CodeableConcept[];
  public contributor?: Contributor[];
  public contact?: ContactDetail[];
  public copyright?: string;
  public relatedArtifact?: RelatedArtifact[];
  public library?: ResourceReference[];
  public kind?: string;
  public code?: CodeableConcept;
  public timing?: Element;
  public location?: ResourceReference;
  public participant?: ParticipantComponent[];
  public product?: Element;
  public quantity?: SimpleQuantity;
  public dosage?: Dosage[];
  public bodySite?: CodeableConcept[];
  public transform?: ResourceReference;
  public dynamicValue?: DynamicValueComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.usage) {
        this.usage = obj.usage;
      }
      if (obj.approvalDate) {
        this.approvalDate = new Date(obj.approvalDate);
      }
      if (obj.lastReviewDate) {
        this.lastReviewDate = new Date(obj.lastReviewDate);
      }
      if (obj.effectivePeriod) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.topic) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.contributor) {
        this.contributor = [];
        for (const o of obj.contributor || []) {
          this.contributor.push(new Contributor(o));
        }
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.relatedArtifact) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.library) {
        this.library = [];
        for (const o of obj.library || []) {
          this.library.push(new ResourceReference(o));
        }
      }
      if (obj.kind) {
        this.kind = obj.kind;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.timing) {
        this.timing = new Element(obj.timing);
      }
      if (obj.location) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.participant) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new ParticipantComponent(o));
        }
      }
      if (obj.product) {
        this.product = new Element(obj.product);
      }
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.dosage) {
        this.dosage = [];
        for (const o of obj.dosage || []) {
          this.dosage.push(new Dosage(o));
        }
      }
      if (obj.bodySite) {
        this.bodySite = [];
        for (const o of obj.bodySite || []) {
          this.bodySite.push(new CodeableConcept(o));
        }
      }
      if (obj.transform) {
        this.transform = new ResourceReference(obj.transform);
      }
      if (obj.dynamicValue) {
        this.dynamicValue = [];
        for (const o of obj.dynamicValue || []) {
          this.dynamicValue.push(new DynamicValueComponent(o));
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
      if (obj.use) {
        this.use = obj.use;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.text) {
        this.text = obj.text;
      }
      if (obj.line) {
        this.line = obj.line;
      }
      if (obj.city) {
        this.city = obj.city;
      }
      if (obj.district) {
        this.district = obj.district;
      }
      if (obj.state) {
        this.state = obj.state;
      }
      if (obj.postalCode) {
        this.postalCode = obj.postalCode;
      }
      if (obj.country) {
        this.country = obj.country;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class SuspectEntityComponent extends BackboneElement {
  public instance: ResourceReference;
  public causality?: string;
  public causalityAssessment?: CodeableConcept;
  public causalityProductRelatedness?: string;
  public causalityMethod?: CodeableConcept;
  public causalityAuthor?: ResourceReference;
  public causalityResult?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.instance) {
        this.instance = new ResourceReference(obj.instance);
      }
      if (obj.causality) {
        this.causality = obj.causality;
      }
      if (obj.causalityAssessment) {
        this.causalityAssessment = new CodeableConcept(obj.causalityAssessment);
      }
      if (obj.causalityProductRelatedness) {
        this.causalityProductRelatedness = obj.causalityProductRelatedness;
      }
      if (obj.causalityMethod) {
        this.causalityMethod = new CodeableConcept(obj.causalityMethod);
      }
      if (obj.causalityAuthor) {
        this.causalityAuthor = new ResourceReference(obj.causalityAuthor);
      }
      if (obj.causalityResult) {
        this.causalityResult = new CodeableConcept(obj.causalityResult);
      }
    }
  }

}

export class AdverseEvent extends DomainResource {
  public resourceType = 'AdverseEvent';
  public identifier?: Identifier;
  public category?: string;
  public type?: CodeableConcept;
  public subject?: ResourceReference;
  public date?: Date;
  public reaction?: ResourceReference[];
  public location?: ResourceReference;
  public seriousness?: CodeableConcept;
  public outcome?: CodeableConcept;
  public recorder?: ResourceReference;
  public eventParticipant?: ResourceReference;
  public description?: string;
  public suspectEntity?: SuspectEntityComponent[];
  public subjectMedicalHistory?: ResourceReference[];
  public referenceDocument?: ResourceReference[];
  public study?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.category) {
        this.category = obj.category;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.reaction) {
        this.reaction = [];
        for (const o of obj.reaction || []) {
          this.reaction.push(new ResourceReference(o));
        }
      }
      if (obj.location) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.seriousness) {
        this.seriousness = new CodeableConcept(obj.seriousness);
      }
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.recorder) {
        this.recorder = new ResourceReference(obj.recorder);
      }
      if (obj.eventParticipant) {
        this.eventParticipant = new ResourceReference(obj.eventParticipant);
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.suspectEntity) {
        this.suspectEntity = [];
        for (const o of obj.suspectEntity || []) {
          this.suspectEntity.push(new SuspectEntityComponent(o));
        }
      }
      if (obj.subjectMedicalHistory) {
        this.subjectMedicalHistory = [];
        for (const o of obj.subjectMedicalHistory || []) {
          this.subjectMedicalHistory.push(new ResourceReference(o));
        }
      }
      if (obj.referenceDocument) {
        this.referenceDocument = [];
        for (const o of obj.referenceDocument || []) {
          this.referenceDocument.push(new ResourceReference(o));
        }
      }
      if (obj.study) {
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
  public time?: Date;
  public text: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.author) {
        this.author = new Element(obj.author);
      }
      if (obj.time) {
        this.time = new Date(obj.time);
      }
      if (obj.text) {
        this.text = obj.text;
      }
    }
  }

}

export class ReactionComponent extends BackboneElement {
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
      if (obj.substance) {
        this.substance = new CodeableConcept(obj.substance);
      }
      if (obj.manifestation) {
        this.manifestation = [];
        for (const o of obj.manifestation || []) {
          this.manifestation.push(new CodeableConcept(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.onset) {
        this.onset = new Date(obj.onset);
      }
      if (obj.severity) {
        this.severity = obj.severity;
      }
      if (obj.exposureRoute) {
        this.exposureRoute = new CodeableConcept(obj.exposureRoute);
      }
      if (obj.note) {
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
  public verificationStatus: string;
  public type?: string;
  public category?: string[];
  public criticality?: string;
  public code?: CodeableConcept;
  public patient: ResourceReference;
  public onset?: Element;
  public assertedDate?: Date;
  public recorder?: ResourceReference;
  public asserter?: ResourceReference;
  public lastOccurrence?: Date;
  public note?: Annotation[];
  public reaction?: ReactionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.clinicalStatus) {
        this.clinicalStatus = obj.clinicalStatus;
      }
      if (obj.verificationStatus) {
        this.verificationStatus = obj.verificationStatus;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.category) {
        this.category = obj.category;
      }
      if (obj.criticality) {
        this.criticality = obj.criticality;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.onset) {
        this.onset = new Element(obj.onset);
      }
      if (obj.assertedDate) {
        this.assertedDate = new Date(obj.assertedDate);
      }
      if (obj.recorder) {
        this.recorder = new ResourceReference(obj.recorder);
      }
      if (obj.asserter) {
        this.asserter = new ResourceReference(obj.asserter);
      }
      if (obj.lastOccurrence) {
        this.lastOccurrence = new Date(obj.lastOccurrence);
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.reaction) {
        this.reaction = [];
        for (const o of obj.reaction || []) {
          this.reaction.push(new ReactionComponent(o));
        }
      }
    }
  }

}

export class Appointment extends DomainResource {
  public resourceType = 'Appointment';
  public identifier?: Identifier[];
  public status: string;
  public serviceCategory?: CodeableConcept;
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
  public incomingReferral?: ResourceReference[];
  public participant: ParticipantComponent[];
  public requestedPeriod?: Period[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.serviceCategory) {
        this.serviceCategory = new CodeableConcept(obj.serviceCategory);
      }
      if (obj.serviceType) {
        this.serviceType = [];
        for (const o of obj.serviceType || []) {
          this.serviceType.push(new CodeableConcept(o));
        }
      }
      if (obj.specialty) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.appointmentType) {
        this.appointmentType = new CodeableConcept(obj.appointmentType);
      }
      if (obj.reason) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.indication) {
        this.indication = [];
        for (const o of obj.indication || []) {
          this.indication.push(new ResourceReference(o));
        }
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.supportingInformation) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
      if (obj.start) {
        this.start = new Date(obj.start);
      }
      if (obj.end) {
        this.end = new Date(obj.end);
      }
      if (obj.minutesDuration) {
        this.minutesDuration = obj.minutesDuration;
      }
      if (obj.slot) {
        this.slot = [];
        for (const o of obj.slot || []) {
          this.slot.push(new ResourceReference(o));
        }
      }
      if (obj.created) {
        this.created = new Date(obj.created);
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
      if (obj.incomingReferral) {
        this.incomingReferral = [];
        for (const o of obj.incomingReferral || []) {
          this.incomingReferral.push(new ResourceReference(o));
        }
      }
      if (obj.participant) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new ParticipantComponent(o));
        }
      }
      if (obj.requestedPeriod) {
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
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.appointment) {
        this.appointment = new ResourceReference(obj.appointment);
      }
      if (obj.start) {
        this.start = new Date(obj.start);
      }
      if (obj.end) {
        this.end = new Date(obj.end);
      }
      if (obj.participantType) {
        this.participantType = [];
        for (const o of obj.participantType || []) {
          this.participantType.push(new CodeableConcept(o));
        }
      }
      if (obj.actor) {
        this.actor = new ResourceReference(obj.actor);
      }
      if (obj.participantStatus) {
        this.participantStatus = obj.participantStatus;
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
    }
  }

}

export class NetworkComponent extends BackboneElement implements INetworkComponent {
  public address?: string;
  public type?: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.address) {
        this.address = obj.address;
      }
      if (obj.type) {
        this.type = new Coding(obj.type);
      }
    }
  }

}

export class AgentComponent extends BackboneElement implements IAgentComponent {
  public role?: CodeableConcept[];
  public reference?: ResourceReference;
  public userId?: Identifier;
  public altId?: string;
  public name?: string;
  public requestor: boolean;
  public location?: ResourceReference;
  public policy?: string[];
  public media?: Coding;
  public network?: NetworkComponent;
  public purposeOfUse?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.role) {
        this.role = [];
        for (const o of obj.role || []) {
          this.role.push(new CodeableConcept(o));
        }
      }
      if (obj.reference) {
        this.reference = new ResourceReference(obj.reference);
      }
      if (obj.userId) {
        this.userId = new Identifier(obj.userId);
      }
      if (obj.altId) {
        this.altId = obj.altId;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.requestor) {
        this.requestor = obj.requestor;
      }
      if (obj.location) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.policy) {
        this.policy = obj.policy;
      }
      if (obj.media) {
        this.media = new Coding(obj.media);
      }
      if (obj.network) {
        this.network = new NetworkComponent(obj.network);
      }
      if (obj.purposeOfUse) {
        this.purposeOfUse = [];
        for (const o of obj.purposeOfUse || []) {
          this.purposeOfUse.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class SourceComponent extends BackboneElement {
  public site?: string;
  public identifier: Identifier;
  public type?: Coding[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.site) {
        this.site = obj.site;
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new Coding(o));
        }
      }
    }
  }

}

export class DetailComponent extends BackboneElement implements IDetailComponent {
  public type: string;
  public value: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.value) {
        this.value = obj.value;
      }
    }
  }

}

export class EntityComponent extends BackboneElement implements IEntityComponent {
  public identifier?: Identifier;
  public reference?: ResourceReference;
  public type?: Coding;
  public role?: Coding;
  public lifecycle?: Coding;
  public securityLabel?: Coding[];
  public name?: string;
  public description?: string;
  public query?: string;
  public detail?: DetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.reference) {
        this.reference = new ResourceReference(obj.reference);
      }
      if (obj.type) {
        this.type = new Coding(obj.type);
      }
      if (obj.role) {
        this.role = new Coding(obj.role);
      }
      if (obj.lifecycle) {
        this.lifecycle = new Coding(obj.lifecycle);
      }
      if (obj.securityLabel) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new Coding(o));
        }
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.query) {
        this.query = obj.query;
      }
      if (obj.detail) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new DetailComponent(o));
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
  public recorded: string;
  public outcome?: Coding;
  public outcomeDesc?: string;
  public purposeOfEvent?: CodeableConcept[];
  public agent: AgentComponent[];
  public source: SourceComponent;
  public entity?: EntityComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = new Coding(obj.type);
      }
      if (obj.subtype) {
        this.subtype = [];
        for (const o of obj.subtype || []) {
          this.subtype.push(new Coding(o));
        }
      }
      if (obj.action) {
        this.action = obj.action;
      }
      if (obj.recorded) {
        this.recorded = obj.recorded;
      }
      if (obj.outcome) {
        this.outcome = new Coding(obj.outcome);
      }
      if (obj.outcomeDesc) {
        this.outcomeDesc = obj.outcomeDesc;
      }
      if (obj.purposeOfEvent) {
        this.purposeOfEvent = [];
        for (const o of obj.purposeOfEvent || []) {
          this.purposeOfEvent.push(new CodeableConcept(o));
        }
      }
      if (obj.agent) {
        this.agent = [];
        for (const o of obj.agent || []) {
          this.agent.push(new AgentComponent(o));
        }
      }
      if (obj.source) {
        this.source = new SourceComponent(obj.source);
      }
      if (obj.entity) {
        this.entity = [];
        for (const o of obj.entity || []) {
          this.entity.push(new EntityComponent(o));
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
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.created) {
        this.created = new Date(obj.created);
      }
      if (obj.author) {
        this.author = new ResourceReference(obj.author);
      }
    }
  }

}

export class BodySite extends DomainResource {
  public resourceType = 'BodySite';
  public identifier?: Identifier[];
  public active?: boolean;
  public code?: CodeableConcept;
  public qualifier?: CodeableConcept[];
  public description?: string;
  public image?: Attachment[];
  public patient: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.qualifier) {
        this.qualifier = [];
        for (const o of obj.qualifier || []) {
          this.qualifier.push(new CodeableConcept(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.image) {
        this.image = [];
        for (const o of obj.image || []) {
          this.image.push(new Attachment(o));
        }
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
    }
  }

}

export class SoftwareComponent extends BackboneElement {
  public name: string;
  public version?: string;
  public releaseDate?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.releaseDate) {
        this.releaseDate = new Date(obj.releaseDate);
      }
    }
  }

}

export class ImplementationComponent extends BackboneElement {
  public description: string;
  public url?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.url) {
        this.url = obj.url;
      }
    }
  }

}

export class CertificateComponent extends BackboneElement {
  public type?: string;
  public blob?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.blob) {
        this.blob = obj.blob;
      }
    }
  }

}

export class SecurityComponent extends BackboneElement {
  public cors?: boolean;
  public service?: CodeableConcept[];
  public description?: string;
  public certificate?: CertificateComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.cors) {
        this.cors = obj.cors;
      }
      if (obj.service) {
        this.service = [];
        for (const o of obj.service || []) {
          this.service.push(new CodeableConcept(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.certificate) {
        this.certificate = [];
        for (const o of obj.certificate || []) {
          this.certificate.push(new CertificateComponent(o));
        }
      }
    }
  }

}

export class ResourceInteractionComponent extends BackboneElement {
  public code: string;
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class SearchParamComponent extends BackboneElement {
  public name: string;
  public definition?: string;
  public type: 'number'|'date'|'string'|'token'|'reference'|'composite'|'quantity'|'uri';
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.definition) {
        this.definition = obj.definition;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class PackageResourceComponent extends BackboneElement {
  public example = false;
  public name?: string;
  public description?: string;
  public acronym?: string;
  public sourceUri?: string;
  public sourceReference?: ResourceReference;
  public exampleFor?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.hasOwnProperty('example')) {
        this.example = obj.example;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.acronym) {
        this.acronym = obj.acronym;
      }
      if (obj.sourceUri) {
        this.sourceUri = obj.sourceUri;
      }
      if (obj.sourceReference) {
        this.sourceReference = new ResourceReference(obj.sourceReference);
      }
      if (obj.exampleFor) {
        this.exampleFor = new ResourceReference(obj.exampleFor);
      }
    }
  }
}

export class ResourceComponent extends BackboneElement {
  public type: string;
  public profile?: ResourceReference;
  public documentation?: string;
  public interaction: ResourceInteractionComponent[];
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
  public searchParam?: SearchParamComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.profile) {
        this.profile = new ResourceReference(obj.profile);
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
      if (obj.interaction) {
        this.interaction = [];
        for (const o of obj.interaction || []) {
          this.interaction.push(new ResourceInteractionComponent(o));
        }
      }
      if (obj.versioning) {
        this.versioning = obj.versioning;
      }
      if (obj.readHistory) {
        this.readHistory = obj.readHistory;
      }
      if (obj.updateCreate) {
        this.updateCreate = obj.updateCreate;
      }
      if (obj.conditionalCreate) {
        this.conditionalCreate = obj.conditionalCreate;
      }
      if (obj.conditionalRead) {
        this.conditionalRead = obj.conditionalRead;
      }
      if (obj.conditionalUpdate) {
        this.conditionalUpdate = obj.conditionalUpdate;
      }
      if (obj.conditionalDelete) {
        this.conditionalDelete = obj.conditionalDelete;
      }
      if (obj.referencePolicy) {
        this.referencePolicy = obj.referencePolicy;
      }
      if (obj.searchInclude) {
        this.searchInclude = obj.searchInclude;
      }
      if (obj.searchRevInclude) {
        this.searchRevInclude = obj.searchRevInclude;
      }
      if (obj.searchParam) {
        this.searchParam = [];
        for (const o of obj.searchParam || []) {
          this.searchParam.push(new SearchParamComponent(o));
        }
      }
    }
  }

}

export class SystemInteractionComponent extends BackboneElement {
  public code: string;
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class OperationComponent extends BackboneElement {
  public name: string;
  public definition: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.definition) {
        this.definition = new ResourceReference(obj.definition);
      }
    }
  }

}

export class RestComponent extends BackboneElement {
  public mode: string;
  public documentation?: string;
  public security?: SecurityComponent;
  public resource?: ResourceComponent[];
  public interaction?: SystemInteractionComponent[];
  public searchParam?: SearchParamComponent[];
  public operation?: OperationComponent[];
  public compartment?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
      if (obj.security) {
        this.security = new SecurityComponent(obj.security);
      }
      if (obj.resource) {
        this.resource = [];
        for (const o of obj.resource || []) {
          this.resource.push(new ResourceComponent(o));
        }
      }
      if (obj.interaction) {
        this.interaction = [];
        for (const o of obj.interaction || []) {
          this.interaction.push(new SystemInteractionComponent(o));
        }
      }
      if (obj.searchParam) {
        this.searchParam = [];
        for (const o of obj.searchParam || []) {
          this.searchParam.push(new SearchParamComponent(o));
        }
      }
      if (obj.operation) {
        this.operation = [];
        for (const o of obj.operation || []) {
          this.operation.push(new OperationComponent(o));
        }
      }
      if (obj.compartment) {
        this.compartment = obj.compartment;
      }
    }
  }

}

export class EndpointComponent extends BackboneElement {
  public protocol: Coding;
  public address: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.protocol) {
        this.protocol = new Coding(obj.protocol);
      }
      if (obj.address) {
        this.address = obj.address;
      }
    }
  }

}

export class SupportedMessageComponent extends BackboneElement {
  public mode: string;
  public definition: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.definition) {
        this.definition = new ResourceReference(obj.definition);
      }
    }
  }

}

export class EventComponent extends BackboneElement {
  public code: Coding;
  public category?: string;
  public mode: string;
  public focus: string;
  public request: ResourceReference;
  public response: ResourceReference;
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = new Coding(obj.code);
      }
      if (obj.category) {
        this.category = obj.category;
      }
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.focus) {
        this.focus = obj.focus;
      }
      if (obj.request) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.response) {
        this.response = new ResourceReference(obj.response);
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
    }
  }

}

export class MessagingComponent extends BackboneElement {
  public endpoint?: EndpointComponent[];
  public reliableCache?: number;
  public documentation?: string;
  public supportedMessage?: SupportedMessageComponent[];
  public event?: EventComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.endpoint) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new EndpointComponent(o));
        }
      }
      if (obj.reliableCache) {
        this.reliableCache = obj.reliableCache;
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
      if (obj.supportedMessage) {
        this.supportedMessage = [];
        for (const o of obj.supportedMessage || []) {
          this.supportedMessage.push(new SupportedMessageComponent(o));
        }
      }
      if (obj.event) {
        this.event = [];
        for (const o of obj.event || []) {
          this.event.push(new EventComponent(o));
        }
      }
    }
  }

}

export class DocumentComponent extends BackboneElement {
  public mode: string;
  public documentation?: string;
  public profile: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
      if (obj.profile) {
        this.profile = new ResourceReference(obj.profile);
      }
    }
  }

}

export class CapabilityStatement extends DomainResource {
  public resourceType = 'CapabilityStatement';
  public url?: string;
  public version?: string;
  public name?: string;
  public title?: string;
  public status = 'draft';
  public experimental?: boolean;
  public date: string = new Date().formatFhir();
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public copyright?: string;
  public kind = 'instance';
  public instantiates?: string[];
  public software?: SoftwareComponent;
  public implementation?: ImplementationComponent;
  public fhirVersion = '3.0.2';
  public acceptUnknown: 'no'|'extensions'|'elements'|'both' = 'both';
  public format: string[] = ['application/json'];
  public patchFormat?: string[];
  public implementationGuide?: string[];
  public profile?: ResourceReference[];
  public rest?: RestComponent[];
  public messaging?: MessagingComponent[];
  public document?: DocumentComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = obj.date;
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.kind) {
        this.kind = obj.kind;
      }
      if (obj.instantiates) {
        this.instantiates = obj.instantiates;
      }
      if (obj.software) {
        this.software = new SoftwareComponent(obj.software);
      }
      if (obj.implementation) {
        this.implementation = new ImplementationComponent(obj.implementation);
      }
      if (obj.fhirVersion) {
        this.fhirVersion = obj.fhirVersion;
      }
      if (obj.acceptUnknown) {
        this.acceptUnknown = obj.acceptUnknown;
      }
      if (obj.format) {
        this.format = obj.format;
      }
      if (obj.patchFormat) {
        this.patchFormat = obj.patchFormat;
      }
      if (obj.implementationGuide) {
        this.implementationGuide = obj.implementationGuide;
      }
      if (obj.profile) {
        this.profile = [];
        for (const o of obj.profile || []) {
          this.profile.push(new ResourceReference(o));
        }
      }
      if (obj.rest) {
        this.rest = [];
        for (const o of obj.rest || []) {
          this.rest.push(new RestComponent(o));
        }
      }
      if (obj.messaging) {
        this.messaging = [];
        for (const o of obj.messaging || []) {
          this.messaging.push(new MessagingComponent(o));
        }
      }
      if (obj.document) {
        this.document = [];
        for (const o of obj.document || []) {
          this.document.push(new DocumentComponent(o));
        }
      }
    }
  }

}

export class ActivityComponent extends BackboneElement {
  public outcomeCodeableConcept?: CodeableConcept[];
  public outcomeReference?: ResourceReference[];
  public progress?: Annotation[];
  public reference?: ResourceReference;
  public detail?: DetailComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.outcomeCodeableConcept) {
        this.outcomeCodeableConcept = [];
        for (const o of obj.outcomeCodeableConcept || []) {
          this.outcomeCodeableConcept.push(new CodeableConcept(o));
        }
      }
      if (obj.outcomeReference) {
        this.outcomeReference = [];
        for (const o of obj.outcomeReference || []) {
          this.outcomeReference.push(new ResourceReference(o));
        }
      }
      if (obj.progress) {
        this.progress = [];
        for (const o of obj.progress || []) {
          this.progress.push(new Annotation(o));
        }
      }
      if (obj.reference) {
        this.reference = new ResourceReference(obj.reference);
      }
      if (obj.detail) {
        this.detail = new DetailComponent(obj.detail);
      }
    }
  }

}

export class CarePlan extends DomainResource {
  public resourceType = 'CarePlan';
  public identifier?: Identifier[];
  public definition?: ResourceReference[];
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
  public author?: ResourceReference[];
  public careTeam?: ResourceReference[];
  public addresses?: ResourceReference[];
  public supportingInfo?: ResourceReference[];
  public goal?: ResourceReference[];
  public activity?: ActivityComponent[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.replaces) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.intent) {
        this.intent = obj.intent;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.author) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ResourceReference(o));
        }
      }
      if (obj.careTeam) {
        this.careTeam = [];
        for (const o of obj.careTeam || []) {
          this.careTeam.push(new ResourceReference(o));
        }
      }
      if (obj.addresses) {
        this.addresses = [];
        for (const o of obj.addresses || []) {
          this.addresses.push(new ResourceReference(o));
        }
      }
      if (obj.supportingInfo) {
        this.supportingInfo = [];
        for (const o of obj.supportingInfo || []) {
          this.supportingInfo.push(new ResourceReference(o));
        }
      }
      if (obj.goal) {
        this.goal = [];
        for (const o of obj.goal || []) {
          this.goal.push(new ResourceReference(o));
        }
      }
      if (obj.activity) {
        this.activity = [];
        for (const o of obj.activity || []) {
          this.activity.push(new ActivityComponent(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
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
  public participant?: ParticipantComponent[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public managingOrganization?: ResourceReference[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.participant) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new ParticipantComponent(o));
        }
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.managingOrganization) {
        this.managingOrganization = [];
        for (const o of obj.managingOrganization || []) {
          this.managingOrganization.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class ChargeItem extends DomainResource {
  public resourceType = 'ChargeItem';
  public identifier?: Identifier;
  public definition?: string[];
  public status: string;
  public partOf?: ResourceReference[];
  public code: CodeableConcept;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public participant?: ParticipantComponent[];
  public performingOrganization?: ResourceReference;
  public requestingOrganization?: ResourceReference;
  public quantity?: Quantity;
  public bodysite?: CodeableConcept[];
  public factorOverride?: number;
  public priceOverride?: Money;
  public overrideReason?: string;
  public enterer?: ResourceReference;
  public enteredDate?: Date;
  public reason?: CodeableConcept[];
  public service?: ResourceReference[];
  public account?: ResourceReference[];
  public note?: Annotation[];
  public supportingInformation?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.definition) {
        this.definition = obj.definition;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.occurrence) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.participant) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new ParticipantComponent(o));
        }
      }
      if (obj.performingOrganization) {
        this.performingOrganization = new ResourceReference(obj.performingOrganization);
      }
      if (obj.requestingOrganization) {
        this.requestingOrganization = new ResourceReference(obj.requestingOrganization);
      }
      if (obj.quantity) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.bodysite) {
        this.bodysite = [];
        for (const o of obj.bodysite || []) {
          this.bodysite.push(new CodeableConcept(o));
        }
      }
      if (obj.factorOverride) {
        this.factorOverride = obj.factorOverride;
      }
      if (obj.priceOverride) {
        this.priceOverride = new Money(obj.priceOverride);
      }
      if (obj.overrideReason) {
        this.overrideReason = obj.overrideReason;
      }
      if (obj.enterer) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.enteredDate) {
        this.enteredDate = new Date(obj.enteredDate);
      }
      if (obj.reason) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.service) {
        this.service = [];
        for (const o of obj.service || []) {
          this.service.push(new ResourceReference(o));
        }
      }
      if (obj.account) {
        this.account = [];
        for (const o of obj.account || []) {
          this.account.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.supportingInformation) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class RelatedClaimComponent extends BackboneElement {
  public claim?: ResourceReference;
  public relationship?: CodeableConcept;
  public reference?: Identifier;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.claim) {
        this.claim = new ResourceReference(obj.claim);
      }
      if (obj.relationship) {
        this.relationship = new CodeableConcept(obj.relationship);
      }
      if (obj.reference) {
        this.reference = new Identifier(obj.reference);
      }
    }
  }

}

export class PayeeComponent extends BackboneElement {
  public type: CodeableConcept;
  public resourceType?: Coding;
  public party?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.resourceType) {
        this.resourceType = new Coding(obj.resourceType);
      }
      if (obj.party) {
        this.party = new ResourceReference(obj.party);
      }
    }
  }

}

export class CareTeamComponent extends BackboneElement {
  public sequence: number;
  public provider: ResourceReference;
  public responsible?: boolean;
  public role?: CodeableConcept;
  public qualification?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequence) {
        this.sequence = obj.sequence;
      }
      if (obj.provider) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.responsible) {
        this.responsible = obj.responsible;
      }
      if (obj.role) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.qualification) {
        this.qualification = new CodeableConcept(obj.qualification);
      }
    }
  }

}

export class SpecialConditionComponent extends BackboneElement {
  public sequence: number;
  public category: CodeableConcept;
  public code?: CodeableConcept;
  public timing?: Element;
  public value?: Element;
  public reason?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequence) {
        this.sequence = obj.sequence;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.timing) {
        this.timing = new Element(obj.timing);
      }
      if (obj.value) {
        this.value = new Element(obj.value);
      }
      if (obj.reason) {
        this.reason = new CodeableConcept(obj.reason);
      }
    }
  }

}

export class DiagnosisComponent extends BackboneElement {
  public sequence: number;
  public diagnosis: Element;
  public type?: CodeableConcept[];
  public packageCode?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequence) {
        this.sequence = obj.sequence;
      }
      if (obj.diagnosis) {
        this.diagnosis = new Element(obj.diagnosis);
      }
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.packageCode) {
        this.packageCode = new CodeableConcept(obj.packageCode);
      }
    }
  }

}

export class ProcedureComponent extends BackboneElement {
  public sequence: number;
  public date?: Date;
  public procedure: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequence) {
        this.sequence = obj.sequence;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.procedure) {
        this.procedure = new Element(obj.procedure);
      }
    }
  }

}

export class InsuranceComponent extends BackboneElement {
  public sequence: number;
  public focal: boolean;
  public coverage: ResourceReference;
  public businessArrangement?: string;
  public preAuthRef?: string[];
  public claimResponse?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequence) {
        this.sequence = obj.sequence;
      }
      if (obj.focal) {
        this.focal = obj.focal;
      }
      if (obj.coverage) {
        this.coverage = new ResourceReference(obj.coverage);
      }
      if (obj.businessArrangement) {
        this.businessArrangement = obj.businessArrangement;
      }
      if (obj.preAuthRef) {
        this.preAuthRef = obj.preAuthRef;
      }
      if (obj.claimResponse) {
        this.claimResponse = new ResourceReference(obj.claimResponse);
      }
    }
  }

}

export class AccidentComponent extends BackboneElement {
  public date: Date;
  public type?: CodeableConcept;
  public location?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.location) {
        this.location = new Element(obj.location);
      }
    }
  }

}

export class ItemComponent extends BackboneElement {
  public sequence: number;
  public careTeamLinkId?: number[];
  public diagnosisLinkId?: number[];
  public procedureLinkId?: number[];
  public informationLinkId?: number[];
  public revenue?: CodeableConcept;
  public category?: CodeableConcept;
  public service?: CodeableConcept;
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
  public detail?: DetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequence) {
        this.sequence = obj.sequence;
      }
      if (obj.careTeamLinkId) {
        this.careTeamLinkId = obj.careTeamLinkId;
      }
      if (obj.diagnosisLinkId) {
        this.diagnosisLinkId = obj.diagnosisLinkId;
      }
      if (obj.procedureLinkId) {
        this.procedureLinkId = obj.procedureLinkId;
      }
      if (obj.informationLinkId) {
        this.informationLinkId = obj.informationLinkId;
      }
      if (obj.revenue) {
        this.revenue = new CodeableConcept(obj.revenue);
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.service) {
        this.service = new CodeableConcept(obj.service);
      }
      if (obj.modifier) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.programCode) {
        this.programCode = [];
        for (const o of obj.programCode || []) {
          this.programCode.push(new CodeableConcept(o));
        }
      }
      if (obj.serviced) {
        this.serviced = new Element(obj.serviced);
      }
      if (obj.location) {
        this.location = new Element(obj.location);
      }
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.unitPrice) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.factor) {
        this.factor = obj.factor;
      }
      if (obj.net) {
        this.net = new Money(obj.net);
      }
      if (obj.udi) {
        this.udi = [];
        for (const o of obj.udi || []) {
          this.udi.push(new ResourceReference(o));
        }
      }
      if (obj.bodySite) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.subSite) {
        this.subSite = [];
        for (const o of obj.subSite || []) {
          this.subSite.push(new CodeableConcept(o));
        }
      }
      if (obj.encounter) {
        this.encounter = [];
        for (const o of obj.encounter || []) {
          this.encounter.push(new ResourceReference(o));
        }
      }
      if (obj.detail) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new DetailComponent(o));
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
  public subType?: CodeableConcept[];
  public use?: string;
  public patient?: ResourceReference;
  public billablePeriod?: Period;
  public created?: Date;
  public enterer?: ResourceReference;
  public insurer?: ResourceReference;
  public provider?: ResourceReference;
  public organization?: ResourceReference;
  public priority?: CodeableConcept;
  public fundsReserve?: CodeableConcept;
  public related?: RelatedClaimComponent[];
  public prescription?: ResourceReference;
  public originalPrescription?: ResourceReference;
  public payee?: PayeeComponent;
  public referral?: ResourceReference;
  public facility?: ResourceReference;
  public careTeam?: CareTeamComponent[];
  public information?: SpecialConditionComponent[];
  public diagnosis?: DiagnosisComponent[];
  public procedure?: ProcedureComponent[];
  public insurance?: InsuranceComponent[];
  public accident?: AccidentComponent;
  public employmentImpacted?: Period;
  public hospitalization?: Period;
  public item?: ItemComponent[];
  public total?: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.subType) {
        this.subType = [];
        for (const o of obj.subType || []) {
          this.subType.push(new CodeableConcept(o));
        }
      }
      if (obj.use) {
        this.use = obj.use;
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.billablePeriod) {
        this.billablePeriod = new Period(obj.billablePeriod);
      }
      if (obj.created) {
        this.created = new Date(obj.created);
      }
      if (obj.enterer) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.insurer) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.provider) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.priority) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.fundsReserve) {
        this.fundsReserve = new CodeableConcept(obj.fundsReserve);
      }
      if (obj.related) {
        this.related = [];
        for (const o of obj.related || []) {
          this.related.push(new RelatedClaimComponent(o));
        }
      }
      if (obj.prescription) {
        this.prescription = new ResourceReference(obj.prescription);
      }
      if (obj.originalPrescription) {
        this.originalPrescription = new ResourceReference(obj.originalPrescription);
      }
      if (obj.payee) {
        this.payee = new PayeeComponent(obj.payee);
      }
      if (obj.referral) {
        this.referral = new ResourceReference(obj.referral);
      }
      if (obj.facility) {
        this.facility = new ResourceReference(obj.facility);
      }
      if (obj.careTeam) {
        this.careTeam = [];
        for (const o of obj.careTeam || []) {
          this.careTeam.push(new CareTeamComponent(o));
        }
      }
      if (obj.information) {
        this.information = [];
        for (const o of obj.information || []) {
          this.information.push(new SpecialConditionComponent(o));
        }
      }
      if (obj.diagnosis) {
        this.diagnosis = [];
        for (const o of obj.diagnosis || []) {
          this.diagnosis.push(new DiagnosisComponent(o));
        }
      }
      if (obj.procedure) {
        this.procedure = [];
        for (const o of obj.procedure || []) {
          this.procedure.push(new ProcedureComponent(o));
        }
      }
      if (obj.insurance) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new InsuranceComponent(o));
        }
      }
      if (obj.accident) {
        this.accident = new AccidentComponent(obj.accident);
      }
      if (obj.employmentImpacted) {
        this.employmentImpacted = new Period(obj.employmentImpacted);
      }
      if (obj.hospitalization) {
        this.hospitalization = new Period(obj.hospitalization);
      }
      if (obj.item) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ItemComponent(o));
        }
      }
      if (obj.total) {
        this.total = new Money(obj.total);
      }
    }
  }

}

export class AdjudicationComponent extends BackboneElement {
  public category: CodeableConcept;
  public reason?: CodeableConcept;
  public amount?: Money;
  public value?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.reason) {
        this.reason = new CodeableConcept(obj.reason);
      }
      if (obj.amount) {
        this.amount = new Money(obj.amount);
      }
      if (obj.value) {
        this.value = obj.value;
      }
    }
  }

}

export class AddedItemsDetailComponent extends BackboneElement {
  public revenue?: CodeableConcept;
  public category?: CodeableConcept;
  public service?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public fee?: Money;
  public noteNumber?: number[];
  public adjudication?: AdjudicationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.revenue) {
        this.revenue = new CodeableConcept(obj.revenue);
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.service) {
        this.service = new CodeableConcept(obj.service);
      }
      if (obj.modifier) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.fee) {
        this.fee = new Money(obj.fee);
      }
      if (obj.noteNumber) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.adjudication) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new AdjudicationComponent(o));
        }
      }
    }
  }

}

export class AddedItemComponent extends BackboneElement {
  public sequenceLinkId?: number[];
  public revenue?: CodeableConcept;
  public category?: CodeableConcept;
  public service?: CodeableConcept;
  public modifier?: CodeableConcept[];
  public fee?: Money;
  public noteNumber?: number[];
  public adjudication?: AdjudicationComponent[];
  public detail?: AddedItemsDetailComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequenceLinkId) {
        this.sequenceLinkId = obj.sequenceLinkId;
      }
      if (obj.revenue) {
        this.revenue = new CodeableConcept(obj.revenue);
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.service) {
        this.service = new CodeableConcept(obj.service);
      }
      if (obj.modifier) {
        this.modifier = [];
        for (const o of obj.modifier || []) {
          this.modifier.push(new CodeableConcept(o));
        }
      }
      if (obj.fee) {
        this.fee = new Money(obj.fee);
      }
      if (obj.noteNumber) {
        this.noteNumber = obj.noteNumber;
      }
      if (obj.adjudication) {
        this.adjudication = [];
        for (const o of obj.adjudication || []) {
          this.adjudication.push(new AdjudicationComponent(o));
        }
      }
      if (obj.detail) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new AddedItemsDetailComponent(o));
        }
      }
    }
  }

}

export class ErrorComponent extends BackboneElement {
  public sequenceLinkId?: number;
  public detailSequenceLinkId?: number;
  public subdetailSequenceLinkId?: number;
  public code: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequenceLinkId) {
        this.sequenceLinkId = obj.sequenceLinkId;
      }
      if (obj.detailSequenceLinkId) {
        this.detailSequenceLinkId = obj.detailSequenceLinkId;
      }
      if (obj.subdetailSequenceLinkId) {
        this.subdetailSequenceLinkId = obj.subdetailSequenceLinkId;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
    }
  }

}

export class PaymentComponent extends BackboneElement {
  public type?: CodeableConcept;
  public adjustment?: Money;
  public adjustmentReason?: CodeableConcept;
  public date?: Date;
  public amount?: Money;
  public identifier?: Identifier;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.adjustment) {
        this.adjustment = new Money(obj.adjustment);
      }
      if (obj.adjustmentReason) {
        this.adjustmentReason = new CodeableConcept(obj.adjustmentReason);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.amount) {
        this.amount = new Money(obj.amount);
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
    }
  }

}

export class NoteComponent extends BackboneElement {
  public number?: number;
  public type?: CodeableConcept;
  public text?: string;
  public language?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.number) {
        this.number = obj.number;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.text) {
        this.text = obj.text;
      }
      if (obj.language) {
        this.language = new CodeableConcept(obj.language);
      }
    }
  }

}

export class ClaimResponse extends DomainResource {
  public resourceType = 'ClaimResponse';
  public identifier?: Identifier[];
  public status?: string;
  public patient?: ResourceReference;
  public created?: Date;
  public insurer?: ResourceReference;
  public requestProvider?: ResourceReference;
  public requestOrganization?: ResourceReference;
  public request?: ResourceReference;
  public outcome?: CodeableConcept;
  public disposition?: string;
  public payeeType?: CodeableConcept;
  public item?: ItemComponent[];
  public addItem?: AddedItemComponent[];
  public error?: ErrorComponent[];
  public totalCost?: Money;
  public unallocDeductable?: Money;
  public totalBenefit?: Money;
  public payment?: PaymentComponent;
  public reserved?: Coding;
  public form?: CodeableConcept;
  public processNote?: NoteComponent[];
  public communicationRequest?: ResourceReference[];
  public insurance?: InsuranceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.created) {
        this.created = new Date(obj.created);
      }
      if (obj.insurer) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.requestProvider) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
      if (obj.requestOrganization) {
        this.requestOrganization = new ResourceReference(obj.requestOrganization);
      }
      if (obj.request) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.disposition) {
        this.disposition = obj.disposition;
      }
      if (obj.payeeType) {
        this.payeeType = new CodeableConcept(obj.payeeType);
      }
      if (obj.item) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ItemComponent(o));
        }
      }
      if (obj.addItem) {
        this.addItem = [];
        for (const o of obj.addItem || []) {
          this.addItem.push(new AddedItemComponent(o));
        }
      }
      if (obj.error) {
        this.error = [];
        for (const o of obj.error || []) {
          this.error.push(new ErrorComponent(o));
        }
      }
      if (obj.totalCost) {
        this.totalCost = new Money(obj.totalCost);
      }
      if (obj.unallocDeductable) {
        this.unallocDeductable = new Money(obj.unallocDeductable);
      }
      if (obj.totalBenefit) {
        this.totalBenefit = new Money(obj.totalBenefit);
      }
      if (obj.payment) {
        this.payment = new PaymentComponent(obj.payment);
      }
      if (obj.reserved) {
        this.reserved = new Coding(obj.reserved);
      }
      if (obj.form) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.processNote) {
        this.processNote = [];
        for (const o of obj.processNote || []) {
          this.processNote.push(new NoteComponent(o));
        }
      }
      if (obj.communicationRequest) {
        this.communicationRequest = [];
        for (const o of obj.communicationRequest || []) {
          this.communicationRequest.push(new ResourceReference(o));
        }
      }
      if (obj.insurance) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new InsuranceComponent(o));
        }
      }
    }
  }

}

export class InvestigationComponent extends BackboneElement {
  public code: CodeableConcept;
  public item?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.item) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class FindingComponent extends BackboneElement {
  public item: Element;
  public basis?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.item) {
        this.item = new Element(obj.item);
      }
      if (obj.basis) {
        this.basis = obj.basis;
      }
    }
  }

}

export class ClinicalImpression extends DomainResource {
  public resourceType = 'ClinicalImpression';
  public identifier?: Identifier[];
  public status: string;
  public code?: CodeableConcept;
  public description?: string;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public effective?: Element;
  public date?: Date;
  public assessor?: ResourceReference;
  public previous?: ResourceReference;
  public problem?: ResourceReference[];
  public investigation?: InvestigationComponent[];
  public protocol?: string[];
  public summary?: string;
  public finding?: FindingComponent[];
  public prognosisCodeableConcept?: CodeableConcept[];
  public prognosisReference?: ResourceReference[];
  public action?: ResourceReference[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.effective) {
        this.effective = new Element(obj.effective);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.assessor) {
        this.assessor = new ResourceReference(obj.assessor);
      }
      if (obj.previous) {
        this.previous = new ResourceReference(obj.previous);
      }
      if (obj.problem) {
        this.problem = [];
        for (const o of obj.problem || []) {
          this.problem.push(new ResourceReference(o));
        }
      }
      if (obj.investigation) {
        this.investigation = [];
        for (const o of obj.investigation || []) {
          this.investigation.push(new InvestigationComponent(o));
        }
      }
      if (obj.protocol) {
        this.protocol = obj.protocol;
      }
      if (obj.summary) {
        this.summary = obj.summary;
      }
      if (obj.finding) {
        this.finding = [];
        for (const o of obj.finding || []) {
          this.finding.push(new FindingComponent(o));
        }
      }
      if (obj.prognosisCodeableConcept) {
        this.prognosisCodeableConcept = [];
        for (const o of obj.prognosisCodeableConcept || []) {
          this.prognosisCodeableConcept.push(new CodeableConcept(o));
        }
      }
      if (obj.prognosisReference) {
        this.prognosisReference = [];
        for (const o of obj.prognosisReference || []) {
          this.prognosisReference.push(new ResourceReference(o));
        }
      }
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class PayloadComponent extends BackboneElement {
  public content: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.content) {
        this.content = new Element(obj.content);
      }
    }
  }

}

export class Communication extends DomainResource {
  public resourceType = 'Communication';
  public identifier?: Identifier[];
  public definition?: ResourceReference[];
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status: string;
  public notDone?: boolean;
  public notDoneReason?: CodeableConcept;
  public category?: CodeableConcept[];
  public medium?: CodeableConcept[];
  public subject?: ResourceReference;
  public recipient?: ResourceReference[];
  public topic?: ResourceReference[];
  public context?: ResourceReference;
  public sent?: Date;
  public received?: Date;
  public sender?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public payload?: PayloadComponent[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.notDone) {
        this.notDone = obj.notDone;
      }
      if (obj.notDoneReason) {
        this.notDoneReason = new CodeableConcept(obj.notDoneReason);
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.medium) {
        this.medium = [];
        for (const o of obj.medium || []) {
          this.medium.push(new CodeableConcept(o));
        }
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.recipient) {
        this.recipient = [];
        for (const o of obj.recipient || []) {
          this.recipient.push(new ResourceReference(o));
        }
      }
      if (obj.topic) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new ResourceReference(o));
        }
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.sent) {
        this.sent = new Date(obj.sent);
      }
      if (obj.received) {
        this.received = new Date(obj.received);
      }
      if (obj.sender) {
        this.sender = new ResourceReference(obj.sender);
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.payload) {
        this.payload = [];
        for (const o of obj.payload || []) {
          this.payload.push(new PayloadComponent(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class RequesterComponent extends BackboneElement {
  public agent: ResourceReference;
  public onBehalfOf?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.agent) {
        this.agent = new ResourceReference(obj.agent);
      }
      if (obj.onBehalfOf) {
        this.onBehalfOf = new ResourceReference(obj.onBehalfOf);
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
  public category?: CodeableConcept[];
  public priority?: string;
  public medium?: CodeableConcept[];
  public subject?: ResourceReference;
  public recipient?: ResourceReference[];
  public topic?: ResourceReference[];
  public context?: ResourceReference;
  public payload?: PayloadComponent[];
  public occurrence?: Element;
  public authoredOn?: Date;
  public sender?: ResourceReference;
  public requester?: RequesterComponent;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.replaces) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.groupIdentifier) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
      if (obj.medium) {
        this.medium = [];
        for (const o of obj.medium || []) {
          this.medium.push(new CodeableConcept(o));
        }
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.recipient) {
        this.recipient = [];
        for (const o of obj.recipient || []) {
          this.recipient.push(new ResourceReference(o));
        }
      }
      if (obj.topic) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new ResourceReference(o));
        }
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.payload) {
        this.payload = [];
        for (const o of obj.payload || []) {
          this.payload.push(new PayloadComponent(o));
        }
      }
      if (obj.occurrence) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.authoredOn) {
        this.authoredOn = new Date(obj.authoredOn);
      }
      if (obj.sender) {
        this.sender = new ResourceReference(obj.sender);
      }
      if (obj.requester) {
        this.requester = new RequesterComponent(obj.requester);
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class CompartmentDefinition extends DomainResource {
  public resourceType = 'CompartmentDefinition';
  public url: string;
  public name: string;
  public title?: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public purpose?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public code: string;
  public search: boolean;
  public resource?: ResourceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.search) {
        this.search = obj.search;
      }
      if (obj.resource) {
        this.resource = [];
        for (const o of obj.resource || []) {
          this.resource.push(new ResourceComponent(o));
        }
      }
    }
  }

}

export class AttesterComponent extends BackboneElement {
  public mode: string[];
  public time?: Date;
  public party?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.time) {
        this.time = new Date(obj.time);
      }
      if (obj.party) {
        this.party = new ResourceReference(obj.party);
      }
    }
  }

}

export class RelatesToComponent extends BackboneElement {
  public code: string;
  public target: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.target) {
        this.target = new Element(obj.target);
      }
    }
  }

}

export class SectionComponent extends BackboneElement {
  public title?: string;
  public code?: CodeableConcept;
  public text?: Narrative;
  public mode?: string;
  public orderedBy?: CodeableConcept;
  public entry?: ResourceReference[];
  public emptyReason?: CodeableConcept;
  public section?: SectionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.text) {
        this.text = new Narrative(obj.text);
      }
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.orderedBy) {
        this.orderedBy = new CodeableConcept(obj.orderedBy);
      }
      if (obj.entry) {
        this.entry = [];
        for (const o of obj.entry || []) {
          this.entry.push(new ResourceReference(o));
        }
      }
      if (obj.emptyReason) {
        this.emptyReason = new CodeableConcept(obj.emptyReason);
      }
      if (obj.section) {
        this.section = [];
        for (const o of obj.section || []) {
          this.section.push(new SectionComponent(o));
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
  public class?: CodeableConcept;
  public subject: ResourceReference;
  public encounter?: ResourceReference;
  public date: Date;
  public author: ResourceReference[];
  public title: string;
  public confidentiality?: string;
  public attester?: AttesterComponent[];
  public custodian?: ResourceReference;
  public relatesTo?: RelatesToComponent[];
  public event?: EventComponent[];
  public section?: SectionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.class) {
        this.class = new CodeableConcept(obj.class);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.encounter) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.author) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ResourceReference(o));
        }
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.confidentiality) {
        this.confidentiality = obj.confidentiality;
      }
      if (obj.attester) {
        this.attester = [];
        for (const o of obj.attester || []) {
          this.attester.push(new AttesterComponent(o));
        }
      }
      if (obj.custodian) {
        this.custodian = new ResourceReference(obj.custodian);
      }
      if (obj.relatesTo) {
        this.relatesTo = [];
        for (const o of obj.relatesTo || []) {
          this.relatesTo.push(new RelatesToComponent(o));
        }
      }
      if (obj.event) {
        this.event = [];
        for (const o of obj.event || []) {
          this.event.push(new EventComponent(o));
        }
      }
      if (obj.section) {
        this.section = [];
        for (const o of obj.section || []) {
          this.section.push(new SectionComponent(o));
        }
      }
    }
  }

}

export class StageComponent extends BackboneElement {
  public summary?: CodeableConcept;
  public assessment?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.summary) {
        this.summary = new CodeableConcept(obj.summary);
      }
      if (obj.assessment) {
        this.assessment = [];
        for (const o of obj.assessment || []) {
          this.assessment.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class EvidenceComponent extends BackboneElement {
  public code?: CodeableConcept[];
  public detail?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.detail) {
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
  public clinicalStatus?: string;
  public verificationStatus?: string;
  public category?: CodeableConcept[];
  public severity?: CodeableConcept;
  public code?: CodeableConcept;
  public bodySite?: CodeableConcept[];
  public subject: ResourceReference;
  public context?: ResourceReference;
  public onset?: Element;
  public abatement?: Element;
  public assertedDate?: Date;
  public asserter?: ResourceReference;
  public stage?: StageComponent;
  public evidence?: EvidenceComponent[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.clinicalStatus) {
        this.clinicalStatus = obj.clinicalStatus;
      }
      if (obj.verificationStatus) {
        this.verificationStatus = obj.verificationStatus;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.severity) {
        this.severity = new CodeableConcept(obj.severity);
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.bodySite) {
        this.bodySite = [];
        for (const o of obj.bodySite || []) {
          this.bodySite.push(new CodeableConcept(o));
        }
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.onset) {
        this.onset = new Element(obj.onset);
      }
      if (obj.abatement) {
        this.abatement = new Element(obj.abatement);
      }
      if (obj.assertedDate) {
        this.assertedDate = new Date(obj.assertedDate);
      }
      if (obj.asserter) {
        this.asserter = new ResourceReference(obj.asserter);
      }
      if (obj.stage) {
        this.stage = new StageComponent(obj.stage);
      }
      if (obj.evidence) {
        this.evidence = [];
        for (const o of obj.evidence || []) {
          this.evidence.push(new EvidenceComponent(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class ActorComponent extends BackboneElement {
  public role: CodeableConcept;
  public reference: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.role) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.reference) {
        this.reference = new ResourceReference(obj.reference);
      }
    }
  }

}

export class PolicyComponent extends BackboneElement {
  public authority?: string;
  public uri?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.authority) {
        this.authority = obj.authority;
      }
      if (obj.uri) {
        this.uri = obj.uri;
      }
    }
  }

}

export class DataComponent extends BackboneElement {
  public meaning: string;
  public reference: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.meaning) {
        this.meaning = obj.meaning;
      }
      if (obj.reference) {
        this.reference = new ResourceReference(obj.reference);
      }
    }
  }

}

export class ExceptActorComponent extends BackboneElement {
  public role: CodeableConcept;
  public reference: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.role) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.reference) {
        this.reference = new ResourceReference(obj.reference);
      }
    }
  }

}

export class ExceptDataComponent extends BackboneElement {
  public meaning: string;
  public reference: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.meaning) {
        this.meaning = obj.meaning;
      }
      if (obj.reference) {
        this.reference = new ResourceReference(obj.reference);
      }
    }
  }

}

export class ExceptComponent extends BackboneElement {
  public type: string;
  public period?: Period;
  public actor?: ExceptActorComponent[];
  public action?: CodeableConcept[];
  public securityLabel?: Coding[];
  public purpose?: Coding[];
  public class?: Coding[];
  public code?: Coding[];
  public dataPeriod?: Period;
  public data?: ExceptDataComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.actor) {
        this.actor = [];
        for (const o of obj.actor || []) {
          this.actor.push(new ExceptActorComponent(o));
        }
      }
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new CodeableConcept(o));
        }
      }
      if (obj.securityLabel) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new Coding(o));
        }
      }
      if (obj.purpose) {
        this.purpose = [];
        for (const o of obj.purpose || []) {
          this.purpose.push(new Coding(o));
        }
      }
      if (obj.class) {
        this.class = [];
        for (const o of obj.class || []) {
          this.class.push(new Coding(o));
        }
      }
      if (obj.code) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new Coding(o));
        }
      }
      if (obj.dataPeriod) {
        this.dataPeriod = new Period(obj.dataPeriod);
      }
      if (obj.data) {
        this.data = [];
        for (const o of obj.data || []) {
          this.data.push(new ExceptDataComponent(o));
        }
      }
    }
  }

}

export class Consent extends DomainResource {
  public resourceType = 'Consent';
  public identifier?: Identifier;
  public status: string;
  public category?: CodeableConcept[];
  public patient: ResourceReference;
  public period?: Period;
  public dateTime?: Date;
  public consentingParty?: ResourceReference[];
  public actor?: ActorComponent[];
  public action?: CodeableConcept[];
  public organization?: ResourceReference[];
  public source?: Element;
  public policy?: PolicyComponent[];
  public policyRule?: string;
  public securityLabel?: Coding[];
  public purpose?: Coding[];
  public dataPeriod?: Period;
  public data?: DataComponent[];
  public except?: ExceptComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.dateTime) {
        this.dateTime = new Date(obj.dateTime);
      }
      if (obj.consentingParty) {
        this.consentingParty = [];
        for (const o of obj.consentingParty || []) {
          this.consentingParty.push(new ResourceReference(o));
        }
      }
      if (obj.actor) {
        this.actor = [];
        for (const o of obj.actor || []) {
          this.actor.push(new ActorComponent(o));
        }
      }
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new CodeableConcept(o));
        }
      }
      if (obj.organization) {
        this.organization = [];
        for (const o of obj.organization || []) {
          this.organization.push(new ResourceReference(o));
        }
      }
      if (obj.source) {
        this.source = new Element(obj.source);
      }
      if (obj.policy) {
        this.policy = [];
        for (const o of obj.policy || []) {
          this.policy.push(new PolicyComponent(o));
        }
      }
      if (obj.policyRule) {
        this.policyRule = obj.policyRule;
      }
      if (obj.securityLabel) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new Coding(o));
        }
      }
      if (obj.purpose) {
        this.purpose = [];
        for (const o of obj.purpose || []) {
          this.purpose.push(new Coding(o));
        }
      }
      if (obj.dataPeriod) {
        this.dataPeriod = new Period(obj.dataPeriod);
      }
      if (obj.data) {
        this.data = [];
        for (const o of obj.data || []) {
          this.data.push(new DataComponent(o));
        }
      }
      if (obj.except) {
        this.except = [];
        for (const o of obj.except || []) {
          this.except.push(new ExceptComponent(o));
        }
      }
    }
  }

}

export class SignatoryComponent extends BackboneElement {
  public type: Coding;
  public party: ResourceReference;
  public signature: Signature[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = new Coding(obj.type);
      }
      if (obj.party) {
        this.party = new ResourceReference(obj.party);
      }
      if (obj.signature) {
        this.signature = [];
        for (const o of obj.signature || []) {
          this.signature.push(new Signature(o));
        }
      }
    }
  }

}

export class ValuedItemComponent extends BackboneElement {
  public entity?: Element;
  public identifier?: Identifier;
  public effectiveTime?: Date;
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public points?: number;
  public net?: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.entity) {
        this.entity = new Element(obj.entity);
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.effectiveTime) {
        this.effectiveTime = new Date(obj.effectiveTime);
      }
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.unitPrice) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.factor) {
        this.factor = obj.factor;
      }
      if (obj.points) {
        this.points = obj.points;
      }
      if (obj.net) {
        this.net = new Money(obj.net);
      }
    }
  }

}

export class TermAgentComponent extends BackboneElement {
  public actor: ResourceReference;
  public role?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.actor) {
        this.actor = new ResourceReference(obj.actor);
      }
      if (obj.role) {
        this.role = [];
        for (const o of obj.role || []) {
          this.role.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class TermValuedItemComponent extends BackboneElement {
  public entity?: Element;
  public identifier?: Identifier;
  public effectiveTime?: Date;
  public quantity?: SimpleQuantity;
  public unitPrice?: Money;
  public factor?: number;
  public points?: number;
  public net?: Money;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.entity) {
        this.entity = new Element(obj.entity);
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.effectiveTime) {
        this.effectiveTime = new Date(obj.effectiveTime);
      }
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.unitPrice) {
        this.unitPrice = new Money(obj.unitPrice);
      }
      if (obj.factor) {
        this.factor = obj.factor;
      }
      if (obj.points) {
        this.points = obj.points;
      }
      if (obj.net) {
        this.net = new Money(obj.net);
      }
    }
  }

}

export class TermComponent extends BackboneElement {
  public identifier?: Identifier;
  public issued?: Date;
  public applies?: Period;
  public type?: CodeableConcept;
  public subType?: CodeableConcept;
  public topic?: ResourceReference[];
  public action?: CodeableConcept[];
  public actionReason?: CodeableConcept[];
  public securityLabel?: Coding[];
  public agent?: TermAgentComponent[];
  public text?: string;
  public valuedItem?: TermValuedItemComponent[];
  public group?: TermComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.issued) {
        this.issued = new Date(obj.issued);
      }
      if (obj.applies) {
        this.applies = new Period(obj.applies);
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.subType) {
        this.subType = new CodeableConcept(obj.subType);
      }
      if (obj.topic) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new ResourceReference(o));
        }
      }
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new CodeableConcept(o));
        }
      }
      if (obj.actionReason) {
        this.actionReason = [];
        for (const o of obj.actionReason || []) {
          this.actionReason.push(new CodeableConcept(o));
        }
      }
      if (obj.securityLabel) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new Coding(o));
        }
      }
      if (obj.agent) {
        this.agent = [];
        for (const o of obj.agent || []) {
          this.agent.push(new TermAgentComponent(o));
        }
      }
      if (obj.text) {
        this.text = obj.text;
      }
      if (obj.valuedItem) {
        this.valuedItem = [];
        for (const o of obj.valuedItem || []) {
          this.valuedItem.push(new TermValuedItemComponent(o));
        }
      }
      if (obj.group) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new TermComponent(o));
        }
      }
    }
  }

}

export class FriendlyLanguageComponent extends BackboneElement {
  public content: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.content) {
        this.content = new Element(obj.content);
      }
    }
  }

}

export class LegalLanguageComponent extends BackboneElement {
  public content: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.content) {
        this.content = new Element(obj.content);
      }
    }
  }

}

export class ComputableLanguageComponent extends BackboneElement {
  public content: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.content) {
        this.content = new Element(obj.content);
      }
    }
  }

}

export class Contract extends DomainResource {
  public resourceType = 'Contract';
  public identifier?: Identifier;
  public status?: string;
  public issued?: Date;
  public applies?: Period;
  public subject?: ResourceReference[];
  public topic?: ResourceReference[];
  public authority?: ResourceReference[];
  public domain?: ResourceReference[];
  public type?: CodeableConcept;
  public subType?: CodeableConcept[];
  public action?: CodeableConcept[];
  public actionReason?: CodeableConcept[];
  public decisionType?: CodeableConcept;
  public contentDerivative?: CodeableConcept;
  public securityLabel?: Coding[];
  public agent?: AgentComponent[];
  public signer?: SignatoryComponent[];
  public valuedItem?: ValuedItemComponent[];
  public term?: TermComponent[];
  public binding?: Element;
  public friendly?: FriendlyLanguageComponent[];
  public legal?: LegalLanguageComponent[];
  public rule?: ComputableLanguageComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.issued) {
        this.issued = new Date(obj.issued);
      }
      if (obj.applies) {
        this.applies = new Period(obj.applies);
      }
      if (obj.subject) {
        this.subject = [];
        for (const o of obj.subject || []) {
          this.subject.push(new ResourceReference(o));
        }
      }
      if (obj.topic) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new ResourceReference(o));
        }
      }
      if (obj.authority) {
        this.authority = [];
        for (const o of obj.authority || []) {
          this.authority.push(new ResourceReference(o));
        }
      }
      if (obj.domain) {
        this.domain = [];
        for (const o of obj.domain || []) {
          this.domain.push(new ResourceReference(o));
        }
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.subType) {
        this.subType = [];
        for (const o of obj.subType || []) {
          this.subType.push(new CodeableConcept(o));
        }
      }
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new CodeableConcept(o));
        }
      }
      if (obj.actionReason) {
        this.actionReason = [];
        for (const o of obj.actionReason || []) {
          this.actionReason.push(new CodeableConcept(o));
        }
      }
      if (obj.decisionType) {
        this.decisionType = new CodeableConcept(obj.decisionType);
      }
      if (obj.contentDerivative) {
        this.contentDerivative = new CodeableConcept(obj.contentDerivative);
      }
      if (obj.securityLabel) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new Coding(o));
        }
      }
      if (obj.agent) {
        this.agent = [];
        for (const o of obj.agent || []) {
          this.agent.push(new AgentComponent(o));
        }
      }
      if (obj.signer) {
        this.signer = [];
        for (const o of obj.signer || []) {
          this.signer.push(new SignatoryComponent(o));
        }
      }
      if (obj.valuedItem) {
        this.valuedItem = [];
        for (const o of obj.valuedItem || []) {
          this.valuedItem.push(new ValuedItemComponent(o));
        }
      }
      if (obj.term) {
        this.term = [];
        for (const o of obj.term || []) {
          this.term.push(new TermComponent(o));
        }
      }
      if (obj.binding) {
        this.binding = new Element(obj.binding);
      }
      if (obj.friendly) {
        this.friendly = [];
        for (const o of obj.friendly || []) {
          this.friendly.push(new FriendlyLanguageComponent(o));
        }
      }
      if (obj.legal) {
        this.legal = [];
        for (const o of obj.legal || []) {
          this.legal.push(new LegalLanguageComponent(o));
        }
      }
      if (obj.rule) {
        this.rule = [];
        for (const o of obj.rule || []) {
          this.rule.push(new ComputableLanguageComponent(o));
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

export class Coverage extends DomainResource {
  public resourceType = 'Coverage';
  public identifier?: Identifier[];
  public status?: string;
  public type?: CodeableConcept;
  public policyHolder?: ResourceReference;
  public subscriber?: ResourceReference;
  public subscriberId?: string;
  public beneficiary?: ResourceReference;
  public relationship?: CodeableConcept;
  public period?: Period;
  public payor?: ResourceReference[];
  public grouping?: GroupComponent;
  public dependent?: string;
  public sequence?: string;
  public order?: number;
  public network?: string;
  public contract?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.policyHolder) {
        this.policyHolder = new ResourceReference(obj.policyHolder);
      }
      if (obj.subscriber) {
        this.subscriber = new ResourceReference(obj.subscriber);
      }
      if (obj.subscriberId) {
        this.subscriberId = obj.subscriberId;
      }
      if (obj.beneficiary) {
        this.beneficiary = new ResourceReference(obj.beneficiary);
      }
      if (obj.relationship) {
        this.relationship = new CodeableConcept(obj.relationship);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.payor) {
        this.payor = [];
        for (const o of obj.payor || []) {
          this.payor.push(new ResourceReference(o));
        }
      }
      if (obj.grouping) {
        this.grouping = new GroupComponent(obj.grouping);
      }
      if (obj.dependent) {
        this.dependent = obj.dependent;
      }
      if (obj.sequence) {
        this.sequence = obj.sequence;
      }
      if (obj.order) {
        this.order = obj.order;
      }
      if (obj.network) {
        this.network = obj.network;
      }
      if (obj.contract) {
        this.contract = [];
        for (const o of obj.contract || []) {
          this.contract.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class DataElement extends DomainResource {
  public resourceType = 'DataElement';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public name?: string;
  public title?: string;
  public contact?: ContactDetail[];
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public copyright?: string;
  public stringency?: string;
  public mapping?: MappingComponent[];
  public element: ElementDefinition[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.stringency) {
        this.stringency = obj.stringency;
      }
      if (obj.mapping) {
        this.mapping = [];
        for (const o of obj.mapping || []) {
          this.mapping.push(new MappingComponent(o));
        }
      }
      if (obj.element) {
        this.element = [];
        for (const o of obj.element || []) {
          this.element.push(new ElementDefinition(o));
        }
      }
    }
  }

}

export class CodeFilterComponent extends Element {
  public path: string;
  public valueSet?: Element;
  public valueCode?: string[];
  public valueCoding?: Coding[];
  public valueCodeableConcept?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.path) {
        this.path = obj.path;
      }
      if (obj.valueSet) {
        this.valueSet = new Element(obj.valueSet);
      }
      if (obj.valueCode) {
        this.valueCode = obj.valueCode;
      }
      if (obj.valueCoding) {
        this.valueCoding = [];
        for (const o of obj.valueCoding || []) {
          this.valueCoding.push(new Coding(o));
        }
      }
      if (obj.valueCodeableConcept) {
        this.valueCodeableConcept = [];
        for (const o of obj.valueCodeableConcept || []) {
          this.valueCodeableConcept.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class DateFilterComponent extends Element {
  public path: string;
  public value?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.path) {
        this.path = obj.path;
      }
      if (obj.value) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class DataRequirement extends Element {
  public type: string;
  public profile?: string[];
  public mustSupport?: string[];
  public codeFilter?: CodeFilterComponent[];
  public dateFilter?: DateFilterComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.profile) {
        this.profile = obj.profile;
      }
      if (obj.mustSupport) {
        this.mustSupport = obj.mustSupport;
      }
      if (obj.codeFilter) {
        this.codeFilter = [];
        for (const o of obj.codeFilter || []) {
          this.codeFilter.push(new CodeFilterComponent(o));
        }
      }
      if (obj.dateFilter) {
        this.dateFilter = [];
        for (const o of obj.dateFilter || []) {
          this.dateFilter.push(new DateFilterComponent(o));
        }
      }
    }
  }

}

export class MitigationComponent extends BackboneElement {
  public action: CodeableConcept;
  public date?: Date;
  public author?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.action) {
        this.action = new CodeableConcept(obj.action);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.author) {
        this.author = new ResourceReference(obj.author);
      }
    }
  }

}

export class DetectedIssue extends DomainResource {
  public resourceType = 'DetectedIssue';
  public identifier?: Identifier;
  public status: string;
  public category?: CodeableConcept;
  public severity?: string;
  public patient?: ResourceReference;
  public date?: Date;
  public author?: ResourceReference;
  public implicated?: ResourceReference[];
  public detail?: string;
  public reference?: string;
  public mitigation?: MitigationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.severity) {
        this.severity = obj.severity;
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.author) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.implicated) {
        this.implicated = [];
        for (const o of obj.implicated || []) {
          this.implicated.push(new ResourceReference(o));
        }
      }
      if (obj.detail) {
        this.detail = obj.detail;
      }
      if (obj.reference) {
        this.reference = obj.reference;
      }
      if (obj.mitigation) {
        this.mitigation = [];
        for (const o of obj.mitigation || []) {
          this.mitigation.push(new MitigationComponent(o));
        }
      }
    }
  }

}

export class UdiComponent extends BackboneElement {
  public deviceIdentifier?: string;
  public name?: string;
  public jurisdiction?: string;
  public carrierHRF?: string;
  public carrierAIDC?: string;
  public issuer?: string;
  public entryType?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.deviceIdentifier) {
        this.deviceIdentifier = obj.deviceIdentifier;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.jurisdiction) {
        this.jurisdiction = obj.jurisdiction;
      }
      if (obj.carrierHRF) {
        this.carrierHRF = obj.carrierHRF;
      }
      if (obj.carrierAIDC) {
        this.carrierAIDC = obj.carrierAIDC;
      }
      if (obj.issuer) {
        this.issuer = obj.issuer;
      }
      if (obj.entryType) {
        this.entryType = obj.entryType;
      }
    }
  }

}

export class Device extends DomainResource {
  public resourceType = 'Device';
  public identifier?: Identifier[];
  public udi?: UdiComponent;
  public status?: string;
  public type?: CodeableConcept;
  public lotNumber?: string;
  public manufacturer?: string;
  public manufactureDate?: Date;
  public expirationDate?: Date;
  public model?: string;
  public version?: string;
  public patient?: ResourceReference;
  public owner?: ResourceReference;
  public contact?: ContactPoint[];
  public location?: ResourceReference;
  public url?: string;
  public note?: Annotation[];
  public safety?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.udi) {
        this.udi = new UdiComponent(obj.udi);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.lotNumber) {
        this.lotNumber = obj.lotNumber;
      }
      if (obj.manufacturer) {
        this.manufacturer = obj.manufacturer;
      }
      if (obj.manufactureDate) {
        this.manufactureDate = new Date(obj.manufactureDate);
      }
      if (obj.expirationDate) {
        this.expirationDate = new Date(obj.expirationDate);
      }
      if (obj.model) {
        this.model = obj.model;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.owner) {
        this.owner = new ResourceReference(obj.owner);
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactPoint(o));
        }
      }
      if (obj.location) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.safety) {
        this.safety = [];
        for (const o of obj.safety || []) {
          this.safety.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class ProductionSpecificationComponent extends BackboneElement {
  public specType?: CodeableConcept;
  public componentId?: Identifier;
  public productionSpec?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.specType) {
        this.specType = new CodeableConcept(obj.specType);
      }
      if (obj.componentId) {
        this.componentId = new Identifier(obj.componentId);
      }
      if (obj.productionSpec) {
        this.productionSpec = obj.productionSpec;
      }
    }
  }

}

export class DeviceComponent extends DomainResource {
  public resourceType = 'DeviceComponent';
  public identifier: Identifier;
  public type: CodeableConcept;
  public lastSystemChange?: Date;
  public source?: ResourceReference;
  public parent?: ResourceReference;
  public operationalStatus?: CodeableConcept[];
  public parameterGroup?: CodeableConcept;
  public measurementPrinciple?: string;
  public productionSpecification?: ProductionSpecificationComponent[];
  public languageCode?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.lastSystemChange) {
        this.lastSystemChange = new Date(obj.lastSystemChange);
      }
      if (obj.source) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.parent) {
        this.parent = new ResourceReference(obj.parent);
      }
      if (obj.operationalStatus) {
        this.operationalStatus = [];
        for (const o of obj.operationalStatus || []) {
          this.operationalStatus.push(new CodeableConcept(o));
        }
      }
      if (obj.parameterGroup) {
        this.parameterGroup = new CodeableConcept(obj.parameterGroup);
      }
      if (obj.measurementPrinciple) {
        this.measurementPrinciple = obj.measurementPrinciple;
      }
      if (obj.productionSpecification) {
        this.productionSpecification = [];
        for (const o of obj.productionSpecification || []) {
          this.productionSpecification.push(new ProductionSpecificationComponent(o));
        }
      }
      if (obj.languageCode) {
        this.languageCode = new CodeableConcept(obj.languageCode);
      }
    }
  }

}

export class CalibrationComponent extends BackboneElement {
  public type?: string;
  public state?: string;
  public time?: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.state) {
        this.state = obj.state;
      }
      if (obj.time) {
        this.time = new Date(obj.time);
      }
    }
  }

}

export class DeviceMetric extends DomainResource {
  public resourceType = 'DeviceMetric';
  public identifier: Identifier;
  public type: CodeableConcept;
  public unit?: CodeableConcept;
  public source?: ResourceReference;
  public parent?: ResourceReference;
  public operationalStatus?: string;
  public color?: string;
  public category: string;
  public measurementPeriod?: Timing;
  public calibration?: CalibrationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.unit) {
        this.unit = new CodeableConcept(obj.unit);
      }
      if (obj.source) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.parent) {
        this.parent = new ResourceReference(obj.parent);
      }
      if (obj.operationalStatus) {
        this.operationalStatus = obj.operationalStatus;
      }
      if (obj.color) {
        this.color = obj.color;
      }
      if (obj.category) {
        this.category = obj.category;
      }
      if (obj.measurementPeriod) {
        this.measurementPeriod = new Timing(obj.measurementPeriod);
      }
      if (obj.calibration) {
        this.calibration = [];
        for (const o of obj.calibration || []) {
          this.calibration.push(new CalibrationComponent(o));
        }
      }
    }
  }

}

export class DeviceRequest extends DomainResource {
  public resourceType = 'DeviceRequest';
  public identifier?: Identifier[];
  public definition?: ResourceReference[];
  public basedOn?: ResourceReference[];
  public priorRequest?: ResourceReference[];
  public groupIdentifier?: Identifier;
  public status?: string;
  public intent: CodeableConcept;
  public priority?: string;
  public code: Element;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public authoredOn?: Date;
  public requester?: RequesterComponent;
  public performerType?: CodeableConcept;
  public performer?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public supportingInfo?: ResourceReference[];
  public note?: Annotation[];
  public relevantHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.priorRequest) {
        this.priorRequest = [];
        for (const o of obj.priorRequest || []) {
          this.priorRequest.push(new ResourceReference(o));
        }
      }
      if (obj.groupIdentifier) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.intent) {
        this.intent = new CodeableConcept(obj.intent);
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
      if (obj.code) {
        this.code = new Element(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.occurrence) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.authoredOn) {
        this.authoredOn = new Date(obj.authoredOn);
      }
      if (obj.requester) {
        this.requester = new RequesterComponent(obj.requester);
      }
      if (obj.performerType) {
        this.performerType = new CodeableConcept(obj.performerType);
      }
      if (obj.performer) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.supportingInfo) {
        this.supportingInfo = [];
        for (const o of obj.supportingInfo || []) {
          this.supportingInfo.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.relevantHistory) {
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
  public status: string;
  public subject: ResourceReference;
  public whenUsed?: Period;
  public timing?: Element;
  public recordedOn?: Date;
  public source?: ResourceReference;
  public device: ResourceReference;
  public indication?: CodeableConcept[];
  public bodySite?: CodeableConcept;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.whenUsed) {
        this.whenUsed = new Period(obj.whenUsed);
      }
      if (obj.timing) {
        this.timing = new Element(obj.timing);
      }
      if (obj.recordedOn) {
        this.recordedOn = new Date(obj.recordedOn);
      }
      if (obj.source) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.device) {
        this.device = new ResourceReference(obj.device);
      }
      if (obj.indication) {
        this.indication = [];
        for (const o of obj.indication || []) {
          this.indication.push(new CodeableConcept(o));
        }
      }
      if (obj.bodySite) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class PerformerComponent extends BackboneElement {
  public role?: CodeableConcept;
  public actor: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.role) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.actor) {
        this.actor = new ResourceReference(obj.actor);
      }
    }
  }

}

export class ImageComponent extends BackboneElement {
  public comment?: string;
  public link: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.comment) {
        this.comment = obj.comment;
      }
      if (obj.link) {
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
  public performer?: PerformerComponent[];
  public specimen?: ResourceReference[];
  public result?: ResourceReference[];
  public imagingStudy?: ResourceReference[];
  public image?: ImageComponent[];
  public conclusion?: string;
  public codedDiagnosis?: CodeableConcept[];
  public presentedForm?: Attachment[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.effective) {
        this.effective = new Element(obj.effective);
      }
      if (obj.issued) {
        this.issued = new Date(obj.issued);
      }
      if (obj.performer) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new PerformerComponent(o));
        }
      }
      if (obj.specimen) {
        this.specimen = [];
        for (const o of obj.specimen || []) {
          this.specimen.push(new ResourceReference(o));
        }
      }
      if (obj.result) {
        this.result = [];
        for (const o of obj.result || []) {
          this.result.push(new ResourceReference(o));
        }
      }
      if (obj.imagingStudy) {
        this.imagingStudy = [];
        for (const o of obj.imagingStudy || []) {
          this.imagingStudy.push(new ResourceReference(o));
        }
      }
      if (obj.image) {
        this.image = [];
        for (const o of obj.image || []) {
          this.image.push(new ImageComponent(o));
        }
      }
      if (obj.conclusion) {
        this.conclusion = obj.conclusion;
      }
      if (obj.codedDiagnosis) {
        this.codedDiagnosis = [];
        for (const o of obj.codedDiagnosis || []) {
          this.codedDiagnosis.push(new CodeableConcept(o));
        }
      }
      if (obj.presentedForm) {
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

export class ContentComponent extends BackboneElement {
  public attachment: Attachment;
  public format?: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.attachment) {
        this.attachment = new Attachment(obj.attachment);
      }
      if (obj.format) {
        this.format = obj.format;
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
  public author?: ResourceReference[];
  public recipient?: ResourceReference[];
  public source?: string;
  public description?: string;
  public content: ContentComponent[];
  public related?: RelatedComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.masterIdentifier) {
        this.masterIdentifier = new Identifier(obj.masterIdentifier);
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.created) {
        this.created = new Date(obj.created);
      }
      if (obj.author) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ResourceReference(o));
        }
      }
      if (obj.recipient) {
        this.recipient = [];
        for (const o of obj.recipient || []) {
          this.recipient.push(new ResourceReference(o));
        }
      }
      if (obj.source) {
        this.source = obj.source;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.content) {
        this.content = [];
        for (const o of obj.content || []) {
          this.content.push(new ContentComponent(o));
        }
      }
      if (obj.related) {
        this.related = [];
        for (const o of obj.related || []) {
          this.related.push(new RelatedComponent(o));
        }
      }
    }
  }

}

export class ContextComponent extends BackboneElement {
  public encounter?: ResourceReference;
  public event?: CodeableConcept[];
  public period?: Period;
  public facilityType?: CodeableConcept;
  public practiceSetting?: CodeableConcept;
  public sourcePatientInfo?: ResourceReference;
  public related?: RelatedComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.encounter) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.event) {
        this.event = [];
        for (const o of obj.event || []) {
          this.event.push(new CodeableConcept(o));
        }
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.facilityType) {
        this.facilityType = new CodeableConcept(obj.facilityType);
      }
      if (obj.practiceSetting) {
        this.practiceSetting = new CodeableConcept(obj.practiceSetting);
      }
      if (obj.sourcePatientInfo) {
        this.sourcePatientInfo = new ResourceReference(obj.sourcePatientInfo);
      }
      if (obj.related) {
        this.related = [];
        for (const o of obj.related || []) {
          this.related.push(new RelatedComponent(o));
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
  public type: CodeableConcept;
  public class?: CodeableConcept;
  public subject?: ResourceReference;
  public created?: string;
  public indexed: string;
  public author?: ResourceReference[];
  public authenticator?: ResourceReference;
  public custodian?: ResourceReference;
  public relatesTo?: RelatesToComponent[];
  public description?: string;
  public securityLabel?: CodeableConcept[];
  public content: ContentComponent[];
  public context?: ContextComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.masterIdentifier) {
        this.masterIdentifier = new Identifier(obj.masterIdentifier);
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.docStatus) {
        this.docStatus = obj.docStatus;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.class) {
        this.class = new CodeableConcept(obj.class);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.created) {
        this.created = obj.created;
      }
      if (obj.indexed) {
        this.indexed = obj.indexed;
      }
      if (obj.author) {
        this.author = [];
        for (const o of obj.author || []) {
          this.author.push(new ResourceReference(o));
        }
      }
      if (obj.authenticator) {
        this.authenticator = new ResourceReference(obj.authenticator);
      }
      if (obj.custodian) {
        this.custodian = new ResourceReference(obj.custodian);
      }
      if (obj.relatesTo) {
        this.relatesTo = [];
        for (const o of obj.relatesTo || []) {
          this.relatesTo.push(new RelatesToComponent(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.securityLabel) {
        this.securityLabel = [];
        for (const o of obj.securityLabel || []) {
          this.securityLabel.push(new CodeableConcept(o));
        }
      }
      if (obj.content) {
        this.content = [];
        for (const o of obj.content || []) {
          this.content.push(new ContentComponent(o));
        }
      }
      if (obj.context) {
        this.context = new ContextComponent(obj.context);
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

export class EligibilityRequest extends DomainResource {
  public resourceType = 'EligibilityRequest';
  public identifier?: Identifier[];
  public status?: string;
  public priority?: CodeableConcept;
  public patient?: ResourceReference;
  public serviced?: Element;
  public created?: string;
  public enterer?: ResourceReference;
  public provider?: ResourceReference;
  public organization?: ResourceReference;
  public insurer?: ResourceReference;
  public facility?: ResourceReference;
  public coverage?: ResourceReference;
  public businessArrangement?: string;
  public benefitCategory?: CodeableConcept;
  public benefitSubCategory?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.priority) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.serviced) {
        this.serviced = new Element(obj.serviced);
      }
      if (obj.created) {
        this.created = obj.created;
      }
      if (obj.enterer) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.provider) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.insurer) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.facility) {
        this.facility = new ResourceReference(obj.facility);
      }
      if (obj.coverage) {
        this.coverage = new ResourceReference(obj.coverage);
      }
      if (obj.businessArrangement) {
        this.businessArrangement = obj.businessArrangement;
      }
      if (obj.benefitCategory) {
        this.benefitCategory = new CodeableConcept(obj.benefitCategory);
      }
      if (obj.benefitSubCategory) {
        this.benefitSubCategory = new CodeableConcept(obj.benefitSubCategory);
      }
    }
  }

}

export class ErrorsComponent extends BackboneElement {
  public code: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
    }
  }

}

export class EligibilityResponse extends DomainResource {
  public resourceType = 'EligibilityResponse';
  public identifier?: Identifier[];
  public status?: string;
  public created?: string;
  public requestProvider?: ResourceReference;
  public requestOrganization?: ResourceReference;
  public request?: ResourceReference;
  public outcome?: CodeableConcept;
  public disposition?: string;
  public insurer?: ResourceReference;
  public inforce?: boolean;
  public insurance?: InsuranceComponent[];
  public form?: CodeableConcept;
  public error?: ErrorsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.created) {
        this.created = obj.created;
      }
      if (obj.requestProvider) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
      if (obj.requestOrganization) {
        this.requestOrganization = new ResourceReference(obj.requestOrganization);
      }
      if (obj.request) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.disposition) {
        this.disposition = obj.disposition;
      }
      if (obj.insurer) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.inforce) {
        this.inforce = obj.inforce;
      }
      if (obj.insurance) {
        this.insurance = [];
        for (const o of obj.insurance || []) {
          this.insurance.push(new InsuranceComponent(o));
        }
      }
      if (obj.form) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.error) {
        this.error = [];
        for (const o of obj.error || []) {
          this.error.push(new ErrorsComponent(o));
        }
      }
    }
  }

}

export class StatusHistoryComponent extends BackboneElement {
  public status: string;
  public period: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class ClassHistoryComponent extends BackboneElement {
  public class: Coding;
  public period: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.class) {
        this.class = new Coding(obj.class);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class HospitalizationComponent extends BackboneElement {
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
      if (obj.preAdmissionIdentifier) {
        this.preAdmissionIdentifier = new Identifier(obj.preAdmissionIdentifier);
      }
      if (obj.origin) {
        this.origin = new ResourceReference(obj.origin);
      }
      if (obj.admitSource) {
        this.admitSource = new CodeableConcept(obj.admitSource);
      }
      if (obj.reAdmission) {
        this.reAdmission = new CodeableConcept(obj.reAdmission);
      }
      if (obj.dietPreference) {
        this.dietPreference = [];
        for (const o of obj.dietPreference || []) {
          this.dietPreference.push(new CodeableConcept(o));
        }
      }
      if (obj.specialCourtesy) {
        this.specialCourtesy = [];
        for (const o of obj.specialCourtesy || []) {
          this.specialCourtesy.push(new CodeableConcept(o));
        }
      }
      if (obj.specialArrangement) {
        this.specialArrangement = [];
        for (const o of obj.specialArrangement || []) {
          this.specialArrangement.push(new CodeableConcept(o));
        }
      }
      if (obj.destination) {
        this.destination = new ResourceReference(obj.destination);
      }
      if (obj.dischargeDisposition) {
        this.dischargeDisposition = new CodeableConcept(obj.dischargeDisposition);
      }
    }
  }

}

export class LocationComponent extends BackboneElement {
  public location: ResourceReference;
  public status?: string;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.location) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class Encounter extends DomainResource {
  public resourceType = 'Encounter';
  public identifier?: Identifier[];
  public status: string;
  public statusHistory?: StatusHistoryComponent[];
  public class?: Coding;
  public classHistory?: ClassHistoryComponent[];
  public type?: CodeableConcept[];
  public priority?: CodeableConcept;
  public subject?: ResourceReference;
  public episodeOfCare?: ResourceReference[];
  public incomingReferral?: ResourceReference[];
  public participant?: ParticipantComponent[];
  public appointment?: ResourceReference;
  public period?: Period;
  public length?: Duration;
  public reason?: CodeableConcept[];
  public diagnosis?: DiagnosisComponent[];
  public account?: ResourceReference[];
  public hospitalization?: HospitalizationComponent;
  public location?: LocationComponent[];
  public serviceProvider?: ResourceReference;
  public partOf?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.statusHistory) {
        this.statusHistory = [];
        for (const o of obj.statusHistory || []) {
          this.statusHistory.push(new StatusHistoryComponent(o));
        }
      }
      if (obj.class) {
        this.class = new Coding(obj.class);
      }
      if (obj.classHistory) {
        this.classHistory = [];
        for (const o of obj.classHistory || []) {
          this.classHistory.push(new ClassHistoryComponent(o));
        }
      }
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.priority) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.episodeOfCare) {
        this.episodeOfCare = [];
        for (const o of obj.episodeOfCare || []) {
          this.episodeOfCare.push(new ResourceReference(o));
        }
      }
      if (obj.incomingReferral) {
        this.incomingReferral = [];
        for (const o of obj.incomingReferral || []) {
          this.incomingReferral.push(new ResourceReference(o));
        }
      }
      if (obj.participant) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new ParticipantComponent(o));
        }
      }
      if (obj.appointment) {
        this.appointment = new ResourceReference(obj.appointment);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.length) {
        this.length = new Duration(obj.length);
      }
      if (obj.reason) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.diagnosis) {
        this.diagnosis = [];
        for (const o of obj.diagnosis || []) {
          this.diagnosis.push(new DiagnosisComponent(o));
        }
      }
      if (obj.account) {
        this.account = [];
        for (const o of obj.account || []) {
          this.account.push(new ResourceReference(o));
        }
      }
      if (obj.hospitalization) {
        this.hospitalization = new HospitalizationComponent(obj.hospitalization);
      }
      if (obj.location) {
        this.location = [];
        for (const o of obj.location || []) {
          this.location.push(new LocationComponent(o));
        }
      }
      if (obj.serviceProvider) {
        this.serviceProvider = new ResourceReference(obj.serviceProvider);
      }
      if (obj.partOf) {
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
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.connectionType) {
        this.connectionType = new Coding(obj.connectionType);
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.managingOrganization) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactPoint(o));
        }
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.payloadType) {
        this.payloadType = [];
        for (const o of obj.payloadType || []) {
          this.payloadType.push(new CodeableConcept(o));
        }
      }
      if (obj.payloadMimeType) {
        this.payloadMimeType = obj.payloadMimeType;
      }
      if (obj.address) {
        this.address = obj.address;
      }
      if (obj.header) {
        this.header = obj.header;
      }
    }
  }

}

export class EnrollmentRequest extends DomainResource {
  public resourceType = 'EnrollmentRequest';
  public identifier?: Identifier[];
  public status?: string;
  public created?: string;
  public insurer?: ResourceReference;
  public provider?: ResourceReference;
  public organization?: ResourceReference;
  public subject?: ResourceReference;
  public coverage?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.created) {
        this.created = obj.created;
      }
      if (obj.insurer) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.provider) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.coverage) {
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
  public outcome?: CodeableConcept;
  public disposition?: string;
  public created?: string;
  public organization?: ResourceReference;
  public requestProvider?: ResourceReference;
  public requestOrganization?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.request) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.disposition) {
        this.disposition = obj.disposition;
      }
      if (obj.created) {
        this.created = obj.created;
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.requestProvider) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
      if (obj.requestOrganization) {
        this.requestOrganization = new ResourceReference(obj.requestOrganization);
      }
    }
  }

}

export class EpisodeOfCare extends DomainResource {
  public resourceType = 'EpisodeOfCare';
  public identifier?: Identifier[];
  public status: string;
  public statusHistory?: StatusHistoryComponent[];
  public type?: CodeableConcept[];
  public diagnosis?: DiagnosisComponent[];
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
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.statusHistory) {
        this.statusHistory = [];
        for (const o of obj.statusHistory || []) {
          this.statusHistory.push(new StatusHistoryComponent(o));
        }
      }
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.diagnosis) {
        this.diagnosis = [];
        for (const o of obj.diagnosis || []) {
          this.diagnosis.push(new DiagnosisComponent(o));
        }
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.managingOrganization) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.referralRequest) {
        this.referralRequest = [];
        for (const o of obj.referralRequest || []) {
          this.referralRequest.push(new ResourceReference(o));
        }
      }
      if (obj.careManager) {
        this.careManager = new ResourceReference(obj.careManager);
      }
      if (obj.team) {
        this.team = [];
        for (const o of obj.team || []) {
          this.team.push(new ResourceReference(o));
        }
      }
      if (obj.account) {
        this.account = [];
        for (const o of obj.account || []) {
          this.account.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class FixedVersionComponent extends BackboneElement {
  public system: string;
  public version: string;
  public mode: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.mode) {
        this.mode = obj.mode;
      }
    }
  }

}

export class ExcludedSystemComponent extends BackboneElement {
  public system: string;
  public version?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.version) {
        this.version = obj.version;
      }
    }
  }

}

export class ExpansionProfile extends DomainResource {
  public resourceType = 'ExpansionProfile';
  public url?: string;
  public identifier?: Identifier;
  public version?: string;
  public name?: string;
  public status: string;
  public experimental?: boolean;
  public date?: string;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public fixedVersion?: FixedVersionComponent[];
  public excludedSystem?: ExcludedSystemComponent;
  public includeDesignations?: boolean;
  public designation?: DesignationComponent;
  public includeDefinition?: boolean;
  public activeOnly?: boolean;
  public excludeNested?: boolean;
  public excludeNotForUI?: boolean;
  public excludePostCoordinated?: boolean;
  public displayLanguage?: string;
  public limitedExpansion?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = obj.date;
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.fixedVersion) {
        this.fixedVersion = [];
        for (const o of obj.fixedVersion || []) {
          this.fixedVersion.push(new FixedVersionComponent(o));
        }
      }
      if (obj.excludedSystem) {
        this.excludedSystem = new ExcludedSystemComponent(obj.excludedSystem);
      }
      if (obj.includeDesignations) {
        this.includeDesignations = obj.includeDesignations;
      }
      if (obj.designation) {
        this.designation = new DesignationComponent(obj.designation);
      }
      if (obj.includeDefinition) {
        this.includeDefinition = obj.includeDefinition;
      }
      if (obj.activeOnly) {
        this.activeOnly = obj.activeOnly;
      }
      if (obj.excludeNested) {
        this.excludeNested = obj.excludeNested;
      }
      if (obj.excludeNotForUI) {
        this.excludeNotForUI = obj.excludeNotForUI;
      }
      if (obj.excludePostCoordinated) {
        this.excludePostCoordinated = obj.excludePostCoordinated;
      }
      if (obj.displayLanguage) {
        this.displayLanguage = obj.displayLanguage;
      }
      if (obj.limitedExpansion) {
        this.limitedExpansion = obj.limitedExpansion;
      }
    }
  }

}

export class SupportingInformationComponent extends BackboneElement {
  public sequence: number;
  public category: CodeableConcept;
  public code?: CodeableConcept;
  public timing?: Element;
  public value?: Element;
  public reason?: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequence) {
        this.sequence = obj.sequence;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.timing) {
        this.timing = new Element(obj.timing);
      }
      if (obj.value) {
        this.value = new Element(obj.value);
      }
      if (obj.reason) {
        this.reason = new Coding(obj.reason);
      }
    }
  }

}

export class BenefitComponent extends BackboneElement {
  public type: CodeableConcept;
  public allowed?: Element;
  public used?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.allowed) {
        this.allowed = new Element(obj.allowed);
      }
      if (obj.used) {
        this.used = new Element(obj.used);
      }
    }
  }

}

export class BenefitBalanceComponent extends BackboneElement {
  public category: CodeableConcept;
  public subCategory?: CodeableConcept;
  public excluded?: boolean;
  public name?: string;
  public description?: string;
  public network?: CodeableConcept;
  public unit?: CodeableConcept;
  public term?: CodeableConcept;
  public financial?: BenefitComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.subCategory) {
        this.subCategory = new CodeableConcept(obj.subCategory);
      }
      if (obj.excluded) {
        this.excluded = obj.excluded;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.network) {
        this.network = new CodeableConcept(obj.network);
      }
      if (obj.unit) {
        this.unit = new CodeableConcept(obj.unit);
      }
      if (obj.term) {
        this.term = new CodeableConcept(obj.term);
      }
      if (obj.financial) {
        this.financial = [];
        for (const o of obj.financial || []) {
          this.financial.push(new BenefitComponent(o));
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
  public subType?: CodeableConcept[];
  public patient?: ResourceReference;
  public billablePeriod?: Period;
  public created?: string;
  public enterer?: ResourceReference;
  public insurer?: ResourceReference;
  public provider?: ResourceReference;
  public organization?: ResourceReference;
  public referral?: ResourceReference;
  public facility?: ResourceReference;
  public claim?: ResourceReference;
  public claimResponse?: ResourceReference;
  public outcome?: CodeableConcept;
  public disposition?: string;
  public related?: RelatedClaimComponent[];
  public prescription?: ResourceReference;
  public originalPrescription?: ResourceReference;
  public payee?: PayeeComponent;
  public information?: SupportingInformationComponent[];
  public careTeam?: CareTeamComponent[];
  public diagnosis?: DiagnosisComponent[];
  public procedure?: ProcedureComponent[];
  public precedence?: number;
  public insurance?: InsuranceComponent;
  public accident?: AccidentComponent;
  public employmentImpacted?: Period;
  public hospitalization?: Period;
  public item?: ItemComponent[];
  public addItem?: AddedItemComponent[];
  public totalCost?: Money;
  public unallocDeductable?: Money;
  public totalBenefit?: Money;
  public payment?: PaymentComponent;
  public form?: CodeableConcept;
  public processNote?: NoteComponent[];
  public benefitBalance?: BenefitBalanceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.subType) {
        this.subType = [];
        for (const o of obj.subType || []) {
          this.subType.push(new CodeableConcept(o));
        }
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.billablePeriod) {
        this.billablePeriod = new Period(obj.billablePeriod);
      }
      if (obj.created) {
        this.created = obj.created;
      }
      if (obj.enterer) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.insurer) {
        this.insurer = new ResourceReference(obj.insurer);
      }
      if (obj.provider) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.referral) {
        this.referral = new ResourceReference(obj.referral);
      }
      if (obj.facility) {
        this.facility = new ResourceReference(obj.facility);
      }
      if (obj.claim) {
        this.claim = new ResourceReference(obj.claim);
      }
      if (obj.claimResponse) {
        this.claimResponse = new ResourceReference(obj.claimResponse);
      }
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.disposition) {
        this.disposition = obj.disposition;
      }
      if (obj.related) {
        this.related = [];
        for (const o of obj.related || []) {
          this.related.push(new RelatedClaimComponent(o));
        }
      }
      if (obj.prescription) {
        this.prescription = new ResourceReference(obj.prescription);
      }
      if (obj.originalPrescription) {
        this.originalPrescription = new ResourceReference(obj.originalPrescription);
      }
      if (obj.payee) {
        this.payee = new PayeeComponent(obj.payee);
      }
      if (obj.information) {
        this.information = [];
        for (const o of obj.information || []) {
          this.information.push(new SupportingInformationComponent(o));
        }
      }
      if (obj.careTeam) {
        this.careTeam = [];
        for (const o of obj.careTeam || []) {
          this.careTeam.push(new CareTeamComponent(o));
        }
      }
      if (obj.diagnosis) {
        this.diagnosis = [];
        for (const o of obj.diagnosis || []) {
          this.diagnosis.push(new DiagnosisComponent(o));
        }
      }
      if (obj.procedure) {
        this.procedure = [];
        for (const o of obj.procedure || []) {
          this.procedure.push(new ProcedureComponent(o));
        }
      }
      if (obj.precedence) {
        this.precedence = obj.precedence;
      }
      if (obj.insurance) {
        this.insurance = new InsuranceComponent(obj.insurance);
      }
      if (obj.accident) {
        this.accident = new AccidentComponent(obj.accident);
      }
      if (obj.employmentImpacted) {
        this.employmentImpacted = new Period(obj.employmentImpacted);
      }
      if (obj.hospitalization) {
        this.hospitalization = new Period(obj.hospitalization);
      }
      if (obj.item) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ItemComponent(o));
        }
      }
      if (obj.addItem) {
        this.addItem = [];
        for (const o of obj.addItem || []) {
          this.addItem.push(new AddedItemComponent(o));
        }
      }
      if (obj.totalCost) {
        this.totalCost = new Money(obj.totalCost);
      }
      if (obj.unallocDeductable) {
        this.unallocDeductable = new Money(obj.unallocDeductable);
      }
      if (obj.totalBenefit) {
        this.totalBenefit = new Money(obj.totalBenefit);
      }
      if (obj.payment) {
        this.payment = new PaymentComponent(obj.payment);
      }
      if (obj.form) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.processNote) {
        this.processNote = [];
        for (const o of obj.processNote || []) {
          this.processNote.push(new NoteComponent(o));
        }
      }
      if (obj.benefitBalance) {
        this.benefitBalance = [];
        for (const o of obj.benefitBalance || []) {
          this.benefitBalance.push(new BenefitBalanceComponent(o));
        }
      }
    }
  }

}

export class ConditionComponent extends BackboneElement {
  public code: CodeableConcept;
  public outcome?: CodeableConcept;
  public onset?: Element;
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.onset) {
        this.onset = new Element(obj.onset);
      }
      if (obj.note) {
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
  public definition?: ResourceReference[];
  public status: string;
  public notDone?: boolean;
  public notDoneReason?: CodeableConcept;
  public patient: ResourceReference;
  public date?: string;
  public name?: string;
  public relationship: CodeableConcept;
  public gender?: string;
  public born?: Element;
  public age?: Element;
  public estimatedAge?: boolean;
  public deceased?: Element;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];
  public condition?: ConditionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.notDone) {
        this.notDone = obj.notDone;
      }
      if (obj.notDoneReason) {
        this.notDoneReason = new CodeableConcept(obj.notDoneReason);
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.date) {
        this.date = obj.date;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.relationship) {
        this.relationship = new CodeableConcept(obj.relationship);
      }
      if (obj.gender) {
        this.gender = obj.gender;
      }
      if (obj.born) {
        this.born = new Element(obj.born);
      }
      if (obj.age) {
        this.age = new Element(obj.age);
      }
      if (obj.estimatedAge) {
        this.estimatedAge = obj.estimatedAge;
      }
      if (obj.deceased) {
        this.deceased = new Element(obj.deceased);
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.condition) {
        this.condition = [];
        for (const o of obj.condition || []) {
          this.condition.push(new ConditionComponent(o));
        }
      }
    }
  }

}

export class TargetComponent extends BackboneElement {
  public measure?: CodeableConcept;
  public detail?: Element;
  public due?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.measure) {
        this.measure = new CodeableConcept(obj.measure);
      }
      if (obj.detail) {
        this.detail = new Element(obj.detail);
      }
      if (obj.due) {
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
  public subject?: ResourceReference;
  public start?: Element;
  public target?: TargetComponent;
  public statusDate?: string;
  public statusReason?: string;
  public expressedBy?: ResourceReference;
  public addresses?: ResourceReference[];
  public note?: Annotation[];
  public outcomeCode?: CodeableConcept[];
  public outcomeReference?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.priority) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.description) {
        this.description = new CodeableConcept(obj.description);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.start) {
        this.start = new Element(obj.start);
      }
      if (obj.target) {
        this.target = new TargetComponent(obj.target);
      }
      if (obj.statusDate) {
        this.statusDate = obj.statusDate;
      }
      if (obj.statusReason) {
        this.statusReason = obj.statusReason;
      }
      if (obj.expressedBy) {
        this.expressedBy = new ResourceReference(obj.expressedBy);
      }
      if (obj.addresses) {
        this.addresses = [];
        for (const o of obj.addresses || []) {
          this.addresses.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.outcomeCode) {
        this.outcomeCode = [];
        for (const o of obj.outcomeCode || []) {
          this.outcomeCode.push(new CodeableConcept(o));
        }
      }
      if (obj.outcomeReference) {
        this.outcomeReference = [];
        for (const o of obj.outcomeReference || []) {
          this.outcomeReference.push(new ResourceReference(o));
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
  public date?: string;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public start: string;
  public profile?: string;
  public link?: LinkComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = obj.date;
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.start) {
        this.start = obj.start;
      }
      if (obj.profile) {
        this.profile = obj.profile;
      }
      if (obj.link) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new LinkComponent(o));
        }
      }
    }
  }

}

export class CharacteristicComponent extends BackboneElement {
  public code: CodeableConcept;
  public value: Element;
  public exclude: boolean;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.value) {
        this.value = new Element(obj.value);
      }
      if (obj.exclude) {
        this.exclude = obj.exclude;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class MemberComponent extends BackboneElement {
  public entity: ResourceReference;
  public period?: Period;
  public inactive?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.entity) {
        this.entity = new ResourceReference(obj.entity);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.inactive) {
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
  public quantity?: number;
  public characteristic?: CharacteristicComponent[];
  public member?: MemberComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.actual) {
        this.actual = obj.actual;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.quantity) {
        this.quantity = obj.quantity;
      }
      if (obj.characteristic) {
        this.characteristic = [];
        for (const o of obj.characteristic || []) {
          this.characteristic.push(new CharacteristicComponent(o));
        }
      }
      if (obj.member) {
        this.member = [];
        for (const o of obj.member || []) {
          this.member.push(new MemberComponent(o));
        }
      }
    }
  }

}

export class GuidanceResponse extends DomainResource {
  public resourceType = 'GuidanceResponse';
  public requestId?: string;
  public identifier?: Identifier;
  public module: ResourceReference;
  public status: string;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public occurrenceDateTime?: string;
  public performer?: ResourceReference;
  public reason?: Element;
  public note?: Annotation[];
  public evaluationMessage?: ResourceReference[];
  public outputParameters?: ResourceReference;
  public result?: ResourceReference;
  public dataRequirement?: DataRequirement[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.requestId) {
        this.requestId = obj.requestId;
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.module) {
        this.module = new ResourceReference(obj.module);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.occurrenceDateTime) {
        this.occurrenceDateTime = obj.occurrenceDateTime;
      }
      if (obj.performer) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.reason) {
        this.reason = new Element(obj.reason);
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.evaluationMessage) {
        this.evaluationMessage = [];
        for (const o of obj.evaluationMessage || []) {
          this.evaluationMessage.push(new ResourceReference(o));
        }
      }
      if (obj.outputParameters) {
        this.outputParameters = new ResourceReference(obj.outputParameters);
      }
      if (obj.result) {
        this.result = new ResourceReference(obj.result);
      }
      if (obj.dataRequirement) {
        this.dataRequirement = [];
        for (const o of obj.dataRequirement || []) {
          this.dataRequirement.push(new DataRequirement(o));
        }
      }
    }
  }

}

export class AvailableTimeComponent extends BackboneElement {
  public daysOfWeek?: string[];
  public allDay?: boolean;
  public availableStartTime?: string;
  public availableEndTime?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.daysOfWeek) {
        this.daysOfWeek = obj.daysOfWeek;
      }
      if (obj.allDay) {
        this.allDay = obj.allDay;
      }
      if (obj.availableStartTime) {
        this.availableStartTime = obj.availableStartTime;
      }
      if (obj.availableEndTime) {
        this.availableEndTime = obj.availableEndTime;
      }
    }
  }

}

export class NotAvailableComponent extends BackboneElement {
  public description: string;
  public during?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.during) {
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
  public category?: CodeableConcept;
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
  public availableTime?: AvailableTimeComponent[];
  public notAvailable?: NotAvailableComponent[];
  public availabilityExceptions?: string;
  public endpoint?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.providedBy) {
        this.providedBy = new ResourceReference(obj.providedBy);
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.specialty) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.location) {
        this.location = [];
        for (const o of obj.location || []) {
          this.location.push(new ResourceReference(o));
        }
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
      if (obj.extraDetails) {
        this.extraDetails = obj.extraDetails;
      }
      if (obj.photo) {
        this.photo = new Attachment(obj.photo);
      }
      if (obj.telecom) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.coverageArea) {
        this.coverageArea = [];
        for (const o of obj.coverageArea || []) {
          this.coverageArea.push(new ResourceReference(o));
        }
      }
      if (obj.serviceProvisionCode) {
        this.serviceProvisionCode = [];
        for (const o of obj.serviceProvisionCode || []) {
          this.serviceProvisionCode.push(new CodeableConcept(o));
        }
      }
      if (obj.eligibility) {
        this.eligibility = new CodeableConcept(obj.eligibility);
      }
      if (obj.eligibilityNote) {
        this.eligibilityNote = obj.eligibilityNote;
      }
      if (obj.programName) {
        this.programName = obj.programName;
      }
      if (obj.characteristic) {
        this.characteristic = [];
        for (const o of obj.characteristic || []) {
          this.characteristic.push(new CodeableConcept(o));
        }
      }
      if (obj.referralMethod) {
        this.referralMethod = [];
        for (const o of obj.referralMethod || []) {
          this.referralMethod.push(new CodeableConcept(o));
        }
      }
      if (obj.appointmentRequired) {
        this.appointmentRequired = obj.appointmentRequired;
      }
      if (obj.availableTime) {
        this.availableTime = [];
        for (const o of obj.availableTime || []) {
          this.availableTime.push(new AvailableTimeComponent(o));
        }
      }
      if (obj.notAvailable) {
        this.notAvailable = [];
        for (const o of obj.notAvailable || []) {
          this.notAvailable.push(new NotAvailableComponent(o));
        }
      }
      if (obj.availabilityExceptions) {
        this.availabilityExceptions = obj.availabilityExceptions;
      }
      if (obj.endpoint) {
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
      if (obj.use) {
        this.use = obj.use;
      }
      if (obj.text) {
        this.text = obj.text;
      }
      if (obj.family) {
        this.family = obj.family;
      }
      if (obj.given) {
        this.given = obj.given;
      }
      if (obj.prefix) {
        this.prefix = obj.prefix;
      }
      if (obj.suffix) {
        this.suffix = obj.suffix;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
    }
  }

  getDisplay(): string {
    if (this.family && this.given && this.given.length > 0) {
      return this.family + ', ' + this.given[0];
    } else if (this.family) {
      return this.family;
    } else if (this.given && this.given.length > 0) {
      return this.given[0];
    }
  }
}

export class InstanceComponent extends BackboneElement {
  public sopClass: string;
  public uid: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sopClass) {
        this.sopClass = obj.sopClass;
      }
      if (obj.uid) {
        this.uid = obj.uid;
      }
    }
  }

}

export class SeriesComponent extends BackboneElement {
  public uid: string;
  public endpoint?: ResourceReference[];
  public instance: InstanceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.uid) {
        this.uid = obj.uid;
      }
      if (obj.endpoint) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
      if (obj.instance) {
        this.instance = [];
        for (const o of obj.instance || []) {
          this.instance.push(new InstanceComponent(o));
        }
      }
    }
  }

}

export class StudyComponent extends BackboneElement {
  public uid: string;
  public imagingStudy?: ResourceReference;
  public endpoint?: ResourceReference[];
  public series: SeriesComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.uid) {
        this.uid = obj.uid;
      }
      if (obj.imagingStudy) {
        this.imagingStudy = new ResourceReference(obj.imagingStudy);
      }
      if (obj.endpoint) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
      if (obj.series) {
        this.series = [];
        for (const o of obj.series || []) {
          this.series.push(new SeriesComponent(o));
        }
      }
    }
  }

}

export class ImagingManifest extends DomainResource {
  public resourceType = 'ImagingManifest';
  public identifier?: Identifier;
  public patient: ResourceReference;
  public authoringTime?: string;
  public author?: ResourceReference;
  public description?: string;
  public study: StudyComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.authoringTime) {
        this.authoringTime = obj.authoringTime;
      }
      if (obj.author) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.study) {
        this.study = [];
        for (const o of obj.study || []) {
          this.study.push(new StudyComponent(o));
        }
      }
    }
  }

}

export class ImagingStudy extends DomainResource {
  public resourceType = 'ImagingStudy';
  public uid: string;
  public accession?: Identifier;
  public identifier?: Identifier[];
  public availability?: string;
  public modalityList?: Coding[];
  public patient: ResourceReference;
  public context?: ResourceReference;
  public started?: Date;
  public basedOn?: ResourceReference[];
  public referrer?: ResourceReference;
  public interpreter?: ResourceReference[];
  public endpoint?: ResourceReference[];
  public numberOfSeries?: number;
  public numberOfInstances?: number;
  public procedureReference?: ResourceReference[];
  public procedureCode?: CodeableConcept[];
  public reason?: CodeableConcept;
  public description?: string;
  public series?: SeriesComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.uid) {
        this.uid = obj.uid;
      }
      if (obj.accession) {
        this.accession = new Identifier(obj.accession);
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.availability) {
        this.availability = obj.availability;
      }
      if (obj.modalityList) {
        this.modalityList = [];
        for (const o of obj.modalityList || []) {
          this.modalityList.push(new Coding(o));
        }
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.started) {
        this.started = new Date(obj.started);
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.referrer) {
        this.referrer = new ResourceReference(obj.referrer);
      }
      if (obj.interpreter) {
        this.interpreter = [];
        for (const o of obj.interpreter || []) {
          this.interpreter.push(new ResourceReference(o));
        }
      }
      if (obj.endpoint) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
      if (obj.numberOfSeries) {
        this.numberOfSeries = obj.numberOfSeries;
      }
      if (obj.numberOfInstances) {
        this.numberOfInstances = obj.numberOfInstances;
      }
      if (obj.procedureReference) {
        this.procedureReference = [];
        for (const o of obj.procedureReference || []) {
          this.procedureReference.push(new ResourceReference(o));
        }
      }
      if (obj.procedureCode) {
        this.procedureCode = [];
        for (const o of obj.procedureCode || []) {
          this.procedureCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reason) {
        this.reason = new CodeableConcept(obj.reason);
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.series) {
        this.series = [];
        for (const o of obj.series || []) {
          this.series.push(new SeriesComponent(o));
        }
      }
    }
  }

}

export class PractitionerComponent extends BackboneElement {
  public role?: CodeableConcept;
  public actor: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.role) {
        this.role = new CodeableConcept(obj.role);
      }
      if (obj.actor) {
        this.actor = new ResourceReference(obj.actor);
      }
    }
  }

}

export class ExplanationComponent extends BackboneElement {
  public reason?: CodeableConcept[];
  public reasonNotGiven?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.reason) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonNotGiven) {
        this.reasonNotGiven = [];
        for (const o of obj.reasonNotGiven || []) {
          this.reasonNotGiven.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class VaccinationProtocolComponent extends BackboneElement {
  public doseSequence?: number;
  public description?: string;
  public authority?: ResourceReference;
  public series?: string;
  public seriesDoses?: number;
  public targetDisease: CodeableConcept[];
  public doseStatus: CodeableConcept;
  public doseStatusReason?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.doseSequence) {
        this.doseSequence = obj.doseSequence;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.authority) {
        this.authority = new ResourceReference(obj.authority);
      }
      if (obj.series) {
        this.series = obj.series;
      }
      if (obj.seriesDoses) {
        this.seriesDoses = obj.seriesDoses;
      }
      if (obj.targetDisease) {
        this.targetDisease = [];
        for (const o of obj.targetDisease || []) {
          this.targetDisease.push(new CodeableConcept(o));
        }
      }
      if (obj.doseStatus) {
        this.doseStatus = new CodeableConcept(obj.doseStatus);
      }
      if (obj.doseStatusReason) {
        this.doseStatusReason = new CodeableConcept(obj.doseStatusReason);
      }
    }
  }

}

export class Immunization extends DomainResource {
  public resourceType = 'Immunization';
  public identifier?: Identifier[];
  public status: string;
  public notGiven: boolean;
  public vaccineCode: CodeableConcept;
  public patient: ResourceReference;
  public encounter?: ResourceReference;
  public date?: Date;
  public primarySource: boolean;
  public reportOrigin?: CodeableConcept;
  public location?: ResourceReference;
  public manufacturer?: ResourceReference;
  public lotNumber?: string;
  public expirationDate?: Date;
  public site?: CodeableConcept;
  public route?: CodeableConcept;
  public doseQuantity?: SimpleQuantity;
  public practitioner?: PractitionerComponent[];
  public note?: Annotation[];
  public explanation?: ExplanationComponent;
  public reaction?: ReactionComponent[];
  public vaccinationProtocol?: VaccinationProtocolComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.notGiven) {
        this.notGiven = obj.notGiven;
      }
      if (obj.vaccineCode) {
        this.vaccineCode = new CodeableConcept(obj.vaccineCode);
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.encounter) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.primarySource) {
        this.primarySource = obj.primarySource;
      }
      if (obj.reportOrigin) {
        this.reportOrigin = new CodeableConcept(obj.reportOrigin);
      }
      if (obj.location) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.manufacturer) {
        this.manufacturer = new ResourceReference(obj.manufacturer);
      }
      if (obj.lotNumber) {
        this.lotNumber = obj.lotNumber;
      }
      if (obj.expirationDate) {
        this.expirationDate = new Date(obj.expirationDate);
      }
      if (obj.site) {
        this.site = new CodeableConcept(obj.site);
      }
      if (obj.route) {
        this.route = new CodeableConcept(obj.route);
      }
      if (obj.doseQuantity) {
        this.doseQuantity = new SimpleQuantity(obj.doseQuantity);
      }
      if (obj.practitioner) {
        this.practitioner = [];
        for (const o of obj.practitioner || []) {
          this.practitioner.push(new PractitionerComponent(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.explanation) {
        this.explanation = new ExplanationComponent(obj.explanation);
      }
      if (obj.reaction) {
        this.reaction = [];
        for (const o of obj.reaction || []) {
          this.reaction.push(new ReactionComponent(o));
        }
      }
      if (obj.vaccinationProtocol) {
        this.vaccinationProtocol = [];
        for (const o of obj.vaccinationProtocol || []) {
          this.vaccinationProtocol.push(new VaccinationProtocolComponent(o));
        }
      }
    }
  }

}

export class DateCriterionComponent extends BackboneElement {
  public code: CodeableConcept;
  public value: Date;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.value) {
        this.value = new Date(obj.value);
      }
    }
  }

}

export class ProtocolComponent extends BackboneElement {
  public doseSequence?: number;
  public description?: string;
  public authority?: ResourceReference;
  public series?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.doseSequence) {
        this.doseSequence = obj.doseSequence;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.authority) {
        this.authority = new ResourceReference(obj.authority);
      }
      if (obj.series) {
        this.series = obj.series;
      }
    }
  }

}

export class RecommendationComponent extends BackboneElement {
  public date: Date;
  public vaccineCode?: CodeableConcept;
  public targetDisease?: CodeableConcept;
  public doseNumber?: number;
  public forecastStatus: CodeableConcept;
  public dateCriterion?: DateCriterionComponent[];
  public protocol?: ProtocolComponent;
  public supportingImmunization?: ResourceReference[];
  public supportingPatientInformation?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.vaccineCode) {
        this.vaccineCode = new CodeableConcept(obj.vaccineCode);
      }
      if (obj.targetDisease) {
        this.targetDisease = new CodeableConcept(obj.targetDisease);
      }
      if (obj.doseNumber) {
        this.doseNumber = obj.doseNumber;
      }
      if (obj.forecastStatus) {
        this.forecastStatus = new CodeableConcept(obj.forecastStatus);
      }
      if (obj.dateCriterion) {
        this.dateCriterion = [];
        for (const o of obj.dateCriterion || []) {
          this.dateCriterion.push(new DateCriterionComponent(o));
        }
      }
      if (obj.protocol) {
        this.protocol = new ProtocolComponent(obj.protocol);
      }
      if (obj.supportingImmunization) {
        this.supportingImmunization = [];
        for (const o of obj.supportingImmunization || []) {
          this.supportingImmunization.push(new ResourceReference(o));
        }
      }
      if (obj.supportingPatientInformation) {
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
  public recommendation: RecommendationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.recommendation) {
        this.recommendation = [];
        for (const o of obj.recommendation || []) {
          this.recommendation.push(new RecommendationComponent(o));
        }
      }
    }
  }

}

export class DependencyComponent extends BackboneElement {
  public type: string;
  public uri: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.uri) {
        this.uri = obj.uri;
      }
    }
  }

}

export class PackageComponent extends BackboneElement {
  public name: string;
  public description?: string;
  public resource: PackageResourceComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.resource) {
        this.resource = [];
        for (const o of obj.resource || []) {
          this.resource.push(new PackageResourceComponent(o));
        }
      }
    }
  }

}

export class GlobalComponent extends BackboneElement {
  public type: string;
  public profile: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.profile) {
        this.profile = new ResourceReference(obj.profile);
      }
    }
  }

}

export class PageComponent extends BackboneElement {
  public source: string;
  public title: string;
  public kind: string;
  public type?: string[];
  public package?: string[];
  public format?: string;
  public page?: PageComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.source) {
        this.source = obj.source;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.kind) {
        this.kind = obj.kind;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.package) {
        this.package = obj.package;
      }
      if (obj.format) {
        this.format = obj.format;
      }
      if (obj.page) {
        this.page = [];
        for (const o of obj.page || []) {
          this.page.push(new PageComponent(o));
        }
      }
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

  public getExtension() {
    switch (this.format) {
      case 'html':
      case 'xhtml':
      case 'xml':
        return `.${this.format}`;
      case 'markdown':
      default:
        return `.md`;
    }
  }

  public setTitle(value: string, isRoot = false) {
    this.title = value;

    if (!isRoot && value) {
      this.source = value.toLowerCase().replace(/\s/g, '_').replace(/[()]:/g, '') + '.html';
    } else if (isRoot) {
      this.source = `index.html`;
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

export class ImplementationGuide extends DomainResource implements IImplementationGuide {
  public resourceType = 'ImplementationGuide';
  public url: string;
  public version?: string;
  public name: string;
  public status = 'draft';
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public copyright?: string;
  public fhirVersion? = '3.0.2';
  public dependency?: DependencyComponent[];
  public package?: PackageComponent[];
  public global?: GlobalComponent[];
  public binary?: string[];
  public page?: PageComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.fhirVersion) {
        this.fhirVersion = obj.fhirVersion;
      }
      if (obj.dependency) {
        this.dependency = [];
        for (const o of obj.dependency || []) {
          this.dependency.push(new DependencyComponent(o));
        }
      }
      if (obj.package) {
        this.package = [];
        for (const o of obj.package || []) {
          this.package.push(new PackageComponent(o));
        }
      }
      if (obj.global) {
        this.global = [];
        for (const o of obj.global || []) {
          this.global.push(new GlobalComponent(o));
        }
      }
      if (obj.binary) {
        this.binary = obj.binary;
      }
      if (obj.page) {
        this.page = new PageComponent(obj.page);
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
  public profile?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.use) {
        this.use = obj.use;
      }
      if (obj.min) {
        this.min = obj.min;
      }
      if (obj.max) {
        this.max = obj.max;
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.profile) {
        this.profile = new ResourceReference(obj.profile);
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
  public status: string;
  public experimental?: boolean;
  public type: CodeableConcept;
  public date?: Date;
  public publisher?: string;
  public description?: string;
  public purpose?: string;
  public usage?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public topic?: CodeableConcept[];
  public contributor?: Contributor[];
  public contact?: ContactDetail[];
  public copyright?: string;
  public relatedArtifact?: RelatedArtifact[];
  public parameter?: ParameterDefinition[];
  public dataRequirement?: DataRequirement[];
  public content?: Attachment[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.usage) {
        this.usage = obj.usage;
      }
      if (obj.approvalDate) {
        this.approvalDate = new Date(obj.approvalDate);
      }
      if (obj.lastReviewDate) {
        this.lastReviewDate = new Date(obj.lastReviewDate);
      }
      if (obj.effectivePeriod) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.topic) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.contributor) {
        this.contributor = [];
        for (const o of obj.contributor || []) {
          this.contributor.push(new Contributor(o));
        }
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.relatedArtifact) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.parameter) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new ParameterDefinition(o));
        }
      }
      if (obj.dataRequirement) {
        this.dataRequirement = [];
        for (const o of obj.dataRequirement || []) {
          this.dataRequirement.push(new DataRequirement(o));
        }
      }
      if (obj.content) {
        this.content = [];
        for (const o of obj.content || []) {
          this.content.push(new Attachment(o));
        }
      }
    }
  }

}

export class Linkage extends DomainResource {
  public resourceType = 'Linkage';
  public active?: boolean;
  public author?: ResourceReference;
  public item: ItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.author) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.item) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ItemComponent(o));
        }
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
  public entry?: EntryComponent[];
  public emptyReason?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.encounter) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.source) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.orderedBy) {
        this.orderedBy = new CodeableConcept(obj.orderedBy);
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.entry) {
        this.entry = [];
        for (const o of obj.entry || []) {
          this.entry.push(new EntryComponent(o));
        }
      }
      if (obj.emptyReason) {
        this.emptyReason = new CodeableConcept(obj.emptyReason);
      }
    }
  }

}

export class PositionComponent extends BackboneElement {
  public longitude: number;
  public latitude: number;
  public altitude?: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.longitude) {
        this.longitude = obj.longitude;
      }
      if (obj.latitude) {
        this.latitude = obj.latitude;
      }
      if (obj.altitude) {
        this.altitude = obj.altitude;
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
  public type?: CodeableConcept;
  public telecom?: ContactPoint[];
  public address?: Address;
  public physicalType?: CodeableConcept;
  public position?: PositionComponent;
  public managingOrganization?: ResourceReference;
  public partOf?: ResourceReference;
  public endpoint?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.operationalStatus) {
        this.operationalStatus = new Coding(obj.operationalStatus);
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.alias) {
        this.alias = obj.alias;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.telecom) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.address) {
        this.address = new Address(obj.address);
      }
      if (obj.physicalType) {
        this.physicalType = new CodeableConcept(obj.physicalType);
      }
      if (obj.position) {
        this.position = new PositionComponent(obj.position);
      }
      if (obj.managingOrganization) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.partOf) {
        this.partOf = new ResourceReference(obj.partOf);
      }
      if (obj.endpoint) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class SupplementalDataComponent extends BackboneElement {
  public identifier?: Identifier;
  public usage?: CodeableConcept[];
  public criteria?: string;
  public path?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.usage) {
        this.usage = [];
        for (const o of obj.usage || []) {
          this.usage.push(new CodeableConcept(o));
        }
      }
      if (obj.criteria) {
        this.criteria = obj.criteria;
      }
      if (obj.path) {
        this.path = obj.path;
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
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public description?: string;
  public purpose?: string;
  public usage?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public topic?: CodeableConcept[];
  public contributor?: Contributor[];
  public contact?: ContactDetail[];
  public copyright?: string;
  public relatedArtifact?: RelatedArtifact[];
  public library?: ResourceReference[];
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
  public set?: string;
  public group?: GroupComponent[];
  public supplementalData?: SupplementalDataComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.usage) {
        this.usage = obj.usage;
      }
      if (obj.approvalDate) {
        this.approvalDate = new Date(obj.approvalDate);
      }
      if (obj.lastReviewDate) {
        this.lastReviewDate = new Date(obj.lastReviewDate);
      }
      if (obj.effectivePeriod) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.topic) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.contributor) {
        this.contributor = [];
        for (const o of obj.contributor || []) {
          this.contributor.push(new Contributor(o));
        }
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.relatedArtifact) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.library) {
        this.library = [];
        for (const o of obj.library || []) {
          this.library.push(new ResourceReference(o));
        }
      }
      if (obj.disclaimer) {
        this.disclaimer = obj.disclaimer;
      }
      if (obj.scoring) {
        this.scoring = new CodeableConcept(obj.scoring);
      }
      if (obj.compositeScoring) {
        this.compositeScoring = new CodeableConcept(obj.compositeScoring);
      }
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.riskAdjustment) {
        this.riskAdjustment = obj.riskAdjustment;
      }
      if (obj.rateAggregation) {
        this.rateAggregation = obj.rateAggregation;
      }
      if (obj.rationale) {
        this.rationale = obj.rationale;
      }
      if (obj.clinicalRecommendationStatement) {
        this.clinicalRecommendationStatement = obj.clinicalRecommendationStatement;
      }
      if (obj.improvementNotation) {
        this.improvementNotation = obj.improvementNotation;
      }
      if (obj.definition) {
        this.definition = obj.definition;
      }
      if (obj.guidance) {
        this.guidance = obj.guidance;
      }
      if (obj.set) {
        this.set = obj.set;
      }
      if (obj.group) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new GroupComponent(o));
        }
      }
      if (obj.supplementalData) {
        this.supplementalData = [];
        for (const o of obj.supplementalData || []) {
          this.supplementalData.push(new SupplementalDataComponent(o));
        }
      }
    }
  }

}

export class MeasureReport extends DomainResource {
  public resourceType = 'MeasureReport';
  public identifier?: Identifier;
  public status: string;
  public type: string;
  public measure: ResourceReference;
  public patient?: ResourceReference;
  public date?: Date;
  public reportingOrganization?: ResourceReference;
  public period: Period;
  public group?: GroupComponent[];
  public evaluatedResources?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.measure) {
        this.measure = new ResourceReference(obj.measure);
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.reportingOrganization) {
        this.reportingOrganization = new ResourceReference(obj.reportingOrganization);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.group) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new GroupComponent(o));
        }
      }
      if (obj.evaluatedResources) {
        this.evaluatedResources = new ResourceReference(obj.evaluatedResources);
      }
    }
  }

}

export class Media extends DomainResource {
  public resourceType = 'Media';
  public identifier?: Identifier[];
  public basedOn?: ResourceReference[];
  public type: 'photo'|'video'|'audio';
  public subtype?: CodeableConcept;
  public view?: CodeableConcept;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public operator?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public bodySite?: CodeableConcept;
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
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.subtype) {
        this.subtype = new CodeableConcept(obj.subtype);
      }
      if (obj.view) {
        this.view = new CodeableConcept(obj.view);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.occurrence) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.operator) {
        this.operator = new ResourceReference(obj.operator);
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.bodySite) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
      if (obj.device) {
        this.device = new ResourceReference(obj.device);
      }
      if (obj.height) {
        this.height = obj.height;
      }
      if (obj.width) {
        this.width = obj.width;
      }
      if (obj.frames) {
        this.frames = obj.frames;
      }
      if (obj.duration) {
        this.duration = obj.duration;
      }
      if (obj.content) {
        this.content = new Attachment(obj.content);
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class IngredientComponent extends BackboneElement {
  public item: Element;
  public isActive?: boolean;
  public amount?: Ratio;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.item) {
        this.item = new Element(obj.item);
      }
      if (obj.isActive) {
        this.isActive = obj.isActive;
      }
      if (obj.amount) {
        this.amount = new Ratio(obj.amount);
      }
    }
  }

}

export class Medication extends DomainResource {
  public resourceType = 'Medication';
  public code?: CodeableConcept;
  public status?: string;
  public isBrand?: boolean;
  public isOverTheCounter?: boolean;
  public manufacturer?: ResourceReference;
  public form?: CodeableConcept;
  public ingredient?: IngredientComponent[];
  public package?: PackageComponent;
  public image?: Attachment[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.isBrand) {
        this.isBrand = obj.isBrand;
      }
      if (obj.isOverTheCounter) {
        this.isOverTheCounter = obj.isOverTheCounter;
      }
      if (obj.manufacturer) {
        this.manufacturer = new ResourceReference(obj.manufacturer);
      }
      if (obj.form) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.ingredient) {
        this.ingredient = [];
        for (const o of obj.ingredient || []) {
          this.ingredient.push(new IngredientComponent(o));
        }
      }
      if (obj.package) {
        this.package = new PackageComponent(obj.package);
      }
      if (obj.image) {
        this.image = [];
        for (const o of obj.image || []) {
          this.image.push(new Attachment(o));
        }
      }
    }
  }

}

export class DosageComponent extends BackboneElement {
  public text?: string;
  public site?: CodeableConcept;
  public route?: CodeableConcept;
  public method?: CodeableConcept;
  public dose?: SimpleQuantity;
  public rate?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.text) {
        this.text = obj.text;
      }
      if (obj.site) {
        this.site = new CodeableConcept(obj.site);
      }
      if (obj.route) {
        this.route = new CodeableConcept(obj.route);
      }
      if (obj.method) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.dose) {
        this.dose = new SimpleQuantity(obj.dose);
      }
      if (obj.rate) {
        this.rate = new Element(obj.rate);
      }
    }
  }

}

export class MedicationAdministration extends DomainResource {
  public resourceType = 'MedicationAdministration';
  public identifier?: Identifier[];
  public definition?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status: string;
  public category?: CodeableConcept;
  public medication: Element;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public supportingInformation?: ResourceReference[];
  public effective: Element;
  public performer?: PerformerComponent[];
  public notGiven?: boolean;
  public reasonNotGiven?: CodeableConcept[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public prescription?: ResourceReference;
  public device?: ResourceReference[];
  public note?: Annotation[];
  public dosage?: DosageComponent;
  public eventHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.medication) {
        this.medication = new Element(obj.medication);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.supportingInformation) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
      if (obj.effective) {
        this.effective = new Element(obj.effective);
      }
      if (obj.performer) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new PerformerComponent(o));
        }
      }
      if (obj.notGiven) {
        this.notGiven = obj.notGiven;
      }
      if (obj.reasonNotGiven) {
        this.reasonNotGiven = [];
        for (const o of obj.reasonNotGiven || []) {
          this.reasonNotGiven.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.prescription) {
        this.prescription = new ResourceReference(obj.prescription);
      }
      if (obj.device) {
        this.device = [];
        for (const o of obj.device || []) {
          this.device.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.dosage) {
        this.dosage = new DosageComponent(obj.dosage);
      }
      if (obj.eventHistory) {
        this.eventHistory = [];
        for (const o of obj.eventHistory || []) {
          this.eventHistory.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class SubstitutionComponent extends BackboneElement {
  public wasSubstituted: boolean;
  public type?: CodeableConcept;
  public reason?: CodeableConcept[];
  public responsibleParty?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.wasSubstituted) {
        this.wasSubstituted = obj.wasSubstituted;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.reason) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.responsibleParty) {
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
  public status?: string;
  public category?: CodeableConcept;
  public medication: Element;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public supportingInformation?: ResourceReference[];
  public performer?: PerformerComponent[];
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
  public substitution?: SubstitutionComponent;
  public detectedIssue?: ResourceReference[];
  public notDone?: boolean;
  public notDoneReason?: Element;
  public eventHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.medication) {
        this.medication = new Element(obj.medication);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.supportingInformation) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
      if (obj.performer) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new PerformerComponent(o));
        }
      }
      if (obj.authorizingPrescription) {
        this.authorizingPrescription = [];
        for (const o of obj.authorizingPrescription || []) {
          this.authorizingPrescription.push(new ResourceReference(o));
        }
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.daysSupply) {
        this.daysSupply = new SimpleQuantity(obj.daysSupply);
      }
      if (obj.whenPrepared) {
        this.whenPrepared = new Date(obj.whenPrepared);
      }
      if (obj.whenHandedOver) {
        this.whenHandedOver = new Date(obj.whenHandedOver);
      }
      if (obj.destination) {
        this.destination = new ResourceReference(obj.destination);
      }
      if (obj.receiver) {
        this.receiver = [];
        for (const o of obj.receiver || []) {
          this.receiver.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.dosageInstruction) {
        this.dosageInstruction = [];
        for (const o of obj.dosageInstruction || []) {
          this.dosageInstruction.push(new Dosage(o));
        }
      }
      if (obj.substitution) {
        this.substitution = new SubstitutionComponent(obj.substitution);
      }
      if (obj.detectedIssue) {
        this.detectedIssue = [];
        for (const o of obj.detectedIssue || []) {
          this.detectedIssue.push(new ResourceReference(o));
        }
      }
      if (obj.notDone) {
        this.notDone = obj.notDone;
      }
      if (obj.notDoneReason) {
        this.notDoneReason = new Element(obj.notDoneReason);
      }
      if (obj.eventHistory) {
        this.eventHistory = [];
        for (const o of obj.eventHistory || []) {
          this.eventHistory.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class DispenseRequestComponent extends BackboneElement {
  public validityPeriod?: Period;
  public numberOfRepeatsAllowed?: number;
  public quantity?: SimpleQuantity;
  public expectedSupplyDuration?: Duration;
  public performer?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.validityPeriod) {
        this.validityPeriod = new Period(obj.validityPeriod);
      }
      if (obj.numberOfRepeatsAllowed) {
        this.numberOfRepeatsAllowed = obj.numberOfRepeatsAllowed;
      }
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.expectedSupplyDuration) {
        this.expectedSupplyDuration = new Duration(obj.expectedSupplyDuration);
      }
      if (obj.performer) {
        this.performer = new ResourceReference(obj.performer);
      }
    }
  }

}

export class MedicationRequest extends DomainResource {
  public resourceType = 'MedicationRequest';
  public identifier?: Identifier[];
  public definition?: ResourceReference[];
  public basedOn?: ResourceReference[];
  public groupIdentifier?: Identifier;
  public status?: string;
  public intent: string;
  public category?: CodeableConcept;
  public priority?: string;
  public medication: Element;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public supportingInformation?: ResourceReference[];
  public authoredOn?: Date;
  public requester?: RequesterComponent;
  public recorder?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];
  public dosageInstruction?: Dosage[];
  public dispenseRequest?: DispenseRequestComponent;
  public substitution?: SubstitutionComponent;
  public priorPrescription?: ResourceReference;
  public detectedIssue?: ResourceReference[];
  public eventHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.groupIdentifier) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.intent) {
        this.intent = obj.intent;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
      if (obj.medication) {
        this.medication = new Element(obj.medication);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.supportingInformation) {
        this.supportingInformation = [];
        for (const o of obj.supportingInformation || []) {
          this.supportingInformation.push(new ResourceReference(o));
        }
      }
      if (obj.authoredOn) {
        this.authoredOn = new Date(obj.authoredOn);
      }
      if (obj.requester) {
        this.requester = new RequesterComponent(obj.requester);
      }
      if (obj.recorder) {
        this.recorder = new ResourceReference(obj.recorder);
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.dosageInstruction) {
        this.dosageInstruction = [];
        for (const o of obj.dosageInstruction || []) {
          this.dosageInstruction.push(new Dosage(o));
        }
      }
      if (obj.dispenseRequest) {
        this.dispenseRequest = new DispenseRequestComponent(obj.dispenseRequest);
      }
      if (obj.substitution) {
        this.substitution = new SubstitutionComponent(obj.substitution);
      }
      if (obj.priorPrescription) {
        this.priorPrescription = new ResourceReference(obj.priorPrescription);
      }
      if (obj.detectedIssue) {
        this.detectedIssue = [];
        for (const o of obj.detectedIssue || []) {
          this.detectedIssue.push(new ResourceReference(o));
        }
      }
      if (obj.eventHistory) {
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
  public context?: ResourceReference;
  public status: string;
  public category?: CodeableConcept;
  public medication: Element;
  public effective?: Element;
  public dateAsserted?: Date;
  public informationSource?: ResourceReference;
  public subject: ResourceReference;
  public derivedFrom?: ResourceReference[];
  public taken: string;
  public reasonNotTaken?: CodeableConcept[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public note?: Annotation[];
  public dosage?: Dosage[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.medication) {
        this.medication = new Element(obj.medication);
      }
      if (obj.effective) {
        this.effective = new Element(obj.effective);
      }
      if (obj.dateAsserted) {
        this.dateAsserted = new Date(obj.dateAsserted);
      }
      if (obj.informationSource) {
        this.informationSource = new ResourceReference(obj.informationSource);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.derivedFrom) {
        this.derivedFrom = [];
        for (const o of obj.derivedFrom || []) {
          this.derivedFrom.push(new ResourceReference(o));
        }
      }
      if (obj.taken) {
        this.taken = obj.taken;
      }
      if (obj.reasonNotTaken) {
        this.reasonNotTaken = [];
        for (const o of obj.reasonNotTaken || []) {
          this.reasonNotTaken.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.dosage) {
        this.dosage = [];
        for (const o of obj.dosage || []) {
          this.dosage.push(new Dosage(o));
        }
      }
    }
  }

}

export class FocusComponent extends BackboneElement {
  public code: string;
  public profile?: ResourceReference;
  public min?: number;
  public max?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.profile) {
        this.profile = new ResourceReference(obj.profile);
      }
      if (obj.min) {
        this.min = obj.min;
      }
      if (obj.max) {
        this.max = obj.max;
      }
    }
  }

}

export class AllowedResponseComponent extends BackboneElement {
  public message: ResourceReference;
  public situation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.message) {
        this.message = new ResourceReference(obj.message);
      }
      if (obj.situation) {
        this.situation = obj.situation;
      }
    }
  }

}

export class MessageDefinition extends DomainResource {
  public resourceType = 'MessageDefinition';
  public url?: string;
  public identifier?: Identifier;
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
  public base?: ResourceReference;
  public parent?: ResourceReference[];
  public replaces?: ResourceReference[];
  public event: Coding;
  public category?: string;
  public focus?: FocusComponent[];
  public responseRequired?: boolean;
  public allowedResponse?: AllowedResponseComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.base) {
        this.base = new ResourceReference(obj.base);
      }
      if (obj.parent) {
        this.parent = [];
        for (const o of obj.parent || []) {
          this.parent.push(new ResourceReference(o));
        }
      }
      if (obj.replaces) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.event) {
        this.event = new Coding(obj.event);
      }
      if (obj.category) {
        this.category = obj.category;
      }
      if (obj.focus) {
        this.focus = [];
        for (const o of obj.focus || []) {
          this.focus.push(new FocusComponent(o));
        }
      }
      if (obj.responseRequired) {
        this.responseRequired = obj.responseRequired;
      }
      if (obj.allowedResponse) {
        this.allowedResponse = [];
        for (const o of obj.allowedResponse || []) {
          this.allowedResponse.push(new AllowedResponseComponent(o));
        }
      }
    }
  }

}

export class MessageDestinationComponent extends BackboneElement {
  public name?: string;
  public target?: ResourceReference;
  public endpoint: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.target) {
        this.target = new ResourceReference(obj.target);
      }
      if (obj.endpoint) {
        this.endpoint = obj.endpoint;
      }
    }
  }

}

export class MessageSourceComponent extends BackboneElement {
  public name?: string;
  public software?: string;
  public version?: string;
  public contact?: ContactPoint;
  public endpoint: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.software) {
        this.software = obj.software;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.contact) {
        this.contact = new ContactPoint(obj.contact);
      }
      if (obj.endpoint) {
        this.endpoint = obj.endpoint;
      }
    }
  }

}

export class MessageHeader extends DomainResource {
  public resourceType = 'MessageHeader';
  public event: Coding;
  public destination?: MessageDestinationComponent[];
  public receiver?: ResourceReference;
  public sender?: ResourceReference;
  public timestamp: Date;
  public enterer?: ResourceReference;
  public author?: ResourceReference;
  public source: MessageSourceComponent;
  public responsible?: ResourceReference;
  public reason?: CodeableConcept;
  public response?: ResponseComponent;
  public focus?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.event) {
        this.event = new Coding(obj.event);
      }
      if (obj.destination) {
        this.destination = [];
        for (const o of obj.destination || []) {
          this.destination.push(new MessageDestinationComponent(o));
        }
      }
      if (obj.receiver) {
        this.receiver = new ResourceReference(obj.receiver);
      }
      if (obj.sender) {
        this.sender = new ResourceReference(obj.sender);
      }
      if (obj.timestamp) {
        this.timestamp = new Date(obj.timestamp);
      }
      if (obj.enterer) {
        this.enterer = new ResourceReference(obj.enterer);
      }
      if (obj.author) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.source) {
        this.source = new MessageSourceComponent(obj.source);
      }
      if (obj.responsible) {
        this.responsible = new ResourceReference(obj.responsible);
      }
      if (obj.reason) {
        this.reason = new CodeableConcept(obj.reason);
      }
      if (obj.response) {
        this.response = new ResponseComponent(obj.response);
      }
      if (obj.focus) {
        this.focus = [];
        for (const o of obj.focus || []) {
          this.focus.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class UniqueIdComponent extends BackboneElement {
  public type: string;
  public value: string;
  public preferred?: boolean;
  public comment?: string;
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.value) {
        this.value = obj.value;
      }
      if (obj.preferred) {
        this.preferred = obj.preferred;
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
      if (obj.period) {
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
  public uniqueId: UniqueIdComponent[];
  public replacedBy?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.kind) {
        this.kind = obj.kind;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.responsible) {
        this.responsible = obj.responsible;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.usage) {
        this.usage = obj.usage;
      }
      if (obj.uniqueId) {
        this.uniqueId = [];
        for (const o of obj.uniqueId || []) {
          this.uniqueId.push(new UniqueIdComponent(o));
        }
      }
      if (obj.replacedBy) {
        this.replacedBy = new ResourceReference(obj.replacedBy);
      }
    }
  }

}

export class NutrientComponent extends BackboneElement {
  public modifier?: CodeableConcept;
  public amount?: SimpleQuantity;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.modifier) {
        this.modifier = new CodeableConcept(obj.modifier);
      }
      if (obj.amount) {
        this.amount = new SimpleQuantity(obj.amount);
      }
    }
  }

}

export class TextureComponent extends BackboneElement {
  public modifier?: CodeableConcept;
  public foodType?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.modifier) {
        this.modifier = new CodeableConcept(obj.modifier);
      }
      if (obj.foodType) {
        this.foodType = new CodeableConcept(obj.foodType);
      }
    }
  }

}

export class OralDietComponent extends BackboneElement {
  public type?: CodeableConcept[];
  public schedule?: Timing[];
  public nutrient?: NutrientComponent[];
  public texture?: TextureComponent[];
  public fluidConsistencyType?: CodeableConcept[];
  public instruction?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.schedule) {
        this.schedule = [];
        for (const o of obj.schedule || []) {
          this.schedule.push(new Timing(o));
        }
      }
      if (obj.nutrient) {
        this.nutrient = [];
        for (const o of obj.nutrient || []) {
          this.nutrient.push(new NutrientComponent(o));
        }
      }
      if (obj.texture) {
        this.texture = [];
        for (const o of obj.texture || []) {
          this.texture.push(new TextureComponent(o));
        }
      }
      if (obj.fluidConsistencyType) {
        this.fluidConsistencyType = [];
        for (const o of obj.fluidConsistencyType || []) {
          this.fluidConsistencyType.push(new CodeableConcept(o));
        }
      }
      if (obj.instruction) {
        this.instruction = obj.instruction;
      }
    }
  }

}

export class SupplementComponent extends BackboneElement {
  public type?: CodeableConcept;
  public productName?: string;
  public schedule?: Timing[];
  public quantity?: SimpleQuantity;
  public instruction?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.productName) {
        this.productName = obj.productName;
      }
      if (obj.schedule) {
        this.schedule = [];
        for (const o of obj.schedule || []) {
          this.schedule.push(new Timing(o));
        }
      }
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.instruction) {
        this.instruction = obj.instruction;
      }
    }
  }

}

export class AdministrationComponent extends BackboneElement {
  public schedule?: Timing;
  public quantity?: SimpleQuantity;
  public rate?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.schedule) {
        this.schedule = new Timing(obj.schedule);
      }
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.rate) {
        this.rate = new Element(obj.rate);
      }
    }
  }

}

export class EnteralFormulaComponent extends BackboneElement {
  public baseFormulaType?: CodeableConcept;
  public baseFormulaProductName?: string;
  public additiveType?: CodeableConcept;
  public additiveProductName?: string;
  public caloricDensity?: SimpleQuantity;
  public routeofAdministration?: CodeableConcept;
  public administration?: AdministrationComponent[];
  public maxVolumeToDeliver?: SimpleQuantity;
  public administrationInstruction?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.baseFormulaType) {
        this.baseFormulaType = new CodeableConcept(obj.baseFormulaType);
      }
      if (obj.baseFormulaProductName) {
        this.baseFormulaProductName = obj.baseFormulaProductName;
      }
      if (obj.additiveType) {
        this.additiveType = new CodeableConcept(obj.additiveType);
      }
      if (obj.additiveProductName) {
        this.additiveProductName = obj.additiveProductName;
      }
      if (obj.caloricDensity) {
        this.caloricDensity = new SimpleQuantity(obj.caloricDensity);
      }
      if (obj.routeofAdministration) {
        this.routeofAdministration = new CodeableConcept(obj.routeofAdministration);
      }
      if (obj.administration) {
        this.administration = [];
        for (const o of obj.administration || []) {
          this.administration.push(new AdministrationComponent(o));
        }
      }
      if (obj.maxVolumeToDeliver) {
        this.maxVolumeToDeliver = new SimpleQuantity(obj.maxVolumeToDeliver);
      }
      if (obj.administrationInstruction) {
        this.administrationInstruction = obj.administrationInstruction;
      }
    }
  }

}

export class NutritionOrder extends DomainResource {
  public resourceType = 'NutritionOrder';
  public identifier?: Identifier[];
  public status?: string;
  public patient: ResourceReference;
  public encounter?: ResourceReference;
  public dateTime: Date;
  public orderer?: ResourceReference;
  public allergyIntolerance?: ResourceReference[];
  public foodPreferenceModifier?: CodeableConcept[];
  public excludeFoodModifier?: CodeableConcept[];
  public oralDiet?: OralDietComponent;
  public supplement?: SupplementComponent[];
  public enteralFormula?: EnteralFormulaComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.encounter) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.dateTime) {
        this.dateTime = new Date(obj.dateTime);
      }
      if (obj.orderer) {
        this.orderer = new ResourceReference(obj.orderer);
      }
      if (obj.allergyIntolerance) {
        this.allergyIntolerance = [];
        for (const o of obj.allergyIntolerance || []) {
          this.allergyIntolerance.push(new ResourceReference(o));
        }
      }
      if (obj.foodPreferenceModifier) {
        this.foodPreferenceModifier = [];
        for (const o of obj.foodPreferenceModifier || []) {
          this.foodPreferenceModifier.push(new CodeableConcept(o));
        }
      }
      if (obj.excludeFoodModifier) {
        this.excludeFoodModifier = [];
        for (const o of obj.excludeFoodModifier || []) {
          this.excludeFoodModifier.push(new CodeableConcept(o));
        }
      }
      if (obj.oralDiet) {
        this.oralDiet = new OralDietComponent(obj.oralDiet);
      }
      if (obj.supplement) {
        this.supplement = [];
        for (const o of obj.supplement || []) {
          this.supplement.push(new SupplementComponent(o));
        }
      }
      if (obj.enteralFormula) {
        this.enteralFormula = new EnteralFormulaComponent(obj.enteralFormula);
      }
    }
  }

}

export class OverloadComponent extends BackboneElement {
  public parameterName?: string[];
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.parameterName) {
        this.parameterName = obj.parameterName;
      }
      if (obj.comment) {
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
  public status = 'draft';
  public kind = 'operation';
  public experimental?: boolean;
  public date?: string;
  public publisher?: string;
  public contact?: ContactDetail[];
  public description?: string;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public idempotent?: boolean;
  public code: string;
  public comment?: string;
  public base?: ResourceReference;
  public resource?: string[];
  public system = false;
  public type = false;
  public instance = false;
  public parameter?: ParameterComponent[];
  public overload?: OverloadComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.kind) {
        this.kind = obj.kind;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = obj.date;
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.idempotent) {
        this.idempotent = obj.idempotent;
      }
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
      if (obj.base) {
        this.base = new ResourceReference(obj.base);
      }
      if (obj.resource) {
        this.resource = obj.resource;
      }
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.instance) {
        this.instance = obj.instance;
      }
      if (obj.parameter) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new ParameterComponent(o));
        }
      }
      if (obj.overload) {
        this.overload = [];
        for (const o of obj.overload || []) {
          this.overload.push(new OverloadComponent(o));
        }
      }
    }
  }

}

export class IssueComponent extends BackboneElement {
  public severity: string;
  public code: string;
  public details?: CodeableConcept;
  public diagnostics?: string;
  public location?: string[];
  public expression?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.severity) {
        this.severity = obj.severity;
      }
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.details) {
        this.details = new CodeableConcept(obj.details);
      }
      if (obj.diagnostics) {
        this.diagnostics = obj.diagnostics;
      }
      if (obj.location) {
        this.location = obj.location;
      }
      if (obj.expression) {
        this.expression = obj.expression;
      }
    }
  }

}

export class OperationOutcome extends DomainResource {
  public resourceType = 'OperationOutcome';
  public issue: IssueComponent[];
  public location?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.issue) {
        this.issue = [];
        for (const o of obj.issue || []) {
          this.issue.push(new IssueComponent(o));
        }
      }
      if (obj.location && obj.location.length > 0) {
        this.location = [];
        for (const o of obj.location || []) {
          this.location.push(o);
        }
      }
    }
  }

}

export class ContactComponent extends BackboneElement {
  public purpose?: CodeableConcept;
  public name?: HumanName;
  public telecom?: ContactPoint[];
  public address?: Address;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.purpose) {
        this.purpose = new CodeableConcept(obj.purpose);
      }
      if (obj.name) {
        this.name = new HumanName(obj.name);
      }
      if (obj.telecom) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.address) {
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
  public contact?: ContactComponent[];
  public endpoint?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.type) {
        this.type = [];
        for (const o of obj.type || []) {
          this.type.push(new CodeableConcept(o));
        }
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.alias) {
        this.alias = obj.alias;
      }
      if (obj.telecom) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.address) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.partOf) {
        this.partOf = new ResourceReference(obj.partOf);
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactComponent(o));
        }
      }
      if (obj.endpoint) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class AnimalComponent extends BackboneElement {
  public species: CodeableConcept;
  public breed?: CodeableConcept;
  public genderStatus?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.species) {
        this.species = new CodeableConcept(obj.species);
      }
      if (obj.breed) {
        this.breed = new CodeableConcept(obj.breed);
      }
      if (obj.genderStatus) {
        this.genderStatus = new CodeableConcept(obj.genderStatus);
      }
    }
  }

}

export class CommunicationComponent extends BackboneElement {
  public language: CodeableConcept;
  public preferred?: boolean;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.language) {
        this.language = new CodeableConcept(obj.language);
      }
      if (obj.preferred) {
        this.preferred = obj.preferred;
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
  public contact?: ContactComponent[];
  public animal?: AnimalComponent;
  public communication?: CommunicationComponent[];
  public generalPractitioner?: ResourceReference[];
  public managingOrganization?: ResourceReference;
  public link?: LinkComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.name) {
        this.name = [];
        for (const o of obj.name || []) {
          this.name.push(new HumanName(o));
        }
      }
      if (obj.telecom) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.gender) {
        this.gender = obj.gender;
      }
      if (obj.birthDate) {
        this.birthDate = new Date(obj.birthDate);
      }
      if (obj.deceased) {
        this.deceased = new Element(obj.deceased);
      }
      if (obj.address) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.maritalStatus) {
        this.maritalStatus = new CodeableConcept(obj.maritalStatus);
      }
      if (obj.multipleBirth) {
        this.multipleBirth = new Element(obj.multipleBirth);
      }
      if (obj.photo) {
        this.photo = [];
        for (const o of obj.photo || []) {
          this.photo.push(new Attachment(o));
        }
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactComponent(o));
        }
      }
      if (obj.animal) {
        this.animal = new AnimalComponent(obj.animal);
      }
      if (obj.communication) {
        this.communication = [];
        for (const o of obj.communication || []) {
          this.communication.push(new CommunicationComponent(o));
        }
      }
      if (obj.generalPractitioner) {
        this.generalPractitioner = [];
        for (const o of obj.generalPractitioner || []) {
          this.generalPractitioner.push(new ResourceReference(o));
        }
      }
      if (obj.managingOrganization) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.link) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new LinkComponent(o));
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
  public organization?: ResourceReference;
  public paymentStatus?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.request) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.response) {
        this.response = new ResourceReference(obj.response);
      }
      if (obj.statusDate) {
        this.statusDate = new Date(obj.statusDate);
      }
      if (obj.created) {
        this.created = new Date(obj.created);
      }
      if (obj.target) {
        this.target = new ResourceReference(obj.target);
      }
      if (obj.provider) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.paymentStatus) {
        this.paymentStatus = new CodeableConcept(obj.paymentStatus);
      }
    }
  }

}

export class DetailsComponent extends BackboneElement {
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
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.request) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.response) {
        this.response = new ResourceReference(obj.response);
      }
      if (obj.submitter) {
        this.submitter = new ResourceReference(obj.submitter);
      }
      if (obj.payee) {
        this.payee = new ResourceReference(obj.payee);
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.amount) {
        this.amount = new Money(obj.amount);
      }
    }
  }

}

export class NotesComponent extends BackboneElement {
  public type?: CodeableConcept;
  public text?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.text) {
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
  public outcome?: CodeableConcept;
  public disposition?: string;
  public requestProvider?: ResourceReference;
  public requestOrganization?: ResourceReference;
  public detail?: DetailsComponent[];
  public form?: CodeableConcept;
  public total?: Money;
  public processNote?: NotesComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.created) {
        this.created = new Date(obj.created);
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.request) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.disposition) {
        this.disposition = obj.disposition;
      }
      if (obj.requestProvider) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
      if (obj.requestOrganization) {
        this.requestOrganization = new ResourceReference(obj.requestOrganization);
      }
      if (obj.detail) {
        this.detail = [];
        for (const o of obj.detail || []) {
          this.detail.push(new DetailsComponent(o));
        }
      }
      if (obj.form) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.total) {
        this.total = new Money(obj.total);
      }
      if (obj.processNote) {
        this.processNote = [];
        for (const o of obj.processNote || []) {
          this.processNote.push(new NotesComponent(o));
        }
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
  public link?: LinkComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.name) {
        this.name = [];
        for (const o of obj.name || []) {
          this.name.push(new HumanName(o));
        }
      }
      if (obj.telecom) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.gender) {
        this.gender = obj.gender;
      }
      if (obj.birthDate) {
        this.birthDate = new Date(obj.birthDate);
      }
      if (obj.address) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.photo) {
        this.photo = new Attachment(obj.photo);
      }
      if (obj.managingOrganization) {
        this.managingOrganization = new ResourceReference(obj.managingOrganization);
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.link) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new LinkComponent(o));
        }
      }
    }
  }

  getDisplayName(): string {
    if (this.name && this.name.length > 0) {
      return this.name[0].getDisplay();
    }

    return 'Unspecified Name';
  }
}

export class GoalComponent extends BackboneElement {
  public category?: CodeableConcept;
  public description: CodeableConcept;
  public priority?: CodeableConcept;
  public start?: CodeableConcept;
  public addresses?: CodeableConcept[];
  public documentation?: RelatedArtifact[];
  public target?: TargetComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.description) {
        this.description = new CodeableConcept(obj.description);
      }
      if (obj.priority) {
        this.priority = new CodeableConcept(obj.priority);
      }
      if (obj.start) {
        this.start = new CodeableConcept(obj.start);
      }
      if (obj.addresses) {
        this.addresses = [];
        for (const o of obj.addresses || []) {
          this.addresses.push(new CodeableConcept(o));
        }
      }
      if (obj.documentation) {
        this.documentation = [];
        for (const o of obj.documentation || []) {
          this.documentation.push(new RelatedArtifact(o));
        }
      }
      if (obj.target) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new TargetComponent(o));
        }
      }
    }
  }

}

export class TriggerDefinition extends Element {
  public type: string;
  public eventName?: string;
  public eventTiming?: Element;
  public eventData?: DataRequirement;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.eventName) {
        this.eventName = obj.eventName;
      }
      if (obj.eventTiming) {
        this.eventTiming = new Element(obj.eventTiming);
      }
      if (obj.eventData) {
        this.eventData = new DataRequirement(obj.eventData);
      }
    }
  }

}

export class RelatedActionComponent extends BackboneElement {
  public actionId: string;
  public relationship: string;
  public offset?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.actionId) {
        this.actionId = obj.actionId;
      }
      if (obj.relationship) {
        this.relationship = obj.relationship;
      }
      if (obj.offset) {
        this.offset = new Element(obj.offset);
      }
    }
  }

}

export class ActionComponent extends BackboneElement {
  public label?: string;
  public title?: string;
  public description?: string;
  public textEquivalent?: string;
  public code?: CodeableConcept[];
  public reason?: CodeableConcept[];
  public documentation?: RelatedArtifact[];
  public goalId?: string[];
  public triggerDefinition?: TriggerDefinition[];
  public condition?: ConditionComponent[];
  public input?: DataRequirement[];
  public output?: DataRequirement[];
  public relatedAction?: RelatedActionComponent[];
  public timing?: Element;
  public participant?: ParticipantComponent[];
  public type?: Coding;
  public groupingBehavior?: string;
  public selectionBehavior?: string;
  public requiredBehavior?: string;
  public precheckBehavior?: string;
  public cardinalityBehavior?: string;
  public definition?: ResourceReference;
  public transform?: ResourceReference;
  public dynamicValue?: DynamicValueComponent[];
  public action?: ActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.label) {
        this.label = obj.label;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.textEquivalent) {
        this.textEquivalent = obj.textEquivalent;
      }
      if (obj.code) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.reason) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new CodeableConcept(o));
        }
      }
      if (obj.documentation) {
        this.documentation = [];
        for (const o of obj.documentation || []) {
          this.documentation.push(new RelatedArtifact(o));
        }
      }
      if (obj.goalId) {
        this.goalId = obj.goalId;
      }
      if (obj.triggerDefinition) {
        this.triggerDefinition = [];
        for (const o of obj.triggerDefinition || []) {
          this.triggerDefinition.push(new TriggerDefinition(o));
        }
      }
      if (obj.condition) {
        this.condition = [];
        for (const o of obj.condition || []) {
          this.condition.push(new ConditionComponent(o));
        }
      }
      if (obj.input) {
        this.input = [];
        for (const o of obj.input || []) {
          this.input.push(new DataRequirement(o));
        }
      }
      if (obj.output) {
        this.output = [];
        for (const o of obj.output || []) {
          this.output.push(new DataRequirement(o));
        }
      }
      if (obj.relatedAction) {
        this.relatedAction = [];
        for (const o of obj.relatedAction || []) {
          this.relatedAction.push(new RelatedActionComponent(o));
        }
      }
      if (obj.timing) {
        this.timing = new Element(obj.timing);
      }
      if (obj.participant) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new ParticipantComponent(o));
        }
      }
      if (obj.type) {
        this.type = new Coding(obj.type);
      }
      if (obj.groupingBehavior) {
        this.groupingBehavior = obj.groupingBehavior;
      }
      if (obj.selectionBehavior) {
        this.selectionBehavior = obj.selectionBehavior;
      }
      if (obj.requiredBehavior) {
        this.requiredBehavior = obj.requiredBehavior;
      }
      if (obj.precheckBehavior) {
        this.precheckBehavior = obj.precheckBehavior;
      }
      if (obj.cardinalityBehavior) {
        this.cardinalityBehavior = obj.cardinalityBehavior;
      }
      if (obj.definition) {
        this.definition = new ResourceReference(obj.definition);
      }
      if (obj.transform) {
        this.transform = new ResourceReference(obj.transform);
      }
      if (obj.dynamicValue) {
        this.dynamicValue = [];
        for (const o of obj.dynamicValue || []) {
          this.dynamicValue.push(new DynamicValueComponent(o));
        }
      }
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new ActionComponent(o));
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
  public type?: CodeableConcept;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public description?: string;
  public purpose?: string;
  public usage?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public topic?: CodeableConcept[];
  public contributor?: Contributor[];
  public contact?: ContactDetail[];
  public copyright?: string;
  public relatedArtifact?: RelatedArtifact[];
  public library?: ResourceReference[];
  public goal?: GoalComponent[];
  public action?: ActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.usage) {
        this.usage = obj.usage;
      }
      if (obj.approvalDate) {
        this.approvalDate = new Date(obj.approvalDate);
      }
      if (obj.lastReviewDate) {
        this.lastReviewDate = new Date(obj.lastReviewDate);
      }
      if (obj.effectivePeriod) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.topic) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.contributor) {
        this.contributor = [];
        for (const o of obj.contributor || []) {
          this.contributor.push(new Contributor(o));
        }
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.relatedArtifact) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.library) {
        this.library = [];
        for (const o of obj.library || []) {
          this.library.push(new ResourceReference(o));
        }
      }
      if (obj.goal) {
        this.goal = [];
        for (const o of obj.goal || []) {
          this.goal.push(new GoalComponent(o));
        }
      }
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new ActionComponent(o));
        }
      }
    }
  }

}

export class QualificationComponent extends BackboneElement {
  public identifier?: Identifier[];
  public code: CodeableConcept;
  public period?: Period;
  public issuer?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.issuer) {
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
  public qualification?: QualificationComponent[];
  public communication?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.name) {
        this.name = [];
        for (const o of obj.name || []) {
          this.name.push(new HumanName(o));
        }
      }
      if (obj.telecom) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.address) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.gender) {
        this.gender = obj.gender;
      }
      if (obj.birthDate) {
        this.birthDate = new Date(obj.birthDate);
      }
      if (obj.photo) {
        this.photo = [];
        for (const o of obj.photo || []) {
          this.photo.push(new Attachment(o));
        }
      }
      if (obj.qualification) {
        this.qualification = [];
        for (const o of obj.qualification || []) {
          this.qualification.push(new QualificationComponent(o));
        }
      }
      if (obj.communication) {
        this.communication = [];
        for (const o of obj.communication || []) {
          this.communication.push(new CodeableConcept(o));
        }
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
  public availableTime?: AvailableTimeComponent[];
  public notAvailable?: NotAvailableComponent[];
  public availabilityExceptions?: string;
  public endpoint?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.practitioner) {
        this.practitioner = new ResourceReference(obj.practitioner);
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.code) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new CodeableConcept(o));
        }
      }
      if (obj.specialty) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.location) {
        this.location = [];
        for (const o of obj.location || []) {
          this.location.push(new ResourceReference(o));
        }
      }
      if (obj.healthcareService) {
        this.healthcareService = [];
        for (const o of obj.healthcareService || []) {
          this.healthcareService.push(new ResourceReference(o));
        }
      }
      if (obj.telecom) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.availableTime) {
        this.availableTime = [];
        for (const o of obj.availableTime || []) {
          this.availableTime.push(new AvailableTimeComponent(o));
        }
      }
      if (obj.notAvailable) {
        this.notAvailable = [];
        for (const o of obj.notAvailable || []) {
          this.notAvailable.push(new NotAvailableComponent(o));
        }
      }
      if (obj.availabilityExceptions) {
        this.availabilityExceptions = obj.availabilityExceptions;
      }
      if (obj.endpoint) {
        this.endpoint = [];
        for (const o of obj.endpoint || []) {
          this.endpoint.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class FocalDeviceComponent extends BackboneElement {
  public action?: CodeableConcept;
  public manipulated: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.action) {
        this.action = new CodeableConcept(obj.action);
      }
      if (obj.manipulated) {
        this.manipulated = new ResourceReference(obj.manipulated);
      }
    }
  }

}

export class Procedure extends DomainResource {
  public resourceType = 'Procedure';
  public identifier?: Identifier[];
  public definition?: ResourceReference[];
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status: string;
  public notDone?: boolean;
  public notDoneReason?: CodeableConcept;
  public category?: CodeableConcept;
  public code?: CodeableConcept;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public performed?: Element;
  public performer?: PerformerComponent[];
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
  public focalDevice?: FocalDeviceComponent[];
  public usedReference?: ResourceReference[];
  public usedCode?: CodeableConcept[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.notDone) {
        this.notDone = obj.notDone;
      }
      if (obj.notDoneReason) {
        this.notDoneReason = new CodeableConcept(obj.notDoneReason);
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.performed) {
        this.performed = new Element(obj.performed);
      }
      if (obj.performer) {
        this.performer = [];
        for (const o of obj.performer || []) {
          this.performer.push(new PerformerComponent(o));
        }
      }
      if (obj.location) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.bodySite) {
        this.bodySite = [];
        for (const o of obj.bodySite || []) {
          this.bodySite.push(new CodeableConcept(o));
        }
      }
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.report) {
        this.report = [];
        for (const o of obj.report || []) {
          this.report.push(new ResourceReference(o));
        }
      }
      if (obj.complication) {
        this.complication = [];
        for (const o of obj.complication || []) {
          this.complication.push(new CodeableConcept(o));
        }
      }
      if (obj.complicationDetail) {
        this.complicationDetail = [];
        for (const o of obj.complicationDetail || []) {
          this.complicationDetail.push(new ResourceReference(o));
        }
      }
      if (obj.followUp) {
        this.followUp = [];
        for (const o of obj.followUp || []) {
          this.followUp.push(new CodeableConcept(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.focalDevice) {
        this.focalDevice = [];
        for (const o of obj.focalDevice || []) {
          this.focalDevice.push(new FocalDeviceComponent(o));
        }
      }
      if (obj.usedReference) {
        this.usedReference = [];
        for (const o of obj.usedReference || []) {
          this.usedReference.push(new ResourceReference(o));
        }
      }
      if (obj.usedCode) {
        this.usedCode = [];
        for (const o of obj.usedCode || []) {
          this.usedCode.push(new CodeableConcept(o));
        }
      }
    }
  }

}

export class ProcedureRequest extends DomainResource {
  public resourceType = 'ProcedureRequest';
  public identifier?: Identifier[];
  public definition?: ResourceReference[];
  public basedOn?: ResourceReference[];
  public replaces?: ResourceReference[];
  public requisition?: Identifier;
  public status: string;
  public intent: string;
  public priority?: string;
  public doNotPerform?: boolean;
  public category?: CodeableConcept[];
  public code: CodeableConcept;
  public subject: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public asNeeded?: Element;
  public authoredOn?: Date;
  public requester?: RequesterComponent;
  public performerType?: CodeableConcept;
  public performer?: ResourceReference;
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public supportingInfo?: ResourceReference[];
  public specimen?: ResourceReference[];
  public bodySite?: CodeableConcept[];
  public note?: Annotation[];
  public relevantHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.replaces) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.requisition) {
        this.requisition = new Identifier(obj.requisition);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.intent) {
        this.intent = obj.intent;
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
      if (obj.doNotPerform) {
        this.doNotPerform = obj.doNotPerform;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.occurrence) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.asNeeded) {
        this.asNeeded = new Element(obj.asNeeded);
      }
      if (obj.authoredOn) {
        this.authoredOn = new Date(obj.authoredOn);
      }
      if (obj.requester) {
        this.requester = new RequesterComponent(obj.requester);
      }
      if (obj.performerType) {
        this.performerType = new CodeableConcept(obj.performerType);
      }
      if (obj.performer) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.supportingInfo) {
        this.supportingInfo = [];
        for (const o of obj.supportingInfo || []) {
          this.supportingInfo.push(new ResourceReference(o));
        }
      }
      if (obj.specimen) {
        this.specimen = [];
        for (const o of obj.specimen || []) {
          this.specimen.push(new ResourceReference(o));
        }
      }
      if (obj.bodySite) {
        this.bodySite = [];
        for (const o of obj.bodySite || []) {
          this.bodySite.push(new CodeableConcept(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.relevantHistory) {
        this.relevantHistory = [];
        for (const o of obj.relevantHistory || []) {
          this.relevantHistory.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class ItemsComponent extends BackboneElement {
  public sequenceLinkId: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.sequenceLinkId) {
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
  public organization?: ResourceReference;
  public request?: ResourceReference;
  public response?: ResourceReference;
  public nullify?: boolean;
  public reference?: string;
  public item?: ItemsComponent[];
  public include?: string[];
  public exclude?: string[];
  public period?: Period;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.action) {
        this.action = obj.action;
      }
      if (obj.target) {
        this.target = new ResourceReference(obj.target);
      }
      if (obj.created) {
        this.created = new Date(obj.created);
      }
      if (obj.provider) {
        this.provider = new ResourceReference(obj.provider);
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.request) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.response) {
        this.response = new ResourceReference(obj.response);
      }
      if (obj.nullify) {
        this.nullify = obj.nullify;
      }
      if (obj.reference) {
        this.reference = obj.reference;
      }
      if (obj.item) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ItemsComponent(o));
        }
      }
      if (obj.include) {
        this.include = obj.include;
      }
      if (obj.exclude) {
        this.exclude = obj.exclude;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class ProcessNoteComponent extends BackboneElement {
  public type?: CodeableConcept;
  public text?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.text) {
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
  public outcome?: CodeableConcept;
  public disposition?: string;
  public requestProvider?: ResourceReference;
  public requestOrganization?: ResourceReference;
  public form?: CodeableConcept;
  public processNote?: ProcessNoteComponent[];
  public error?: CodeableConcept[];
  public communicationRequest?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.created) {
        this.created = new Date(obj.created);
      }
      if (obj.organization) {
        this.organization = new ResourceReference(obj.organization);
      }
      if (obj.request) {
        this.request = new ResourceReference(obj.request);
      }
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.disposition) {
        this.disposition = obj.disposition;
      }
      if (obj.requestProvider) {
        this.requestProvider = new ResourceReference(obj.requestProvider);
      }
      if (obj.requestOrganization) {
        this.requestOrganization = new ResourceReference(obj.requestOrganization);
      }
      if (obj.form) {
        this.form = new CodeableConcept(obj.form);
      }
      if (obj.processNote) {
        this.processNote = [];
        for (const o of obj.processNote || []) {
          this.processNote.push(new ProcessNoteComponent(o));
        }
      }
      if (obj.error) {
        this.error = [];
        for (const o of obj.error || []) {
          this.error.push(new CodeableConcept(o));
        }
      }
      if (obj.communicationRequest) {
        this.communicationRequest = [];
        for (const o of obj.communicationRequest || []) {
          this.communicationRequest.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class Provenance extends DomainResource {
  public resourceType = 'Provenance';
  public target: ResourceReference[];
  public period?: Period;
  public recorded: Date;
  public policy?: string[];
  public location?: ResourceReference;
  public reason?: Coding[];
  public activity?: Coding;
  public agent: AgentComponent[];
  public entity?: EntityComponent[];
  public signature?: Signature[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.target) {
        this.target = [];
        for (const o of obj.target || []) {
          this.target.push(new ResourceReference(o));
        }
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.recorded) {
        this.recorded = new Date(obj.recorded);
      }
      if (obj.policy) {
        this.policy = obj.policy;
      }
      if (obj.location) {
        this.location = new ResourceReference(obj.location);
      }
      if (obj.reason) {
        this.reason = [];
        for (const o of obj.reason || []) {
          this.reason.push(new Coding(o));
        }
      }
      if (obj.activity) {
        this.activity = new Coding(obj.activity);
      }
      if (obj.agent) {
        this.agent = [];
        for (const o of obj.agent || []) {
          this.agent.push(new AgentComponent(o));
        }
      }
      if (obj.entity) {
        this.entity = [];
        for (const o of obj.entity || []) {
          this.entity.push(new EntityComponent(o));
        }
      }
      if (obj.signature) {
        this.signature = [];
        for (const o of obj.signature || []) {
          this.signature.push(new Signature(o));
        }
      }
    }
  }

}

export class QuestionnaireItemEnableWhenComponent extends BackboneElement {
  public question: string;
  public hasAnswer?: boolean;
  public answerBoolean?: boolean;
  public answerDecimal?: number;
  public answerInteger?: number;
  public answerDate?: string;
  public answerDateTime?: string;
  public answerTime?: string;
  public answerUri?: string;
  public answerString?: string;
  public answerAttachment?: Attachment;
  public answerCoding?: Coding;
  public answerQuantity?: Quantity;
  public answerReference?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    Object.assign(this, obj);

    if (obj) {
      if (obj.question) {
        this.question = obj.question;
      }
      if (obj.hasOwnProperty('hasAnswer')) {
        this.hasAnswer = obj.hasAnswer;
      }
      if (obj.hasOwnProperty('answerBoolean')) {
        this.answerBoolean = obj.answerBoolean;
      }
      if (obj.hasOwnProperty('answerDecimal')) {
        this.answerDecimal = obj.answerDecimal;
      }
      if (obj.hasOwnProperty('answerInteger')) {
        this.answerInteger = obj.answerInteger;
      }
      if (obj.answerDate) {
        this.answerDate = obj.answerDate;
      }
      if (obj.answerDateTime) {
        this.answerDateTime = obj.answerDateTime;
      }
      if (obj.answerTime) {
        this.answerTime = obj.answerTime;
      }
      if (obj.answerUri) {
        this.answerUri = obj.answerUri;
      }
      if (obj.answerString) {
        this.answerString = obj.answerString;
      }
      if (obj.answerAttachment) {
        this.answerAttachment = new Attachment(obj.answerAttachment);
      }
      if (obj.answerCoding) {
        this.answerCoding = new Coding(obj.answerCoding);
      }
      if (obj.answerQuantity) {
        this.answerQuantity = new Quantity(obj.answerQuantity);
      }
      if (obj.answerReference) {
        this.answerReference = new ResourceReference(obj.answerReference);
      }
    }
  }
}

export class QuestionnaireItemOptionComponent extends BackboneElement {
  public valueInteger?: number;
  public valueDate?: string;
  public valueTime?: string;
  public valueString?: string;
  public valueCoding?: Coding;
}

export class QuestionnaireItemComponent extends BackboneElement {
  public linkId: string;
  public definition?: string;
  public code?: Coding[];
  public prefix?: string;
  public text?: string;
  public type?: string;
  public enableWhen?: QuestionnaireItemEnableWhenComponent[];
  public item?: QuestionnaireItemComponent[];
  public maxLength?: number;
  public options?: ResourceReference;
  public option?: QuestionnaireItemOptionComponent[];

  constructor(obj?: any) {
    super(obj);

    if (obj) {
      if (obj.linkId) {
        this.linkId = obj.linkId;
      }
      if (obj.definition) {
        this.definition = obj.definition;
      }
      if (obj.code) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new Coding(o));
        }
      }
      if (obj.prefix) {
        this.prefix = obj.prefix;
      }
      if (obj.text) {
        this.text = obj.text;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.hasOwnProperty('maxLength')) {
        this.maxLength = obj.maxLength;
      }
      if (obj.hasOwnProperty('options')) {
        this.options = new ResourceReference(obj.options);
      }
      if (obj.hasOwnProperty('option')) {
        this.option = [];
        for (const o of obj.option || []) {
          this.option.push(new QuestionnaireItemOptionComponent(o));
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
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public description?: string;
  public purpose?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public contact?: ContactDetail[];
  public copyright?: string;
  public code?: Coding[];
  public subjectType?: string[];
  public item?: QuestionnaireItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.approvalDate) {
        this.approvalDate = new Date(obj.approvalDate);
      }
      if (obj.lastReviewDate) {
        this.lastReviewDate = new Date(obj.lastReviewDate);
      }
      if (obj.effectivePeriod) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.code) {
        this.code = [];
        for (const o of obj.code || []) {
          this.code.push(new Coding(o));
        }
      }
      if (obj.subjectType) {
        this.subjectType = obj.subjectType;
      }
      if (obj.item) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new QuestionnaireItemComponent(o));
        }
      }
    }
  }

}

export class QuestionnaireResponse extends DomainResource {
  public resourceType = 'QuestionnaireResponse';
  public identifier?: Identifier;
  public basedOn?: ResourceReference[];
  public parent?: ResourceReference[];
  public questionnaire?: ResourceReference;
  public status: string;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public authored?: Date;
  public author?: ResourceReference;
  public source?: ResourceReference;
  public item?: ItemComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.parent) {
        this.parent = [];
        for (const o of obj.parent || []) {
          this.parent.push(new ResourceReference(o));
        }
      }
      if (obj.questionnaire) {
        this.questionnaire = new ResourceReference(obj.questionnaire);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.authored) {
        this.authored = new Date(obj.authored);
      }
      if (obj.author) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.source) {
        this.source = new ResourceReference(obj.source);
      }
      if (obj.item) {
        this.item = [];
        for (const o of obj.item || []) {
          this.item.push(new ItemComponent(o));
        }
      }
    }
  }

}

export class ReferralRequest extends DomainResource {
  public resourceType = 'ReferralRequest';
  public identifier?: Identifier[];
  public definition?: ResourceReference[];
  public basedOn?: ResourceReference[];
  public replaces?: ResourceReference[];
  public groupIdentifier?: Identifier;
  public status: string;
  public intent: string;
  public type?: CodeableConcept;
  public priority?: string;
  public serviceRequested?: CodeableConcept[];
  public subject: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public authoredOn?: Date;
  public requester?: RequesterComponent;
  public specialty?: CodeableConcept;
  public recipient?: ResourceReference[];
  public reasonCode?: CodeableConcept[];
  public reasonReference?: ResourceReference[];
  public description?: string;
  public supportingInfo?: ResourceReference[];
  public note?: Annotation[];
  public relevantHistory?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.replaces) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.groupIdentifier) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.intent) {
        this.intent = obj.intent;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
      if (obj.serviceRequested) {
        this.serviceRequested = [];
        for (const o of obj.serviceRequested || []) {
          this.serviceRequested.push(new CodeableConcept(o));
        }
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.occurrence) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.authoredOn) {
        this.authoredOn = new Date(obj.authoredOn);
      }
      if (obj.requester) {
        this.requester = new RequesterComponent(obj.requester);
      }
      if (obj.specialty) {
        this.specialty = new CodeableConcept(obj.specialty);
      }
      if (obj.recipient) {
        this.recipient = [];
        for (const o of obj.recipient || []) {
          this.recipient.push(new ResourceReference(o));
        }
      }
      if (obj.reasonCode) {
        this.reasonCode = [];
        for (const o of obj.reasonCode || []) {
          this.reasonCode.push(new CodeableConcept(o));
        }
      }
      if (obj.reasonReference) {
        this.reasonReference = [];
        for (const o of obj.reasonReference || []) {
          this.reasonReference.push(new ResourceReference(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.supportingInfo) {
        this.supportingInfo = [];
        for (const o of obj.supportingInfo || []) {
          this.supportingInfo.push(new ResourceReference(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.relevantHistory) {
        this.relevantHistory = [];
        for (const o of obj.relevantHistory || []) {
          this.relevantHistory.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class RelatedPerson extends DomainResource {
  public resourceType = 'RelatedPerson';
  public identifier?: Identifier[];
  public active?: boolean;
  public patient: ResourceReference;
  public relationship?: CodeableConcept;
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
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.relationship) {
        this.relationship = new CodeableConcept(obj.relationship);
      }
      if (obj.name) {
        this.name = [];
        for (const o of obj.name || []) {
          this.name.push(new HumanName(o));
        }
      }
      if (obj.telecom) {
        this.telecom = [];
        for (const o of obj.telecom || []) {
          this.telecom.push(new ContactPoint(o));
        }
      }
      if (obj.gender) {
        this.gender = obj.gender;
      }
      if (obj.birthDate) {
        this.birthDate = new Date(obj.birthDate);
      }
      if (obj.address) {
        this.address = [];
        for (const o of obj.address || []) {
          this.address.push(new Address(o));
        }
      }
      if (obj.photo) {
        this.photo = [];
        for (const o of obj.photo || []) {
          this.photo.push(new Attachment(o));
        }
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
    }
  }

}

export class RequestGroup extends DomainResource {
  public resourceType = 'RequestGroup';
  public identifier?: Identifier[];
  public definition?: ResourceReference[];
  public basedOn?: ResourceReference[];
  public replaces?: ResourceReference[];
  public groupIdentifier?: Identifier;
  public status: string;
  public intent: string;
  public priority?: string;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public authoredOn?: Date;
  public author?: ResourceReference;
  public reason?: Element;
  public note?: Annotation[];
  public action?: ActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = [];
        for (const o of obj.definition || []) {
          this.definition.push(new ResourceReference(o));
        }
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.replaces) {
        this.replaces = [];
        for (const o of obj.replaces || []) {
          this.replaces.push(new ResourceReference(o));
        }
      }
      if (obj.groupIdentifier) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.intent) {
        this.intent = obj.intent;
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.authoredOn) {
        this.authoredOn = new Date(obj.authoredOn);
      }
      if (obj.author) {
        this.author = new ResourceReference(obj.author);
      }
      if (obj.reason) {
        this.reason = new Element(obj.reason);
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new ActionComponent(o));
        }
      }
    }
  }

}

export class ArmComponent extends BackboneElement {
  public name: string;
  public code?: CodeableConcept;
  public description?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.description) {
        this.description = obj.description;
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
  public category?: CodeableConcept[];
  public focus?: CodeableConcept[];
  public contact?: ContactDetail[];
  public relatedArtifact?: RelatedArtifact[];
  public keyword?: CodeableConcept[];
  public jurisdiction?: CodeableConcept[];
  public description?: string;
  public enrollment?: ResourceReference[];
  public period?: Period;
  public sponsor?: ResourceReference;
  public principalInvestigator?: ResourceReference;
  public site?: ResourceReference[];
  public reasonStopped?: CodeableConcept;
  public note?: Annotation[];
  public arm?: ArmComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.protocol) {
        this.protocol = [];
        for (const o of obj.protocol || []) {
          this.protocol.push(new ResourceReference(o));
        }
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.focus) {
        this.focus = [];
        for (const o of obj.focus || []) {
          this.focus.push(new CodeableConcept(o));
        }
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.relatedArtifact) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.keyword) {
        this.keyword = [];
        for (const o of obj.keyword || []) {
          this.keyword.push(new CodeableConcept(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.enrollment) {
        this.enrollment = [];
        for (const o of obj.enrollment || []) {
          this.enrollment.push(new ResourceReference(o));
        }
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.sponsor) {
        this.sponsor = new ResourceReference(obj.sponsor);
      }
      if (obj.principalInvestigator) {
        this.principalInvestigator = new ResourceReference(obj.principalInvestigator);
      }
      if (obj.site) {
        this.site = [];
        for (const o of obj.site || []) {
          this.site.push(new ResourceReference(o));
        }
      }
      if (obj.reasonStopped) {
        this.reasonStopped = new CodeableConcept(obj.reasonStopped);
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.arm) {
        this.arm = [];
        for (const o of obj.arm || []) {
          this.arm.push(new ArmComponent(o));
        }
      }
    }
  }

}

export class ResearchSubject extends DomainResource {
  public resourceType = 'ResearchSubject';
  public identifier?: Identifier;
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
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.study) {
        this.study = new ResourceReference(obj.study);
      }
      if (obj.individual) {
        this.individual = new ResourceReference(obj.individual);
      }
      if (obj.assignedArm) {
        this.assignedArm = obj.assignedArm;
      }
      if (obj.actualArm) {
        this.actualArm = obj.actualArm;
      }
      if (obj.consent) {
        this.consent = new ResourceReference(obj.consent);
      }
    }
  }

}

export class PredictionComponent extends BackboneElement {
  public outcome: CodeableConcept;
  public probability?: Element;
  public qualitativeRisk?: CodeableConcept;
  public relativeRisk?: number;
  public when?: Element;
  public rationale?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.outcome) {
        this.outcome = new CodeableConcept(obj.outcome);
      }
      if (obj.probability) {
        this.probability = new Element(obj.probability);
      }
      if (obj.qualitativeRisk) {
        this.qualitativeRisk = new CodeableConcept(obj.qualitativeRisk);
      }
      if (obj.relativeRisk) {
        this.relativeRisk = obj.relativeRisk;
      }
      if (obj.when) {
        this.when = new Element(obj.when);
      }
      if (obj.rationale) {
        this.rationale = obj.rationale;
      }
    }
  }

}

export class RiskAssessment extends DomainResource {
  public resourceType = 'RiskAssessment';
  public identifier?: Identifier;
  public basedOn?: ResourceReference;
  public parent?: ResourceReference;
  public status: string;
  public method?: CodeableConcept;
  public code?: CodeableConcept;
  public subject?: ResourceReference;
  public context?: ResourceReference;
  public occurrence?: Element;
  public condition?: ResourceReference;
  public performer?: ResourceReference;
  public reason?: Element;
  public basis?: ResourceReference[];
  public prediction?: PredictionComponent[];
  public mitigation?: string;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.basedOn) {
        this.basedOn = new ResourceReference(obj.basedOn);
      }
      if (obj.parent) {
        this.parent = new ResourceReference(obj.parent);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.method) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.occurrence) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.condition) {
        this.condition = new ResourceReference(obj.condition);
      }
      if (obj.performer) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.reason) {
        this.reason = new Element(obj.reason);
      }
      if (obj.basis) {
        this.basis = [];
        for (const o of obj.basis || []) {
          this.basis.push(new ResourceReference(o));
        }
      }
      if (obj.prediction) {
        this.prediction = [];
        for (const o of obj.prediction || []) {
          this.prediction.push(new PredictionComponent(o));
        }
      }
      if (obj.mitigation) {
        this.mitigation = obj.mitigation;
      }
      if (obj.comment) {
        this.comment = obj.comment;
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
  public data: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.origin) {
        this.origin = new Quantity(obj.origin);
      }
      if (obj.period) {
        this.period = obj.period;
      }
      if (obj.factor) {
        this.factor = obj.factor;
      }
      if (obj.lowerLimit) {
        this.lowerLimit = obj.lowerLimit;
      }
      if (obj.upperLimit) {
        this.upperLimit = obj.upperLimit;
      }
      if (obj.dimensions) {
        this.dimensions = obj.dimensions;
      }
      if (obj.data) {
        this.data = obj.data;
      }
    }
  }

}

export class Schedule extends DomainResource {
  public resourceType = 'Schedule';
  public identifier?: Identifier[];
  public active?: boolean;
  public serviceCategory?: CodeableConcept;
  public serviceType?: CodeableConcept[];
  public specialty?: CodeableConcept[];
  public actor: ResourceReference[];
  public planningHorizon?: Period;
  public comment?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.active) {
        this.active = obj.active;
      }
      if (obj.serviceCategory) {
        this.serviceCategory = new CodeableConcept(obj.serviceCategory);
      }
      if (obj.serviceType) {
        this.serviceType = [];
        for (const o of obj.serviceType || []) {
          this.serviceType.push(new CodeableConcept(o));
        }
      }
      if (obj.specialty) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.actor) {
        this.actor = [];
        for (const o of obj.actor || []) {
          this.actor.push(new ResourceReference(o));
        }
      }
      if (obj.planningHorizon) {
        this.planningHorizon = new Period(obj.planningHorizon);
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
    }
  }

}

export class SearchParameter extends DomainResource {
  public resourceType = 'SearchParameter';
  public url: string;
  public version?: string;
  public name: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public contact?: ContactDetail[];
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public purpose?: string;
  public code: string;
  public base: string[];
  public type: string;
  public derivedFrom?: string;
  public description: string;
  public expression?: string;
  public xpath?: string;
  public xpathUsage?: string;
  public target?: string[];
  public comparator?: string[];
  public modifier?: string[];
  public chain?: string[];
  public component?: ComponentComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.base) {
        this.base = obj.base;
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.derivedFrom) {
        this.derivedFrom = obj.derivedFrom;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.expression) {
        this.expression = obj.expression;
      }
      if (obj.xpath) {
        this.xpath = obj.xpath;
      }
      if (obj.xpathUsage) {
        this.xpathUsage = obj.xpathUsage;
      }
      if (obj.target) {
        this.target = obj.target;
      }
      if (obj.comparator) {
        this.comparator = obj.comparator;
      }
      if (obj.modifier) {
        this.modifier = obj.modifier;
      }
      if (obj.chain) {
        this.chain = obj.chain;
      }
      if (obj.component) {
        this.component = [];
        for (const o of obj.component || []) {
          this.component.push(new ComponentComponent(o));
        }
      }
    }
  }

}

export class ReferenceSeqComponent extends BackboneElement {
  public chromosome?: CodeableConcept;
  public genomeBuild?: string;
  public referenceSeqId?: CodeableConcept;
  public referenceSeqPointer?: ResourceReference;
  public referenceSeqString?: string;
  public strand?: number;
  public windowStart: number;
  public windowEnd: number;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.chromosome) {
        this.chromosome = new CodeableConcept(obj.chromosome);
      }
      if (obj.genomeBuild) {
        this.genomeBuild = obj.genomeBuild;
      }
      if (obj.referenceSeqId) {
        this.referenceSeqId = new CodeableConcept(obj.referenceSeqId);
      }
      if (obj.referenceSeqPointer) {
        this.referenceSeqPointer = new ResourceReference(obj.referenceSeqPointer);
      }
      if (obj.referenceSeqString) {
        this.referenceSeqString = obj.referenceSeqString;
      }
      if (obj.strand) {
        this.strand = obj.strand;
      }
      if (obj.windowStart) {
        this.windowStart = obj.windowStart;
      }
      if (obj.windowEnd) {
        this.windowEnd = obj.windowEnd;
      }
    }
  }

}

export class VariantComponent extends BackboneElement {
  public start?: number;
  public end?: number;
  public observedAllele?: string;
  public referenceAllele?: string;
  public cigar?: string;
  public variantPointer?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.start) {
        this.start = obj.start;
      }
      if (obj.end) {
        this.end = obj.end;
      }
      if (obj.observedAllele) {
        this.observedAllele = obj.observedAllele;
      }
      if (obj.referenceAllele) {
        this.referenceAllele = obj.referenceAllele;
      }
      if (obj.cigar) {
        this.cigar = obj.cigar;
      }
      if (obj.variantPointer) {
        this.variantPointer = new ResourceReference(obj.variantPointer);
      }
    }
  }

}

export class QualityComponent extends BackboneElement {
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

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.standardSequence) {
        this.standardSequence = new CodeableConcept(obj.standardSequence);
      }
      if (obj.start) {
        this.start = obj.start;
      }
      if (obj.end) {
        this.end = obj.end;
      }
      if (obj.score) {
        this.score = new Quantity(obj.score);
      }
      if (obj.method) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.truthTP) {
        this.truthTP = obj.truthTP;
      }
      if (obj.queryTP) {
        this.queryTP = obj.queryTP;
      }
      if (obj.truthFN) {
        this.truthFN = obj.truthFN;
      }
      if (obj.queryFP) {
        this.queryFP = obj.queryFP;
      }
      if (obj.gtFP) {
        this.gtFP = obj.gtFP;
      }
      if (obj.precision) {
        this.precision = obj.precision;
      }
      if (obj.recall) {
        this.recall = obj.recall;
      }
      if (obj.fScore) {
        this.fScore = obj.fScore;
      }
    }
  }

}

export class RepositoryComponent extends BackboneElement {
  public type: string;
  public url?: string;
  public name?: string;
  public datasetId?: string;
  public variantsetId?: string;
  public readsetId?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.datasetId) {
        this.datasetId = obj.datasetId;
      }
      if (obj.variantsetId) {
        this.variantsetId = obj.variantsetId;
      }
      if (obj.readsetId) {
        this.readsetId = obj.readsetId;
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
  public referenceSeq?: ReferenceSeqComponent;
  public variant?: VariantComponent[];
  public observedSeq?: string;
  public quality?: QualityComponent[];
  public readCoverage?: number;
  public repository?: RepositoryComponent[];
  public pointer?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.coordinateSystem) {
        this.coordinateSystem = obj.coordinateSystem;
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.specimen) {
        this.specimen = new ResourceReference(obj.specimen);
      }
      if (obj.device) {
        this.device = new ResourceReference(obj.device);
      }
      if (obj.performer) {
        this.performer = new ResourceReference(obj.performer);
      }
      if (obj.quantity) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.referenceSeq) {
        this.referenceSeq = new ReferenceSeqComponent(obj.referenceSeq);
      }
      if (obj.variant) {
        this.variant = [];
        for (const o of obj.variant || []) {
          this.variant.push(new VariantComponent(o));
        }
      }
      if (obj.observedSeq) {
        this.observedSeq = obj.observedSeq;
      }
      if (obj.quality) {
        this.quality = [];
        for (const o of obj.quality || []) {
          this.quality.push(new QualityComponent(o));
        }
      }
      if (obj.readCoverage) {
        this.readCoverage = obj.readCoverage;
      }
      if (obj.repository) {
        this.repository = [];
        for (const o of obj.repository || []) {
          this.repository.push(new RepositoryComponent(o));
        }
      }
      if (obj.pointer) {
        this.pointer = [];
        for (const o of obj.pointer || []) {
          this.pointer.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class ServiceDefinition extends DomainResource {
  public resourceType = 'ServiceDefinition';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public status: string;
  public experimental?: boolean;
  public date?: Date;
  public publisher?: string;
  public description?: string;
  public purpose?: string;
  public usage?: string;
  public approvalDate?: Date;
  public lastReviewDate?: Date;
  public effectivePeriod?: Period;
  public useContext?: UsageContext[];
  public jurisdiction?: CodeableConcept[];
  public topic?: CodeableConcept[];
  public contributor?: Contributor[];
  public contact?: ContactDetail[];
  public copyright?: string;
  public relatedArtifact?: RelatedArtifact[];
  public trigger?: TriggerDefinition[];
  public dataRequirement?: DataRequirement[];
  public operationDefinition?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.usage) {
        this.usage = obj.usage;
      }
      if (obj.approvalDate) {
        this.approvalDate = new Date(obj.approvalDate);
      }
      if (obj.lastReviewDate) {
        this.lastReviewDate = new Date(obj.lastReviewDate);
      }
      if (obj.effectivePeriod) {
        this.effectivePeriod = new Period(obj.effectivePeriod);
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.topic) {
        this.topic = [];
        for (const o of obj.topic || []) {
          this.topic.push(new CodeableConcept(o));
        }
      }
      if (obj.contributor) {
        this.contributor = [];
        for (const o of obj.contributor || []) {
          this.contributor.push(new Contributor(o));
        }
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.relatedArtifact) {
        this.relatedArtifact = [];
        for (const o of obj.relatedArtifact || []) {
          this.relatedArtifact.push(new RelatedArtifact(o));
        }
      }
      if (obj.trigger) {
        this.trigger = [];
        for (const o of obj.trigger || []) {
          this.trigger.push(new TriggerDefinition(o));
        }
      }
      if (obj.dataRequirement) {
        this.dataRequirement = [];
        for (const o of obj.dataRequirement || []) {
          this.dataRequirement.push(new DataRequirement(o));
        }
      }
      if (obj.operationDefinition) {
        this.operationDefinition = new ResourceReference(obj.operationDefinition);
      }
    }
  }

}

export class Slot extends DomainResource {
  public resourceType = 'Slot';
  public identifier?: Identifier[];
  public serviceCategory?: CodeableConcept;
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
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.serviceCategory) {
        this.serviceCategory = new CodeableConcept(obj.serviceCategory);
      }
      if (obj.serviceType) {
        this.serviceType = [];
        for (const o of obj.serviceType || []) {
          this.serviceType.push(new CodeableConcept(o));
        }
      }
      if (obj.specialty) {
        this.specialty = [];
        for (const o of obj.specialty || []) {
          this.specialty.push(new CodeableConcept(o));
        }
      }
      if (obj.appointmentType) {
        this.appointmentType = new CodeableConcept(obj.appointmentType);
      }
      if (obj.schedule) {
        this.schedule = new ResourceReference(obj.schedule);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.start) {
        this.start = new Date(obj.start);
      }
      if (obj.end) {
        this.end = new Date(obj.end);
      }
      if (obj.overbooked) {
        this.overbooked = obj.overbooked;
      }
      if (obj.comment) {
        this.comment = obj.comment;
      }
    }
  }

}

export class CollectionComponent extends BackboneElement {
  public collector?: ResourceReference;
  public collected?: Element;
  public quantity?: SimpleQuantity;
  public method?: CodeableConcept;
  public bodySite?: CodeableConcept;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.collector) {
        this.collector = new ResourceReference(obj.collector);
      }
      if (obj.collected) {
        this.collected = new Element(obj.collected);
      }
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.method) {
        this.method = new CodeableConcept(obj.method);
      }
      if (obj.bodySite) {
        this.bodySite = new CodeableConcept(obj.bodySite);
      }
    }
  }

}

export class ProcessingComponent extends BackboneElement {
  public description?: string;
  public procedure?: CodeableConcept;
  public additive?: ResourceReference[];
  public time?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.procedure) {
        this.procedure = new CodeableConcept(obj.procedure);
      }
      if (obj.additive) {
        this.additive = [];
        for (const o of obj.additive || []) {
          this.additive.push(new ResourceReference(o));
        }
      }
      if (obj.time) {
        this.time = new Element(obj.time);
      }
    }
  }

}

export class ContainerComponent extends BackboneElement {
  public identifier?: Identifier[];
  public description?: string;
  public type?: CodeableConcept;
  public capacity?: SimpleQuantity;
  public specimenQuantity?: SimpleQuantity;
  public additive?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.capacity) {
        this.capacity = new SimpleQuantity(obj.capacity);
      }
      if (obj.specimenQuantity) {
        this.specimenQuantity = new SimpleQuantity(obj.specimenQuantity);
      }
      if (obj.additive) {
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
  public subject: ResourceReference;
  public receivedTime?: Date;
  public parent?: ResourceReference[];
  public request?: ResourceReference[];
  public collection?: CollectionComponent;
  public processing?: ProcessingComponent[];
  public container?: ContainerComponent[];
  public note?: Annotation[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.accessionIdentifier) {
        this.accessionIdentifier = new Identifier(obj.accessionIdentifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.subject) {
        this.subject = new ResourceReference(obj.subject);
      }
      if (obj.receivedTime) {
        this.receivedTime = new Date(obj.receivedTime);
      }
      if (obj.parent) {
        this.parent = [];
        for (const o of obj.parent || []) {
          this.parent.push(new ResourceReference(o));
        }
      }
      if (obj.request) {
        this.request = [];
        for (const o of obj.request || []) {
          this.request.push(new ResourceReference(o));
        }
      }
      if (obj.collection) {
        this.collection = new CollectionComponent(obj.collection);
      }
      if (obj.processing) {
        this.processing = [];
        for (const o of obj.processing || []) {
          this.processing.push(new ProcessingComponent(o));
        }
      }
      if (obj.container) {
        this.container = [];
        for (const o of obj.container || []) {
          this.container.push(new ContainerComponent(o));
        }
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
    }
  }

}

export class StructureComponent extends BackboneElement {
  public url: string;
  public mode: string;
  public alias?: string;
  public documentation?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.mode) {
        this.mode = obj.mode;
      }
      if (obj.alias) {
        this.alias = obj.alias;
      }
      if (obj.documentation) {
        this.documentation = obj.documentation;
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
  public structure?: StructureComponent[];
  public import?: string[];
  public group: GroupComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.structure) {
        this.structure = [];
        for (const o of obj.structure || []) {
          this.structure.push(new StructureComponent(o));
        }
      }
      if (obj.import) {
        this.import = obj.import;
      }
      if (obj.group) {
        this.group = [];
        for (const o of obj.group || []) {
          this.group.push(new GroupComponent(o));
        }
      }
    }
  }

}

export class ChannelComponent extends BackboneElement {
  public type: string;
  public endpoint?: string;
  public payload?: string;
  public header?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = obj.type;
      }
      if (obj.endpoint) {
        this.endpoint = obj.endpoint;
      }
      if (obj.payload) {
        this.payload = obj.payload;
      }
      if (obj.header) {
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
  public channel: ChannelComponent;
  public tag?: Coding[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactPoint(o));
        }
      }
      if (obj.end) {
        this.end = new Date(obj.end);
      }
      if (obj.reason) {
        this.reason = obj.reason;
      }
      if (obj.criteria) {
        this.criteria = obj.criteria;
      }
      if (obj.error) {
        this.error = obj.error;
      }
      if (obj.channel) {
        this.channel = new ChannelComponent(obj.channel);
      }
      if (obj.tag) {
        this.tag = [];
        for (const o of obj.tag || []) {
          this.tag.push(new Coding(o));
        }
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
  public instance?: InstanceComponent[];
  public ingredient?: IngredientComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = [];
        for (const o of obj.category || []) {
          this.category.push(new CodeableConcept(o));
        }
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.instance) {
        this.instance = [];
        for (const o of obj.instance || []) {
          this.instance.push(new InstanceComponent(o));
        }
      }
      if (obj.ingredient) {
        this.ingredient = [];
        for (const o of obj.ingredient || []) {
          this.ingredient.push(new IngredientComponent(o));
        }
      }
    }
  }

}

export class SuppliedItemComponent extends BackboneElement {
  public quantity?: SimpleQuantity;
  public item?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.quantity) {
        this.quantity = new SimpleQuantity(obj.quantity);
      }
      if (obj.item) {
        this.item = new Element(obj.item);
      }
    }
  }

}

export class SupplyDelivery extends DomainResource {
  public resourceType = 'SupplyDelivery';
  public identifier?: Identifier;
  public basedOn?: ResourceReference[];
  public partOf?: ResourceReference[];
  public status?: string;
  public patient?: ResourceReference;
  public type?: CodeableConcept;
  public suppliedItem?: SuppliedItemComponent;
  public occurrence?: Element;
  public supplier?: ResourceReference;
  public destination?: ResourceReference;
  public receiver?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.suppliedItem) {
        this.suppliedItem = new SuppliedItemComponent(obj.suppliedItem);
      }
      if (obj.occurrence) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.supplier) {
        this.supplier = new ResourceReference(obj.supplier);
      }
      if (obj.destination) {
        this.destination = new ResourceReference(obj.destination);
      }
      if (obj.receiver) {
        this.receiver = [];
        for (const o of obj.receiver || []) {
          this.receiver.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class OrderedItemComponent extends BackboneElement {
  public quantity: Quantity;
  public item?: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.quantity) {
        this.quantity = new Quantity(obj.quantity);
      }
      if (obj.item) {
        this.item = new Element(obj.item);
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
  public orderedItem?: OrderedItemComponent;
  public occurrence?: Element;
  public authoredOn?: Date;
  public requester?: RequesterComponent;
  public supplier?: ResourceReference[];
  public reason?: Element;
  public deliverFrom?: ResourceReference;
  public deliverTo?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.category) {
        this.category = new CodeableConcept(obj.category);
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
      if (obj.orderedItem) {
        this.orderedItem = new OrderedItemComponent(obj.orderedItem);
      }
      if (obj.occurrence) {
        this.occurrence = new Element(obj.occurrence);
      }
      if (obj.authoredOn) {
        this.authoredOn = new Date(obj.authoredOn);
      }
      if (obj.requester) {
        this.requester = new RequesterComponent(obj.requester);
      }
      if (obj.supplier) {
        this.supplier = [];
        for (const o of obj.supplier || []) {
          this.supplier.push(new ResourceReference(o));
        }
      }
      if (obj.reason) {
        this.reason = new Element(obj.reason);
      }
      if (obj.deliverFrom) {
        this.deliverFrom = new ResourceReference(obj.deliverFrom);
      }
      if (obj.deliverTo) {
        this.deliverTo = new ResourceReference(obj.deliverTo);
      }
    }
  }

}

export class RestrictionComponent extends BackboneElement {
  public repetitions?: number;
  public period?: Period;
  public recipient?: ResourceReference[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.repetitions) {
        this.repetitions = obj.repetitions;
      }
      if (obj.period) {
        this.period = new Period(obj.period);
      }
      if (obj.recipient) {
        this.recipient = [];
        for (const o of obj.recipient || []) {
          this.recipient.push(new ResourceReference(o));
        }
      }
    }
  }

}

export class OutputComponent extends BackboneElement {
  public type: CodeableConcept;
  public value: Element;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.type) {
        this.type = new CodeableConcept(obj.type);
      }
      if (obj.value) {
        this.value = new Element(obj.value);
      }
    }
  }

}

export class Task extends DomainResource {
  public resourceType = 'Task';
  public identifier?: Identifier[];
  public definition?: Element;
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
  public requester?: RequesterComponent;
  public performerType?: CodeableConcept[];
  public owner?: ResourceReference;
  public reason?: CodeableConcept;
  public note?: Annotation[];
  public relevantHistory?: ResourceReference[];
  public restriction?: RestrictionComponent;
  public input?: ParameterComponent[];
  public output?: OutputComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.definition) {
        this.definition = new Element(obj.definition);
      }
      if (obj.basedOn) {
        this.basedOn = [];
        for (const o of obj.basedOn || []) {
          this.basedOn.push(new ResourceReference(o));
        }
      }
      if (obj.groupIdentifier) {
        this.groupIdentifier = new Identifier(obj.groupIdentifier);
      }
      if (obj.partOf) {
        this.partOf = [];
        for (const o of obj.partOf || []) {
          this.partOf.push(new ResourceReference(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.statusReason) {
        this.statusReason = new CodeableConcept(obj.statusReason);
      }
      if (obj.businessStatus) {
        this.businessStatus = new CodeableConcept(obj.businessStatus);
      }
      if (obj.intent) {
        this.intent = obj.intent;
      }
      if (obj.priority) {
        this.priority = obj.priority;
      }
      if (obj.code) {
        this.code = new CodeableConcept(obj.code);
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.focus) {
        this.focus = new ResourceReference(obj.focus);
      }
      if (obj.for) {
        this.for = new ResourceReference(obj.for);
      }
      if (obj.context) {
        this.context = new ResourceReference(obj.context);
      }
      if (obj.executionPeriod) {
        this.executionPeriod = new Period(obj.executionPeriod);
      }
      if (obj.authoredOn) {
        this.authoredOn = new Date(obj.authoredOn);
      }
      if (obj.lastModified) {
        this.lastModified = new Date(obj.lastModified);
      }
      if (obj.requester) {
        this.requester = new RequesterComponent(obj.requester);
      }
      if (obj.performerType) {
        this.performerType = [];
        for (const o of obj.performerType || []) {
          this.performerType.push(new CodeableConcept(o));
        }
      }
      if (obj.owner) {
        this.owner = new ResourceReference(obj.owner);
      }
      if (obj.reason) {
        this.reason = new CodeableConcept(obj.reason);
      }
      if (obj.note) {
        this.note = [];
        for (const o of obj.note || []) {
          this.note.push(new Annotation(o));
        }
      }
      if (obj.relevantHistory) {
        this.relevantHistory = [];
        for (const o of obj.relevantHistory || []) {
          this.relevantHistory.push(new ResourceReference(o));
        }
      }
      if (obj.restriction) {
        this.restriction = new RestrictionComponent(obj.restriction);
      }
      if (obj.input) {
        this.input = [];
        for (const o of obj.input || []) {
          this.input.push(new ParameterComponent(o));
        }
      }
      if (obj.output) {
        this.output = [];
        for (const o of obj.output || []) {
          this.output.push(new OutputComponent(o));
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

export class AssertComponent extends BackboneElement {
  public result: string;
  public message?: string;
  public detail?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.result) {
        this.result = obj.result;
      }
      if (obj.message) {
        this.message = obj.message;
      }
      if (obj.detail) {
        this.detail = obj.detail;
      }
    }
  }

}

export class SetupActionComponent extends BackboneElement {
  public operation?: OperationComponent;
  public assert?: AssertComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.operation) {
        this.operation = new OperationComponent(obj.operation);
      }
      if (obj.assert) {
        this.assert = new AssertComponent(obj.assert);
      }
    }
  }

}

export class SetupComponent extends BackboneElement {
  public action: SetupActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new SetupActionComponent(o));
        }
      }
    }
  }

}

export class TestActionComponent extends BackboneElement {
  public operation?: OperationComponent;
  public assert?: AssertComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.operation) {
        this.operation = new OperationComponent(obj.operation);
      }
      if (obj.assert) {
        this.assert = new AssertComponent(obj.assert);
      }
    }
  }

}

export class TestComponent extends BackboneElement {
  public name?: string;
  public description?: string;
  public action: TestActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new TestActionComponent(o));
        }
      }
    }
  }

}

export class TeardownActionComponent extends BackboneElement {
  public operation: OperationComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.operation) {
        this.operation = new OperationComponent(obj.operation);
      }
    }
  }

}

export class TeardownComponent extends BackboneElement {
  public action: TeardownActionComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.action) {
        this.action = [];
        for (const o of obj.action || []) {
          this.action.push(new TeardownActionComponent(o));
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
  public participant?: ParticipantComponent[];
  public setup?: SetupComponent;
  public test?: TestComponent[];
  public teardown?: TeardownComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.testScript) {
        this.testScript = new ResourceReference(obj.testScript);
      }
      if (obj.result) {
        this.result = obj.result;
      }
      if (obj.score) {
        this.score = obj.score;
      }
      if (obj.tester) {
        this.tester = obj.tester;
      }
      if (obj.issued) {
        this.issued = new Date(obj.issued);
      }
      if (obj.participant) {
        this.participant = [];
        for (const o of obj.participant || []) {
          this.participant.push(new ParticipantComponent(o));
        }
      }
      if (obj.setup) {
        this.setup = new SetupComponent(obj.setup);
      }
      if (obj.test) {
        this.test = [];
        for (const o of obj.test || []) {
          this.test.push(new TestComponent(o));
        }
      }
      if (obj.teardown) {
        this.teardown = new TeardownComponent(obj.teardown);
      }
    }
  }

}

export class OriginComponent extends BackboneElement {
  public index: number;
  public profile: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.index) {
        this.index = obj.index;
      }
      if (obj.profile) {
        this.profile = new Coding(obj.profile);
      }
    }
  }

}

export class DestinationComponent extends BackboneElement {
  public index: number;
  public profile: Coding;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.index) {
        this.index = obj.index;
      }
      if (obj.profile) {
        this.profile = new Coding(obj.profile);
      }
    }
  }

}

export class CapabilityComponent extends BackboneElement {
  public required?: boolean;
  public validated?: boolean;
  public description?: string;
  public origin?: number[];
  public destination?: number;
  public link?: string[];
  public capabilities: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.required) {
        this.required = obj.required;
      }
      if (obj.validated) {
        this.validated = obj.validated;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.origin) {
        this.origin = obj.origin;
      }
      if (obj.destination) {
        this.destination = obj.destination;
      }
      if (obj.link) {
        this.link = obj.link;
      }
      if (obj.capabilities) {
        this.capabilities = new ResourceReference(obj.capabilities);
      }
    }
  }

}

export class MetadataComponent extends BackboneElement {
  public link?: LinkComponent[];
  public capability: CapabilityComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.link) {
        this.link = [];
        for (const o of obj.link || []) {
          this.link.push(new LinkComponent(o));
        }
      }
      if (obj.capability) {
        this.capability = [];
        for (const o of obj.capability || []) {
          this.capability.push(new CapabilityComponent(o));
        }
      }
    }
  }

}

export class FixtureComponent extends BackboneElement {
  public autocreate?: boolean;
  public autodelete?: boolean;
  public resource?: ResourceReference;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.autocreate) {
        this.autocreate = obj.autocreate;
      }
      if (obj.autodelete) {
        this.autodelete = obj.autodelete;
      }
      if (obj.resource) {
        this.resource = new ResourceReference(obj.resource);
      }
    }
  }

}

export class VariableComponent extends BackboneElement {
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
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.defaultValue) {
        this.defaultValue = obj.defaultValue;
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.expression) {
        this.expression = obj.expression;
      }
      if (obj.headerField) {
        this.headerField = obj.headerField;
      }
      if (obj.hint) {
        this.hint = obj.hint;
      }
      if (obj.path) {
        this.path = obj.path;
      }
      if (obj.sourceId) {
        this.sourceId = obj.sourceId;
      }
    }
  }

}

export class RuleParamComponent extends BackboneElement {
  public name: string;
  public value?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.value) {
        this.value = obj.value;
      }
    }
  }

}

export class RuleComponent extends BackboneElement {
  public resource: ResourceReference;
  public param?: RuleParamComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.resource) {
        this.resource = new ResourceReference(obj.resource);
      }
      if (obj.param) {
        this.param = [];
        for (const o of obj.param || []) {
          this.param.push(new RuleParamComponent(o));
        }
      }
    }
  }

}

export class RulesetRuleParamComponent extends BackboneElement {
  public name: string;
  public value?: string;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.value) {
        this.value = obj.value;
      }
    }
  }

}

export class RulesetRuleComponent extends BackboneElement {
  public ruleId: string;
  public param?: RulesetRuleParamComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.ruleId) {
        this.ruleId = obj.ruleId;
      }
      if (obj.param) {
        this.param = [];
        for (const o of obj.param || []) {
          this.param.push(new RulesetRuleParamComponent(o));
        }
      }
    }
  }

}

export class RulesetComponent extends BackboneElement {
  public resource: ResourceReference;
  public rule: RulesetRuleComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.resource) {
        this.resource = new ResourceReference(obj.resource);
      }
      if (obj.rule) {
        this.rule = [];
        for (const o of obj.rule || []) {
          this.rule.push(new RulesetRuleComponent(o));
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
  public origin?: OriginComponent[];
  public destination?: DestinationComponent[];
  public metadata?: MetadataComponent;
  public fixture?: FixtureComponent[];
  public profile?: ResourceReference[];
  public variable?: VariableComponent[];
  public rule?: RuleComponent[];
  public ruleset?: RulesetComponent[];
  public setup?: SetupComponent;
  public test?: TestComponent[];
  public teardown?: TeardownComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = new Identifier(obj.identifier);
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.origin) {
        this.origin = [];
        for (const o of obj.origin || []) {
          this.origin.push(new OriginComponent(o));
        }
      }
      if (obj.destination) {
        this.destination = [];
        for (const o of obj.destination || []) {
          this.destination.push(new DestinationComponent(o));
        }
      }
      if (obj.metadata) {
        this.metadata = new MetadataComponent(obj.metadata);
      }
      if (obj.fixture) {
        this.fixture = [];
        for (const o of obj.fixture || []) {
          this.fixture.push(new FixtureComponent(o));
        }
      }
      if (obj.profile) {
        this.profile = [];
        for (const o of obj.profile || []) {
          this.profile.push(new ResourceReference(o));
        }
      }
      if (obj.variable) {
        this.variable = [];
        for (const o of obj.variable || []) {
          this.variable.push(new VariableComponent(o));
        }
      }
      if (obj.rule) {
        this.rule = [];
        for (const o of obj.rule || []) {
          this.rule.push(new RuleComponent(o));
        }
      }
      if (obj.ruleset) {
        this.ruleset = [];
        for (const o of obj.ruleset || []) {
          this.ruleset.push(new RulesetComponent(o));
        }
      }
      if (obj.setup) {
        this.setup = new SetupComponent(obj.setup);
      }
      if (obj.test) {
        this.test = [];
        for (const o of obj.test || []) {
          this.test.push(new TestComponent(o));
        }
      }
      if (obj.teardown) {
        this.teardown = new TeardownComponent(obj.teardown);
      }
    }
  }

}

export class ConceptReferenceComponent extends BackboneElement {
  public code: string;
  public display?: string;
  public designation?: DesignationComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.display) {
        this.display = obj.display;
      }
      if (obj.designation) {
        this.designation = [];
        for (const o of obj.designation || []) {
          this.designation.push(new DesignationComponent(o));
        }
      }
    }
  }

}

export class ConceptSetComponent extends BackboneElement {
  public system?: string;
  public version?: string;
  public concept?: ConceptReferenceComponent[];
  public filter?: FilterComponent[];
  public valueSet?: string[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.concept) {
        this.concept = [];
        for (const o of obj.concept || []) {
          this.concept.push(new ConceptReferenceComponent(o));
        }
      }
      if (obj.filter) {
        this.filter = [];
        for (const o of obj.filter || []) {
          this.filter.push(new FilterComponent(o));
        }
      }
      if (obj.valueSet) {
        this.valueSet = obj.valueSet;
      }
    }
  }

}

export class ComposeComponent extends BackboneElement {
  public lockedDate?: Date;
  public inactive?: boolean;
  public include: ConceptSetComponent[];
  public exclude?: ConceptSetComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.lockedDate) {
        this.lockedDate = new Date(obj.lockedDate);
      }
      if (obj.inactive) {
        this.inactive = obj.inactive;
      }
      if (obj.include) {
        this.include = [];
        for (const o of obj.include || []) {
          this.include.push(new ConceptSetComponent(o));
        }
      }
      if (obj.exclude) {
        this.exclude = [];
        for (const o of obj.exclude || []) {
          this.exclude.push(new ConceptSetComponent(o));
        }
      }
    }
  }

}

export class ContainsComponent extends BackboneElement {
  public system?: string;
  public abstract?: boolean;
  public inactive?: boolean;
  public version?: string;
  public code?: string;
  public display?: string;
  public designation?: DesignationComponent[];
  public contains?: ContainsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.system) {
        this.system = obj.system;
      }
      if (obj.abstract) {
        this.abstract = obj.abstract;
      }
      if (obj.inactive) {
        this.inactive = obj.inactive;
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.code) {
        this.code = obj.code;
      }
      if (obj.display) {
        this.display = obj.display;
      }
      if (obj.designation) {
        this.designation = [];
        for (const o of obj.designation || []) {
          this.designation.push(new DesignationComponent(o));
        }
      }
      if (obj.contains) {
        this.contains = [];
        for (const o of obj.contains || []) {
          this.contains.push(new ContainsComponent(o));
        }
      }
    }
  }

}

export class ExpansionComponent extends BackboneElement {
  public identifier: string;
  public timestamp: Date;
  public total?: number;
  public offset?: number;
  public parameter?: ParameterComponent[];
  public contains?: ContainsComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = obj.identifier;
      }
      if (obj.timestamp) {
        this.timestamp = new Date(obj.timestamp);
      }
      if (obj.total) {
        this.total = obj.total;
      }
      if (obj.offset) {
        this.offset = obj.offset;
      }
      if (obj.parameter) {
        this.parameter = [];
        for (const o of obj.parameter || []) {
          this.parameter.push(new ParameterComponent(o));
        }
      }
      if (obj.contains) {
        this.contains = [];
        for (const o of obj.contains || []) {
          this.contains.push(new ContainsComponent(o));
        }
      }
    }
  }

}

export class ValueSet extends DomainResource {
  public resourceType = 'ValueSet';
  public url?: string;
  public identifier?: Identifier[];
  public version?: string;
  public name?: string;
  public title?: string;
  public status = 'draft';
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
  public extensible?: boolean;
  public compose?: ComposeComponent;
  public expansion?: ExpansionComponent;

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.url) {
        this.url = obj.url;
      }
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.version) {
        this.version = obj.version;
      }
      if (obj.name) {
        this.name = obj.name;
      }
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.experimental) {
        this.experimental = obj.experimental;
      }
      if (obj.date) {
        this.date = new Date(obj.date);
      }
      if (obj.publisher) {
        this.publisher = obj.publisher;
      }
      if (obj.contact) {
        this.contact = [];
        for (const o of obj.contact || []) {
          this.contact.push(new ContactDetail(o));
        }
      }
      if (obj.description) {
        this.description = obj.description;
      }
      if (obj.useContext) {
        this.useContext = [];
        for (const o of obj.useContext || []) {
          this.useContext.push(new UsageContext(o));
        }
      }
      if (obj.jurisdiction) {
        this.jurisdiction = [];
        for (const o of obj.jurisdiction || []) {
          this.jurisdiction.push(new CodeableConcept(o));
        }
      }
      if (obj.immutable) {
        this.immutable = obj.immutable;
      }
      if (obj.purpose) {
        this.purpose = obj.purpose;
      }
      if (obj.copyright) {
        this.copyright = obj.copyright;
      }
      if (obj.extensible) {
        this.extensible = obj.extensible;
      }
      if (obj.compose) {
        this.compose = new ComposeComponent(obj.compose);
      }
      if (obj.expansion) {
        this.expansion = new ExpansionComponent(obj.expansion);
      }
    }
  }

}

export class DispenseComponent extends BackboneElement {
  public product?: CodeableConcept;
  public eye?: string;
  public sphere?: number;
  public cylinder?: number;
  public axis?: number;
  public prism?: number;
  public base?: string;
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
      if (obj.product) {
        this.product = new CodeableConcept(obj.product);
      }
      if (obj.eye) {
        this.eye = obj.eye;
      }
      if (obj.sphere) {
        this.sphere = obj.sphere;
      }
      if (obj.cylinder) {
        this.cylinder = obj.cylinder;
      }
      if (obj.axis) {
        this.axis = obj.axis;
      }
      if (obj.prism) {
        this.prism = obj.prism;
      }
      if (obj.base) {
        this.base = obj.base;
      }
      if (obj.add) {
        this.add = obj.add;
      }
      if (obj.power) {
        this.power = obj.power;
      }
      if (obj.backCurve) {
        this.backCurve = obj.backCurve;
      }
      if (obj.diameter) {
        this.diameter = obj.diameter;
      }
      if (obj.duration) {
        this.duration = new SimpleQuantity(obj.duration);
      }
      if (obj.color) {
        this.color = obj.color;
      }
      if (obj.brand) {
        this.brand = obj.brand;
      }
      if (obj.note) {
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
  public dispense?: DispenseComponent[];

  constructor(obj?: any) {
    super(obj);
    if (obj) {
      if (obj.identifier) {
        this.identifier = [];
        for (const o of obj.identifier || []) {
          this.identifier.push(new Identifier(o));
        }
      }
      if (obj.status) {
        this.status = obj.status;
      }
      if (obj.patient) {
        this.patient = new ResourceReference(obj.patient);
      }
      if (obj.encounter) {
        this.encounter = new ResourceReference(obj.encounter);
      }
      if (obj.dateWritten) {
        this.dateWritten = new Date(obj.dateWritten);
      }
      if (obj.prescriber) {
        this.prescriber = new ResourceReference(obj.prescriber);
      }
      if (obj.reason) {
        this.reason = new Element(obj.reason);
      }
      if (obj.dispense) {
        this.dispense = [];
        for (const o of obj.dispense || []) {
          this.dispense.push(new DispenseComponent(o));
        }
      }
    }
  }

}

export const classMapping = {
  'Account': Account,
  'ActivityDefinition': ActivityDefinition,
  'AllergyIntolerance': AllergyIntolerance,
  'AdverseEvent': AdverseEvent,
  'Appointment': Appointment,
  'AppointmentResponse': AppointmentResponse,
  'AuditEvent': AuditEvent,
  'Basic': Basic,
  'Binary': Binary,
  'BodySite': BodySite,
  'Bundle': Bundle,
  'CapabilityStatement': CapabilityStatement,
  'CarePlan': CarePlan,
  'CareTeam': CareTeam,
  'ChargeItem': ChargeItem,
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
  'DataElement': DataElement,
  'DetectedIssue': DetectedIssue,
  'Device': Device,
  'DeviceComponent': DeviceComponent,
  'DeviceMetric': DeviceMetric,
  'DeviceRequest': DeviceRequest,
  'DeviceUseStatement': DeviceUseStatement,
  'DiagnosticReport': DiagnosticReport,
  'DocumentManifest': DocumentManifest,
  'DocumentReference': DocumentReference,
  'EligibilityRequest': EligibilityRequest,
  'EligibilityResponse': EligibilityResponse,
  'Encounter': Encounter,
  'Endpoint': Endpoint,
  'EnrollmentRequest': EnrollmentRequest,
  'EnrollmentResponse': EnrollmentResponse,
  'EpisodeOfCare': EpisodeOfCare,
  'ExpansionProfile': ExpansionProfile,
  'ExplanationOfBenefit': ExplanationOfBenefit,
  'FamilyMemberHistory': FamilyMemberHistory,
  'Flag': Flag,
  'Goal': Goal,
  'GraphDefinition': GraphDefinition,
  'Group': Group,
  'GuidanceResponse': GuidanceResponse,
  'HealthcareService': HealthcareService,
  'ImagingManifest': ImagingManifest,
  'ImagingStudy': ImagingStudy,
  'Immunization': Immunization,
  'ImmunizationRecommendation': ImmunizationRecommendation,
  'ImplementationGuide': ImplementationGuide,
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
  'MedicationRequest': MedicationRequest,
  'MedicationStatement': MedicationStatement,
  'MessageDefinition': MessageDefinition,
  'MessageHeader': MessageHeader,
  'NamingSystem': NamingSystem,
  'NutritionOrder': NutritionOrder,
  'Observation': Observation,
  'OperationDefinition': OperationDefinition,
  'OperationOutcome': OperationOutcome,
  'Organization': Organization,
  'Parameters': Parameters,
  'Patient': Patient,
  'PaymentNotice': PaymentNotice,
  'PaymentReconciliation': PaymentReconciliation,
  'Person': Person,
  'PlanDefinition': PlanDefinition,
  'Practitioner': Practitioner,
  'PractitionerRole': PractitionerRole,
  'Procedure': Procedure,
  'ProcedureRequest': ProcedureRequest,
  'ProcessRequest': ProcessRequest,
  'ProcessResponse': ProcessResponse,
  'Provenance': Provenance,
  'Questionnaire': Questionnaire,
  'QuestionnaireResponse': QuestionnaireResponse,
  'ReferralRequest': ReferralRequest,
  'RelatedPerson': RelatedPerson,
  'RequestGroup': RequestGroup,
  'ResearchStudy': ResearchStudy,
  'ResearchSubject': ResearchSubject,
  'RiskAssessment': RiskAssessment,
  'Schedule': Schedule,
  'SearchParameter': SearchParameter,
  'Sequence': Sequence,
  'ServiceDefinition': ServiceDefinition,
  'Slot': Slot,
  'Specimen': Specimen,
  'StructureDefinition': StructureDefinition,
  'StructureMap': StructureMap,
  'Subscription': Subscription,
  'Substance': Substance,
  'SupplyDelivery': SupplyDelivery,
  'SupplyRequest': SupplyRequest,
  'Task': Task,
  'TestScript': TestScript,
  'TestReport': TestReport,
  'ValueSet': ValueSet,
  'VisionPrescription': VisionPrescription
};
