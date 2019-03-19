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

    public validateResource(resource: any): ValidatorMessage[] {
        if (!resource) {
            return;
        }

        if (resource.resourceType === 'ImplementationGuide') {
            return this.validateGenerateImplementationGuide(resource);
        }
    }

    public abstract validateImplementationGuide(implementationGuide: any): ValidatorMessage[];
}