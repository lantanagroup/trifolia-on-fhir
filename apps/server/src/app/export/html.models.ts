import {PageComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuidePageComponent} from '../../../../../libs/tof-lib/src/lib/r4/fhir';

export interface FhirControlDependency {
  location: string;
  name: string;
  version: string;
  package: string;
}

export class PageInfo {
  page: PageComponent | ImplementationGuidePageComponent;
  fileName: string;
  content: string;

  get title() {
    if (this.page) {
      return this.page.title;
    }

    return this.fileName;
  }

  get finalFileName() {
    if (this.fileName && this.fileName.endsWith('.md')) {
      return this.fileName.substring(0, this.fileName.lastIndexOf('.')) + '.html';
    }
  }
}

export class ExportResults {
  rootPath: string;
  packageId: string;
}
