import {PageComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuidePageComponent} from '../../../../../libs/tof-lib/src/lib/r4/fhir';

export interface TableOfContentsEntry {
  level: number;
  fileName: string;
  title: string;
}

export interface FhirControlDependency {
  location: string;
  name: string;
  version: string;
  package: string;
}

export interface FhirControl {
  tool: string;
  source: string;
  'npm-name': string;
  license: string;
  paths: {
    qa: string;
    temp: string;
    output: string;
    txCache: string;
    specification: string;
    pages: string[];
    resources: string[];
  };
  version?: string;
  'fixed-business-version'?: string;
  pages: string[];
  'extension-domains': string[];
  'allowed-domains': string[];
  'sct-edition': string;
  canonicalBase: string;
  defaults?: {
    [key: string]: {
      'template-base'?: string;
      'template-mappings'?: string;
      'template-defns'?: string;
      'template-format'?: string;
      content?: boolean;
      script?: boolean;
      profiles?: boolean;
    };
  };
  dependencyList?: FhirControlDependency[];
  resources?: {
    [key: string]: {
      base?: string;
      defns?: string;
    };
  };
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
