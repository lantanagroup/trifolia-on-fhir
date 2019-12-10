import {HtmlExporter} from './html';
import {FhirControl, FhirControlDependency, PageInfo, TableOfContentsEntry} from './html.models';
import {
  Binary as STU3Binary,
  Bundle as STU3Bundle,
  DomainResource,
  Extension,
  PackageResourceComponent,
  PageComponent
} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import * as path from 'path';
import * as fs from 'fs-extra';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {parseReference} from '../../../../../libs/tof-lib/src/lib/helper';

export class STU3HtmlExporter extends HtmlExporter {
  protected removeNonExampleMedia() {
    (this.stu3ImplementationGuide.package || []).forEach(pkg => {
      const resourcesToRemove = (pkg.resource || []).filter(resource => {
        if (!resource.sourceReference || !resource.sourceReference.reference) {
          return false;
        }

        const parsed = parseReference(resource.sourceReference.reference);
        return parsed.resourceType === 'Media' && !resource.example && !resource.exampleFor;
      });

      resourcesToRemove.forEach(resource => {
        const index = pkg.resource.indexOf(resource);
        pkg.resource.splice(index, index >= 0 ? 1 : 0);
      });
    });
  }

  protected getImplementationGuideResource(resourceType: string, id: string): PackageResourceComponent {
    if (this.stu3ImplementationGuide.package) {
      for (let i = 0; i < this.stu3ImplementationGuide.package.length; i++) {
        const pkg = this.stu3ImplementationGuide.package[i];
        const found = (pkg.resource || [])
          .find(res => res.sourceReference && res.sourceReference.reference === `${resourceType}/${id}`);

        if (found) {
          return found;
        }
      }
    }
  }

