import {ValidatorMessage} from 'fhir/validator';
import {FhirService} from '../fhir.service';

export abstract class CustomValidator {
    protected fhirService: FhirService;

    protected constructor(fhirService: FhirService) {
        this.fhirService = fhirService;
    }

    public abstract validateImplementationGuide(implementationGuide: any): ValidatorMessage[];
}