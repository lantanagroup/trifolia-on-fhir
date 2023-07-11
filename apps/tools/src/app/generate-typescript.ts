import {BaseTools} from './baseTools';
import * as fs from 'fs';
import {
  IAttachment,
  IAuditEvent,
  IBundle,
  ICapabilityStatement,
  ICapabilityStatementRestComponent,
  ICapabilityStatementSecurityComponent,
  ICodeSystem,
  ICodeSystemConcept,
  ICodeSystemConceptProperty,
  IDocumentReference,
  IDomainResource,
  IElementDefinition,
  IElementDefinitionConstraint,
  IElementDefinitionDiscriminator,
  IElementDefinitionSlicing,
  IImplementationGuide,
  IOperationOutcome,
  IOperationOutcomeIssue,
  IStructureDefinition, IValueSet
} from '../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { ValueSet } from '../../../../libs/tof-lib/src/lib/r4/fhir';
import * as Yargs from 'yargs';

export interface GenerateTypescriptOptions {
  types: string;
  resources: string;
  output: string;
  valueSets: string;
}

interface GeneratedProperty {
  name: string;
  type?: string;
  optional: boolean;
  multiple: boolean;
  value?: string;
}

interface GeneratedType {
  id: string;
  url?: string;
  extends?: string;
  implements?: string;
  properties: GeneratedProperty[];
}

const primitiveTypes = {
  instant: 'string',
  time: 'string',
  date: 'string',
  dateTime: 'string',
  base64Binary: 'string',
  decimal: 'number',
  boolean: 'boolean',
  url: 'string',
  integer64: 'number',
  code: 'string',
  string: 'string',
  integer: 'number',
  uri: 'string',
  canonical: 'string',
  markdown: 'string',
  id: 'string',
  oid: 'string',
  uuid: 'string',
  unsignedInt: 'number',
  positiveInt: 'number',
  xhtml: 'string',
  number: 'number'
};

const interfaces = {
  'Reference': 'IResourceReference',
  'Coding': 'ICoding',
  'CodeableConcept': 'ICodeableConcept',
  'Extension': 'IExtension',
  'Meta': 'IMeta',
  'Resource': 'IResource',
  'BundleEntry': 'IBundleEntry',
  'Bundle': 'IBundle',
  'ValueSet': 'IValueSet',
  'HumanName': 'IHumanName',
  'Identifier': 'IIdentifier',
  'ContactPoint': 'IContactPoint',
  'ContactDetail': 'IContactDetail',
  'Practitioner': 'IPractitioner',
  'Element': 'IElement',
  'ElementDefinitionType': 'IElementDefinitionType',
  'ElementDefinitionMapping': 'IElementDefinitionMapping',
  'ElementDefinitionDiscriminator': 'IElementDefinitionDiscriminator',
  'ElementDefinitionConstraint': 'IElementDefinitionConstraint',
  'ElementDefinitionSlicing': 'IElementDefinitionSlicing',
  'ElementDefinition': 'IElementDefinition',
  'StructureDefinition': 'IStructureDefinition',
  'AuditEvent': 'IAuditEvent',
  'ImplementationGuide': 'IImplementationGuide',
  'CodeSystemConceptProperty': 'ICodeSystemConceptProperty',
  'CodeSystemConcept': 'ICodeSystemConcept',
  'CodeSystem': 'ICodeSystem',
  'Attachment': 'IAttachment',
  'DocumentReference': 'IDocumentReference',
  'OperationOutcomeIssue': 'IOperationOutcomeIssue',
  'OperationOutcome': 'IOperationOutcome',
  'CapabilityStatementRestComponent': 'ICapabilityStatementRestComponent',
  'CapabilityStatementSecurityComponent': 'ICapabilityStatementSecurityComponent',
  'CapabilityStatement': 'ICapabilityStatement',
  'AuditEventAgentNetwork': 'INetworkComponent',
  'AuditEventAgent': 'IAgentComponent'
};

interface GeneratedDeclaredType {
  name: string;
  values: string;
}

export class GenerateTypescript extends BaseTools {
  protected options: GenerateTypescriptOptions;
  private output = '';
  private generatedTypes: GeneratedType[] = [];
  private generatedDeclaredTypes: GeneratedDeclaredType[] = [];
  private valueSetsBundle: IBundle;

  public static commandFormat = 'generate-typescript [types] [resources] [valueSets] [output]';
  public static commandDescription = 'Generates typescript classes based on StructureDefinition resources in bundles within the specified path';

