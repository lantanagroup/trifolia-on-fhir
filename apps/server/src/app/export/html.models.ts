import {PageComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuidePageComponent} from '../../../../../libs/tof-lib/src/lib/r4/fhir';

export interface FhirControlDependency {
  location: string;
  name: string;
  version: string;
  package: string;
}

export class ExportResults {
  rootPath: string;
  packageId: string;
}
