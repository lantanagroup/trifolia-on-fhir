import {DomainResource} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';

export class FileModel {
  name: string;
  content: string;
  resource: DomainResource;
  isXml: boolean;
  fhirVersion: string;
}