  public static commandBuilder(yargs: Yargs.Argv) {
    return yargs
      .positional('types', {
        required: true,
        description: 'The path to profiles-types.json'
      })
      .positional('resources', {
        required: true,
        description: 'The path to profiles-resources.json'
      })
      .positional('valueSets', {
        required: true,
        description: 'The path to valuesets.json'
      })
      .positional('output', {
        required: true,
        description: 'Where the typescript generated should be stored'
      });
  }

  public static commandHandler(args: any) {
    const generateTypescript = new GenerateTypescript(args);
    generateTypescript.execute();
  }

  constructor(options: GenerateTypescriptOptions) {
    super();
    this.options = options;
  }

  getCodesFromValueSet(valueSet: ValueSet) {
    if (!valueSet.compose || !valueSet.compose.include || !valueSet.compose.include.length) {
      return [];
    }

    const codes: string[] = [];

    valueSet.compose.include.forEach(i => {
      if (i.system) {
        const foundSystem = this.valueSetsBundle.entry
          .filter(e => e.resource.resourceType === 'CodeSystem')
          .map(e => e.resource as ICodeSystem)
          .find(cs => cs.url === i.system);

        if (foundSystem) {
          if (foundSystem.concept && foundSystem.concept.length > 0) {
            foundSystem.concept.forEach(concept => {
              codes.push(concept.code);
            });
          } else {
            console.log(`Code system ${i.system} does not have any concepts`);
          }
        } else {
          console.log(`Could not find code system ${i.system}`);
        }
      } else if (i.valueSet && i.valueSet.length > 0) {
        for (const valueSetUri of i.valueSet) {
          const foundValueSet = this.valueSetsBundle.entry
            .filter(e => e.resource.resourceType === 'ValueSet')
            .map(e => e.resource as ValueSet)
            .find(vs => vs.url === valueSetUri);

          if (foundValueSet) {
            const nextCodes = this.getCodesFromValueSet(foundValueSet);
            codes.push(...nextCodes);
          } else {
            console.log(`Could not find included value set ${valueSetUri} in value set ${valueSet.url}`);
          }
        }
      } else {
        console.log('todo');
      }
    });

    return codes;
  }

  getType(code: string, bundle: IBundle, propertyName: string, valueSetUri?: string) {
    if (Object.keys(primitiveTypes).indexOf(code) >= 0) {
      if (valueSetUri) {
        const valueSetUrl = valueSetUri.indexOf('|') > 0 ? valueSetUri.substring(0, valueSetUri.lastIndexOf('|')) : valueSetUri
        const foundValueSet = this.valueSetsBundle.entry
          .filter(e => e.resource.resourceType === 'ValueSet')
          .map(e => e.resource as IValueSet)
          .find(vs => vs.url === valueSetUrl);

        if (foundValueSet) {
          const codes = this.getCodesFromValueSet(foundValueSet as ValueSet);

          if (codes && codes.length > 0) {
            const foundSimilarDeclaredTypes = this.generatedDeclaredTypes.filter(dt => dt.name.startsWith(propertyName));
            const declaredTypeName = propertyName + (foundSimilarDeclaredTypes.length + 1);
            this.generatedDeclaredTypes.push({
              name: declaredTypeName,
              values: "'" + codes.join("'|'") + "'"
            });
            return declaredTypeName;
          }
        } else {
          console.log(`Did not find value set ${valueSetUri}`);
        }
      }

      return primitiveTypes[code];
    }

    const foundType = this.generatedTypes.find(gt => gt.id === code);
    if (foundType) return foundType.id;

    switch (code) {
      case 'http://hl7.org/fhirpath/System.String':
      case 'http://hl7.org/fhirpath/System.Date':
      case 'http://hl7.org/fhirpath/System.DateTime':
      case 'http://hl7.org/fhirpath/System.Time':
      case 'string':
        return 'string';
      case 'http://hl7.org/fhirpath/System.Decimal':
      case 'http://hl7.org/fhirpath/System.Integer':
        return 'number';
      case 'http://hl7.org/fhirpath/System.Boolean':
        return 'boolean';
      default:
        const found = bundle.entry
          .filter(e => e.resource.resourceType === 'StructureDefinition')
          .map(e => e.resource as IStructureDefinition)
          .find(sd => sd.id === code);

        if (found) {
          this.processType(found, bundle);
          return found.id;
        }

        console.log(`Unexpected type ${code}`);
        return 'void';
    }
  }