  public getControl(bundle: STU3Bundle) {
    const canonicalBaseRegex = /^(.+?)\/ImplementationGuide\/.+$/gm;
    const canonicalBaseMatch = canonicalBaseRegex.exec(this.stu3ImplementationGuide.url);
    const packageIdExtension = (this.stu3ImplementationGuide.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-package-id']);
    let canonicalBase;

    if (!canonicalBaseMatch || canonicalBaseMatch.length < 2) {
      canonicalBase = this.stu3ImplementationGuide.url.substring(0, this.stu3ImplementationGuide.url.lastIndexOf('/'));
    } else {
      canonicalBase = canonicalBaseMatch[1];
    }

    // TODO: Extract npm-name from IG extension.
    // currently, IG resource has to be in XML format for the IG Publisher
    const control = <FhirControl>{
      tool: 'jekyll',
      source: 'implementationguide/' + this.stu3ImplementationGuide.id + '.xml',
      'npm-name': packageIdExtension && packageIdExtension.valueString ? packageIdExtension.valueString : this.stu3ImplementationGuide.id + '-npm',
      license: 'CC0-1.0',                                                         // R4: ImplementationGuide.license
      paths: {
        qa: 'generated_output/qa',
        temp: 'generated_output/temp',
        output: 'output',
        txCache: 'generated_output/txCache',
        specification: 'http://hl7.org/fhir/STU3',
        pages: [
          'framework',
          'source/pages'
        ],
        resources: ['source/resources']
      },
      pages: ['pages'],
      version: '3.0.2',
      'extension-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
      'allowed-domains': ['https://trifolia-on-fhir.lantanagroup.com'],
      'sct-edition': 'http://snomed.info/sct/731000124108',
      'extraTemplates': ['mappings'],
      canonicalBase: canonicalBase,
      defaults: {
        'Location': {'template-base': 'ex.html'},
        'ProcedureRequest': {'template-base': 'ex.html'},
        'Organization': {'template-base': 'ex.html'},
        'MedicationStatement': {'template-base': 'ex.html'},
        'SearchParameter': {'template-base': 'base.html'},
        'StructureDefinition': {
          'template-mappings': 'sd-mappings.html',
          'template-base': 'sd.html',
          'template-defns': 'sd-definitions.html',
          'mappings': 'StructureDefinition-{{[id]}}-mappings.html'
        },
        'Immunization': {'template-base': 'ex.html'},
        'Patient': {'template-base': 'ex.html'},
        'StructureMap': {
          'content': false,
          'script': false,
          'template-base': 'ex.html',
          'profiles': false
        },
        'ConceptMap': {'template-base': 'base.html'},
        'Practitioner': {'template-base': 'ex.html'},
        'OperationDefinition': {'template-base': 'base.html'},
        'CodeSystem': {'template-base': 'base.html'},
        'Communication': {'template-base': 'ex.html'},
        'Any': {
          'template-format': 'format.html',
          'template-base': 'base.html'
        },
        'PractitionerRole': {'template-base': 'ex.html'},
        'ValueSet': {'template-base': 'base.html'},
        'CapabilityStatement': {'template-base': 'base.html'},
        'Observation': {'template-base': 'ex.html'}
      },
      resources: {}
    };

    if (this.stu3ImplementationGuide.version) {
      control['fixed-business-version'] = this.stu3ImplementationGuide.version;
    }

    // Set the dependencyList based on the extensions in the IG
    const dependencyExtensions = (this.stu3ImplementationGuide.extension || []).filter((extension) => extension.url === Globals.extensionUrls['extension-ig-dependency']);

    // R4 ImplementationGuide.dependsOn
    control.dependencyList = dependencyExtensions
      .filter((dependencyExtension) => {
        const locationExtension = (dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-location']);
        const nameExtension = (dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-name']);

        return !!locationExtension && !!locationExtension.valueUri && !!nameExtension && !!nameExtension.valueString;
      })
      .map((dependencyExtension) => {
        const locationExtension = <Extension>(dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-location']);
        const nameExtension = <Extension>(dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-name']);
        const versionExtension = <Extension>(dependencyExtension.extension || []).find((next) => next.url === Globals.extensionUrls['extension-ig-dependency-version']);

        return <FhirControlDependency>{
          location: locationExtension ? locationExtension.valueUri : '',
          name: nameExtension ? nameExtension.valueString : '',
          version: versionExtension ? versionExtension.valueString : ''
        };
      });

    // Define the resources in the control and what templates they should use
    if (bundle && bundle.entry) {
      for (let i = 0; i < bundle.entry.length; i++) {
        const entry = bundle.entry[i];
        const resource = entry.resource;
        const igResource = this.getImplementationGuideResource(resource.resourceType, resource.id);
        const isExample = igResource ? igResource.example || igResource.exampleFor : false;

        // Skip adding the ImplementationGuide and Media images for using the narrative to the control file's resources
        if (resource.resourceType === 'ImplementationGuide' || (resource.resourceType === 'Media' && !isExample)) {
          continue;
        }

        control.resources[resource.resourceType + '/' + resource.id] = {
          base: resource.resourceType + '-' + resource.id + '.html',
          defns: resource.resourceType + '-' + resource.id + '-definitions.html'
        };
      }
    }

    return control;
  }

  private writePage(pagesPath: string, page: PageComponent, level: number, tocEntries: TableOfContentsEntry[]) {
    const pageInfo = this.pageInfos.find(next => next.page === page);
    const pageIndex = this.pageInfos.indexOf(pageInfo);
    const previousPage = pageIndex === 0 ? null : this.pageInfos[pageIndex - 1];
    const nextPage = pageIndex === this.pageInfos.length - 1 ? null : this.pageInfos[pageIndex + 1];
    const previousPageLink = previousPage ?
      `[Previous Page](${previousPage.finalFileName})\n\n` :
      null;
    const nextPageLink = nextPage ?
      `\n\n[Next Page](${nextPage.finalFileName})` :
      null;

    if (page.kind !== 'toc' && pageInfo.content) {
      const pagesPathFiles = fs.readdirSync(pagesPath);
      const foundExistingPage = pagesPathFiles.find(y => y.toLowerCase() === pageInfo.fileName.toLowerCase());

      if (foundExistingPage) {
        this.sendSocketMessage('progress', `Removing pre-existing framework/template file ${foundExistingPage} to be replaced by a narrative page in the IG.`);
        const removePagePath = path.join(pagesPath, foundExistingPage);
        fs.unlinkSync(removePagePath);
        pageInfo.fileName = foundExistingPage;
      }

      const newPagePath = path.join(pagesPath, pageInfo.fileName);

      const content = '---\n' +
        `title: ${page.title}\n` +
        'layout: default\n' +
        `active: ${page.title}\n` +
        `---\n\n${previousPageLink}${pageInfo.content}${nextPageLink}`;

      fs.writeFileSync(newPagePath, content);
    }

    // Add an entry to the TOC
    tocEntries.push({level: level, fileName: page.kind === 'page' && pageInfo.fileName, title: page.title});
    (page.page || []).forEach((subPage) => this.writePage(pagesPath, subPage, level + 1, tocEntries));
  }

  protected writePages(rootPath: string) {
    // Flatten the hierarchy of pages into a single array that we can use to determine previous and next pages
    const getPagesList = (theList: PageInfo[], page: PageComponent) => {
      if (!page) {
        return theList;
      }

      const contentExtension = (page.extension || []).find((extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content');
      const autoGenerateExtension = (page.extension || []).find((extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc');

      const pageInfo = new PageInfo();
      pageInfo.page = page;
      pageInfo.shouldAutoGenerate = autoGenerateExtension && autoGenerateExtension.valueBoolean === true;

      if (contentExtension && contentExtension.valueReference && contentExtension.valueReference.reference && page.source) {
        const reference = contentExtension.valueReference.reference;

        if (reference.startsWith('#')) {
          const contained = (this.stu3ImplementationGuide.contained || []).find((next: DomainResource) => next.id === reference.substring(1));
          const binary = contained && contained.resourceType === 'Binary' ? <STU3Binary>contained : undefined;

          if (binary) {
            pageInfo.fileName = page.source ?
              page.source
                .trim()
                .replace(/—/g, '')
                .replace(/[/\\]/g, '_')
                .replace(/ /g, '_') :
              null;
            pageInfo.content = Buffer.from(binary.content, 'base64').toString();
          }
        }
      }

      theList.push(pageInfo);

      (page.page || []).forEach((next) => getPagesList(theList, next));

      return theList;
    };

    const tocEntries = [];
    this.pageInfos = getPagesList([], this.stu3ImplementationGuide.page);
    const rootPageInfo = this.pageInfos.length > 0 ? this.pageInfos[0] : null;

    if (rootPageInfo) {
      const pagesPath = path.join(rootPath, 'source/pages');
      fs.ensureDirSync(pagesPath);

      this.writePage(pagesPath, <PageComponent> rootPageInfo.page, 1, tocEntries);
      this.generateTableOfContents(rootPath, tocEntries, rootPageInfo.shouldAutoGenerate, rootPageInfo.content);
    }
  }
}
