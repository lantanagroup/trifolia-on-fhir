import {Severities, ValidatorMessage} from 'fhir/validator';
import {FhirService} from '../fhir.service';

export abstract class CustomValidator {
    protected fhirService: FhirService;

    protected constructor(fhirService: FhirService) {
        this.fhirService = fhirService;
    }

    private validateGenerateImplementationGuide(implementationGuide: any): ValidatorMessage[] {
        const messages: ValidatorMessage[] = [];
        const nameRegex = /^[A-Z][A-Za-z0-9_]+$/g;

        if (implementationGuide.name && !nameRegex.test(implementationGuide.name)) {
            messages.push({
                severity: Severities.Error,
                location: 'ImplementationGuide.name',
                resourceId: implementationGuide.id,
                message: 'Name should be usable as an identifier for the module by machine processing applications such as code generation. name.matches(\'[A-Z]([A-Za-z0-9_]){0,254}\')'
            });
        }

        return messages;
    }
    
    private validateGenericStructureDefinition(structureDefinition: any, extraData?: any): ValidatorMessage[] {
        const messages: ValidatorMessage[] = [];
        const nameRegex = /^[A-Z][A-Za-z0-9_]+$/g;

        if (structureDefinition.name && !nameRegex.test(structureDefinition.name)) {
            messages.push({
                severity: Severities.Error,
                location: 'StructureDefinition.name',
                resourceId: structureDefinition.id,
                message: 'Name should be usable as an identifier for the module by machine processing applications such as code generation. name.matches(\'[A-Z]([A-Za-z0-9_]){0,254}\')'
            });
        }

        if (extraData && structureDefinition.differential && structureDefinition.differential.element && extraData.baseStructureDefinition && extraData.baseStructureDefinition.snapshot && extraData.baseStructureDefinition.snapshot.element) {
          structureDefinition.differential.element.forEach((element, index) => {
            const foundBaseElement = extraData.baseStructureDefinition.snapshot.element.find((baseElement) => baseElement.path === element.path);

            if (foundBaseElement && element.min && element.min < foundBaseElement.min) {
              messages.push({
                severity: Severities.Error,
                location: `StructureDefinition.differential.element[${index+1}]`,
                resourceId: structureDefinition.id,
                message: `The constrained element\'s min value cannot be less than the base element\'s min value. Constrained element's min value is ${element.min} while the base element's min value is ${foundBaseElement.min}.`
              });
            }

            const elementMaxRequired = element.max || (foundBaseElement && foundBaseElement.max);
            const elementMinRequired = element.min || (foundBaseElement && foundBaseElement.min);

            if (elementMaxRequired && elementMaxRequired !== "*" && element.min > parseInt(elementMaxRequired)) {
              messages.push({
                severity: Severities.Error,
                location: `StructureDefinition.differential.element[${index+1}]`,
                resourceId: structureDefinition.id,
                message: `The constrained element\'s min value cannot be greater than the base element\'s max value. Constrained element's min value is ${element.min} while the base element's max value is ${elementMaxRequired}.`
              });
            }

            if (foundBaseElement && element.max &&
              ((element.max !== "*" && foundBaseElement.max !== "*" && element.max > foundBaseElement.max) ||
                (element.max === "*" && foundBaseElement.max !== "*"))){
              messages.push({
                severity: Severities.Error,
                location: `StructureDefinition.differential.element[${index + 1}]`,
                resourceId: structureDefinition.id,
                message: `The constrained element\'s max value cannot be greater than the base element\'s max value. Constrained element's max value is ${element.max} while the base element's max value is ${foundBaseElement.max}.`
              });
            }

            if(element.max && elementMinRequired && element.max !== "*" && element.max < parseInt(elementMinRequired)){
              messages.push({
                severity: Severities.Error,
                location: `StructureDefinition.differential.element[${index + 1}]`,
                resourceId: structureDefinition.id,
                message: `The constrained element\'s max value cannot be less than the base element\'s min value. Constrained element's max value is ${element.max} while the base element's min value is ${elementMinRequired}.`
              });
            }

            if(foundBaseElement && foundBaseElement.fixed && element.fixed !== foundBaseElement.fixed){
              messages.push({
                severity: Severities.Error,
                location: `StructureDefinition.differential.element[${index + 1}]`,
                resourceId: structureDefinition.id,
                message: `The constrained element\'s fixed value cannot anything other than the base element\'s fixed value. Constrained element's fixed value is ${element.fixed} while the base element's fixed value is ${foundBaseElement.fixed}.`
              });
            }

            if(foundBaseElement && foundBaseElement.pattern && element.pattern !== foundBaseElement.pattern){
              messages.push({
                severity: Severities.Error,
                location: `StructureDefinition.differential.element[${index + 1}]`,
                resourceId: structureDefinition.id,
                message: `The constrained element\'s pattern value cannot anything other than the base element\'s pattern value. Constrained element's pattern value is ${element.pattern} while the base element's pattern value is ${foundBaseElement.pattern}.`
              });
            }

            if(foundBaseElement && foundBaseElement.minValue && element.minValue !== foundBaseElement.minValue){
              messages.push({
                severity: Severities.Error,
                location: `StructureDefinition.differential.element[${index + 1}]`,
                resourceId: structureDefinition.id,
                message: `The constrained element binding\'s min value cannot anything other than the base element binding's min value. Constrained element binding's min value is ${element.minValue} while the base element binding's min value is ${foundBaseElement.minValue}.`
              });
            }

            if(foundBaseElement && foundBaseElement.maxValue && element.maxValue !== foundBaseElement.maxValue){
              messages.push({
                severity: Severities.Error,
                location: `StructureDefinition.differential.element[${index + 1}]`,
                resourceId: structureDefinition.id,
                message: `The constrained element binding\'s max value cannot anything other than the base element binding's max value. Constrained element binding's max value is ${element.maxValue} while the base element binding's max value is ${foundBaseElement.maxValue}.`
              });
            }

          });
        }

        return messages;    
    }

    public validateResource(resource: any, extraData?: any): ValidatorMessage[] {
        if (!resource) {
            return;
        }

        if (resource.resourceType === 'ImplementationGuide') {
            return this.validateGenerateImplementationGuide(resource);
        } else if (resource.resourceType === 'StructureDefinition') {
            return this.validateGenericStructureDefinition(resource, extraData);
        }
    }

    public abstract validateImplementationGuide(implementationGuide: any): ValidatorMessage[];
}