  private processType(sd: IStructureDefinition, sourceBundle: IBundle) {
    if (['BackboneElement', 'Element', 'BackboneType', 'PrimitiveType'].indexOf(sd.id) >= 0) {
      return;
    }

    if (Object.keys(primitiveTypes).indexOf(sd.id) >= 0) {
      return;
    }

    const foundGeneratedType = this.generatedTypes.find(pt => pt.id === sd.id);
    if (foundGeneratedType) {
      return foundGeneratedType;
    }

    const generatedType: GeneratedType = {
      id: sd.id,
      url: sd.url,
      implements: interfaces[sd.id],
      properties: [{
        name: 'resourceType',
        optional: false,
        multiple: false,
        value: `'${sd.id}'`
      }]
    };
    this.generatedTypes.push(generatedType);

    const foundGeneratedBaseDefType = this.generatedTypes.find(pt => pt.url === sd.baseDefinition);

    if (sd.baseDefinition && !foundGeneratedBaseDefType) {
      const foundBaseEntry = sourceBundle.entry.find(e => {
        const next = e.resource as IStructureDefinition;
        return next.url === sd.baseDefinition;
      });

      if (!foundBaseEntry) {
        throw new Error(`Couldn't find base definition ${sd.baseDefinition}`);
      }

      const generatedBaseType = this.processType(foundBaseEntry.resource as IStructureDefinition, sourceBundle);

      if (generatedBaseType) {
        generatedType.extends = generatedBaseType.id;
      } else {
        console.log(`No generated type for base definition ${sd.baseDefinition} on ${sd.id}`);
      }
    } else if (foundGeneratedBaseDefType) {
      generatedType.extends = foundGeneratedBaseDefType.id;
    }

    if (!sd.differential) {
      console.log(`StructureDefinition/${sd.id} does not have a differential`);
    } else {
      const insertSubTypeIndex = this.generatedTypes.indexOf(generatedType);
      const elements = sd.differential.element.filter(e => {
        const pathSplit = e.path.split('.');
        return pathSplit.length === 2;
      });
      elements.forEach(e => this.processElement(e, generatedType, sd, sourceBundle, insertSubTypeIndex));
    }

    return generatedType;
  }

