import {DomainResource} from './stu3/fhir';

export class FileModel {
    name: string;
    content: string;
    resource: DomainResource;
    isXml: boolean;
    fhirVersion: string;
}
