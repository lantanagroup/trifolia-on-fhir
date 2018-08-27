import {DomainResource} from './stu3/fhir';
import {FhirVersion} from './fhir-version';

export class FileModel {
    name: string;
    content: string;
    resource: DomainResource;
    isXml: boolean;
    fhirVersion: FhirVersion;
}