  private processElement(e: any, generatedType: GeneratedType, resource: IStructureDefinition, sourceBundle: IBundle, insertSubTypeIndex: number) {
    const pathSplit = e.path.split('.');
    let propertyName = pathSplit[pathSplit.length-1];

    if (e.path === generatedType.id) {
      return;
    }

    if (propertyName === 'comparator' && resource.id === 'SimpleQuantity') {
      console.log('test');
    }

    if (!e.type || e.type.length === 0) {
      const subTypeElementCount = resource.differential.element.filter(next => next.path.startsWith(e.path + '.')).length;
      let subType;

      if (e.contentReference && e.contentReference.startsWith('#')) {
        const foundElement = resource.differential.element.find(ne => ne.id === e.contentReference.substring(1));
        if (foundElement) {
          subType = this.generateSubType(resource, foundElement, resource, sourceBundle, insertSubTypeIndex);
        }
      } else if (subTypeElementCount > 0) {
        subType = this.generateSubType(resource, e, resource, sourceBundle, insertSubTypeIndex);
      } else {
        const foundSnapshotElement = resource.snapshot.element.find(next => next.id === e.id);
        let type = 'string';

        if (foundSnapshotElement && foundSnapshotElement.type && foundSnapshotElement.type.length === 1) {
          type = this.getType(foundSnapshotElement.type[0].code, sourceBundle, propertyName);
        } else {
          console.log(`No snapshot element or type found for resource ${resource.id} and element id ${e.id}`);
        }

        generatedType.properties.push({
          name: propertyName,
          type,
          optional: e.min === 0,
          multiple: e.max === '*'
        });
        return;
      }

      generatedType.properties.push({
        name: propertyName,
        type: subType.id,
        optional: e.min === 0,
        multiple: e.max === '*'
      });
    } else if (e.type.length === 1 && ['BackboneElement', 'Element'].indexOf(e.type[0].code) < 0) {
      generatedType.properties.push({
        name: propertyName,
        type: this.getType(e.type[0].code, sourceBundle,
          resource.id + propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1),
          e.binding && e.binding.valueSet ? e.binding.valueSet : null),
        optional: e.min === 0,
        multiple: e.max === '*'
      });
    } else if (e.type.length === 1 && ['BackboneElement', 'Element'].indexOf(e.type[0].code) >= 0) {
      const generatedSubType = this.generateSubType(resource, e, resource, sourceBundle, insertSubTypeIndex);
      generatedType.properties.push({
        name: propertyName,
        type: generatedSubType.id,
        optional: e.min === 0,
        multiple: e.max === '*'
      });
    } else {
      // handle mutiple types
      if (!propertyName.endsWith('[x]')) {
        throw new Error('Expected property to have [\'x\'] in it\'s name');
      }

      propertyName = propertyName.substring(0, propertyName.length - 3);

      for (const elementType of e.type) {
        const newPropertyName = propertyName + elementType.code.substring(0, 1).toUpperCase() + elementType.code.substring(1);

        generatedType.properties.push({
          name: newPropertyName,
          optional: true,
          multiple: false,
          type: this.getType(elementType.code, sourceBundle, resource.id + propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1))
        });
      }
    }
  }

  private generateSubType(sd: IStructureDefinition, element: any, resource: IStructureDefinition, sourceBundle: IBundle, insertSubTypeIndex: number) {
    const pathSplit = element.path.split('.');
    for (let i = 0; i < pathSplit.length; i++) {
      pathSplit[i] = pathSplit[i].substring(0, 1).toUpperCase() + pathSplit[i].substring(1);
    }

    const generatedTypeId = pathSplit.join('');
    const found = this.generatedTypes.find(gt => gt.id === generatedTypeId);
    if (found) {
      return found;
    }

    const generatedType: GeneratedType = {
      id: generatedTypeId,
      implements: interfaces[generatedTypeId],
      properties: []
    };
    this.generatedTypes.splice(insertSubTypeIndex, 0, generatedType);

    if (generatedType.id === 'ClaimAccident') {
      console.log('test');
    }

    if (!sd.differential) {
      throw new Error(`StructureDefinition/${sd.id} does not have a differential`);
    }

    const elements = sd.differential.element.filter(e => e.path.startsWith(element.path + '.') && e.path.split('.').length === pathSplit.length + 1);
    elements.forEach(e => this.processElement(e, generatedType, resource, sourceBundle, insertSubTypeIndex));

    return generatedType;
  }

  private processBundle(path: string) {
    const bundleContent = fs.readFileSync(path).toString();
    const bundle = JSON.parse(bundleContent) as IBundle;

    bundle.entry
      .filter(e => {
        return e.resource.resourceType === 'StructureDefinition';
      })
      .forEach(e => {
        this.processType(e.resource as IStructureDefinition, bundle);
      });
  }

  private generateConstructorContent(gt: GeneratedType): string {
    let output = '';

    gt.properties.forEach(p => {
      output += `\t\tif (obj.hasOwnProperty('${p.name}')) {\n`;

      if (p.multiple) {
        output += `\t\t\tthis.${p.name} = [];\n`;
        output += `\t\t\tfor (const o of obj.${p.name} || []) {\n`;

        if (primitiveTypes[p.type] || this.generatedDeclaredTypes.find(dt => dt.name === p.type)) {
          output += `\t\t\t\tthis.${p.name}.push(o);\n`;
        } else {
          output += `\t\t\t\tthis.${p.name}.push(new ${p.type}(o));\n`;
        }

        output += `\t\t\t}\n`;
      } else {
        output += `\t\t\tthis.${p.name} = obj.${p.name};\n`;
      }

      output += `\t\t}\n\n`;
    });

    return output;
  }

  private generateOutput() {
    this.output += `import * as IFhir from '../fhirInterfaces';\n\n`;

    this.generatedDeclaredTypes.forEach(dt => {
      this.output += `declare type ${dt.name} = ${dt.values};\n`
    });

    this.output += '\n';

    this.generatedTypes.forEach(gt => {
      this.output += `export class ${gt.id}`;

      if (gt.extends) {
        this.output += ' extends ' + gt.extends;
      }

      if (gt.implements) {
        this.output += ' implements IFhir.' + gt.implements;
      }

      this.output += ' {\n\tconstructor(obj?: any) {\n';

      if (gt.extends) {
        this.output += `\t\tsuper(obj);\n`;
      }

      // constructor obj
      this.output += this.generateConstructorContent(gt);

      this.output += '\t}\n\n'

      for (const property of gt.properties) {
        const optional = property.optional ? '?' : '';
        const multiple = property.type && property.multiple ? '[]' : '';
        const type = property.type ? `: ${property.type}` : '';
        const value = property.value ? ` = ${property.value}` : '';
        this.output += `  ${property.name}${optional}${type}${multiple}${value};\n`;
      }

      this.output += '}\n\n';
    });

    fs.writeFileSync(this.options.output, this.output);
  }

  execute() {
    this.valueSetsBundle = JSON.parse(fs.readFileSync(this.options.valueSets).toString());

    this.processBundle(this.options.types);
    this.processBundle(this.options.resources);
    this.generateOutput();
  }
}
