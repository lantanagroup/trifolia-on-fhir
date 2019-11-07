import {HtmlExporter} from './html';
import {FhirControl, PageInfo, TableOfContentsEntry} from './html.models';
import {
  Binary as R4Binary, Bundle as R4Bundle,
  ImplementationGuidePageComponent, ImplementationGuideResourceComponent
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import * as path from "path";
import * as fs from 'fs-extra';

export class R4HtmlExporter extends HtmlExporter {

  protected getImplementationGuideResource(resourceType: string, id: string): ImplementationGuideResourceComponent {
    if (this.r4ImplementationGuide.definition) {
      const found = (this.r4ImplementationGuide.definition.resource || [])
        .find(res => res.reference && res.reference.reference === `${resourceType}/${id}`);
      return found;
    }
  }

  public getControl(bundle: R4Bundle) {
    const canonicalBaseRegex = /^(.+?)\/ImplementationGuide\/.+$/gm;
    const canonicalBaseMatch = canonicalBaseRegex.exec(this.r4ImplementationGuide.url);
    let canonicalBase;

    if (!canonicalBaseMatch || canonicalBaseMatch.length < 2) {
      canonicalBase = this.r4ImplementationGuide.url.substring(0, this.r4ImplementationGuide.url.lastIndexOf('/'));
    } else {
      canonicalBase = canonicalBaseMatch[1];
    }

    // currently, IG resource has to be in XML format for the IG Publisher
    const control = <FhirControl>{
      tool: 'jekyll',
      source: 'implementationguide/' + this.r4ImplementationGuide.id + '.xml',
      'npm-name': this.r4ImplementationGuide.packageId || this.r4ImplementationGuide.id + '-npm',
      license: this.r4ImplementationGuide.license || 'CC0-1.0',
      paths: {
        qa: 'generated_output/qa',
        temp: 'generated_output/temp',
        output: 'output',
        txCache: 'generated_output/txCache',
        specification: 'http://hl7.org/fhir/R4/',
        pages: [
          'framework',
          'source/pages'
        ],
        resources: ['source/resources']
      },
      pages: ['pages'],
      version: '4.0.1',
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

    if (this.r4ImplementationGuide.fhirVersion && this.r4ImplementationGuide.fhirVersion.length > 0) {
      control.version = this.r4ImplementationGuide.fhirVersion[0];
    }

    if (this.r4ImplementationGuide.version) {
      control['fixed-business-version'] = this.r4ImplementationGuide.version;
    }

    control.dependencyList = (this.r4ImplementationGuide.dependsOn || [])
      .filter((dependsOn) => {
        const locationExtension = (dependsOn.extension || []).find((dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-location');
        const nameExtension = (dependsOn.extension || []).find((dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-name');

        return !!locationExtension && !!locationExtension.valueString && !!nameExtension && !!nameExtension.valueString;
      })
      .map((dependsOn) => {
        const locationExtension = (dependsOn.extension || []).find((dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-location');
        const nameExtension = (dependsOn.extension || []).find((dependencyExtension) => dependencyExtension.url === 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-name');

        return {
          location: locationExtension ? locationExtension.valueString : '',
          name: nameExtension ? nameExtension.valueString : '',
          version: dependsOn.version,
          package: dependsOn.packageId
        };
      });

    // Define the resources in the control and what templates they should use
    if (bundle && bundle.entry) {
      for (let i = 0; i < bundle.entry.length; i++) {
        const entry = bundle.entry[i];
        const resource = entry.resource;

        if (resource.resourceType === 'ImplementationGuide') {
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

  private writePage(pagesPath: string, page: ImplementationGuidePageComponent, level: number, tocEntries: TableOfContentsEntry[]) {
    const pageInfo = this.pageInfos.find(next => next.page === page);
    const pageInfoIndex = this.pageInfos.indexOf(pageInfo);
    const previousPage = pageInfoIndex > 0 ? this.pageInfos[pageInfoIndex - 1] : null;
    const nextPage = pageInfoIndex < this.pageInfos.length - 1 ? this.pageInfos[pageInfoIndex + 1] : null;
    const fileName = pageInfo.fileName;

    const previousPageLink = previousPage ?
      `[Previous Page](${previousPage.finalFileName})\n\n` :
      null;
    const nextPageLink = nextPage ?
      `\n\n[Next Page](${nextPage.finalFileName})` :
      null;

    if (pageInfo.content && pageInfo.fileName) {
      const pagesPathFiles = fs.readdirSync(pagesPath);
      const foundExistingPage = pagesPathFiles.find(y => y.toLowerCase() === pageInfo.fileName.toLowerCase());

      if (foundExistingPage) {
        this.sendSocketMessage('progress', `Removing pre-existing framework/template file ${foundExistingPage} to be replaced by a narrative page in the IG.`);
        const removePagePath = path.join(pagesPath, foundExistingPage);
        fs.unlinkSync(removePagePath);
        pageInfo.fileName = foundExistingPage;
      }

      const newPagePath = path.join(pagesPath, fileName);

      // noinspection JSUnresolvedFunction
      const content = '---\n' +
        `title: ${page.title}\n` +
        'layout: default\n' +
        `active: ${page.title}\n` +
        `---\n\n${previousPageLink}${pageInfo.content}${nextPageLink}`;
      fs.writeFileSync(newPagePath, content);
    }

    // Add an entry to the TOC
    tocEntries.push({level: level, fileName: fileName, title: page.title});
    (page.page || []).forEach((subPage) => this.writePage(pagesPath, subPage, level + 1, tocEntries));
  }

  protected writePages(rootPath: string) {
    // Flatten the hierarchy of pages into a single array that we can use to determine previous and next pages
    const getPagesList = (theList: PageInfo[], page: ImplementationGuidePageComponent) => {
      if (!page) {
        return theList;
      }

      const pageInfo = new PageInfo();
      pageInfo.page = page;

      const autoGenerateExtension = (page.extension || []).find((extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc');
      pageInfo.shouldAutoGenerate = autoGenerateExtension && autoGenerateExtension.valueBoolean === true;

      if (page.nameReference && page.nameReference.reference) {
        const reference = page.nameReference.reference;

        if (reference.startsWith('#')) {
          const contained = (this.r4ImplementationGuide.contained || []).find((contained) => contained.id === reference.substring(1));
          const binary = contained && contained.resourceType === 'Binary' ? <R4Binary>contained : undefined;

          if (binary && binary.data) {
            pageInfo.fileName = page.title
              .trim()
              .replace(/—/g, '')
              .replace(/[/\\]/g, '_')
              .replace(/ /g, '_');

            if (pageInfo.fileName.indexOf('.') < 0) {
              pageInfo.fileName += this.getPageExtension(page);
            }
          }

          if (binary && binary.data) {
            pageInfo.content = Buffer.from(binary.data, 'base64').toString();
          }
        }
      } else if (page.nameUrl) {
        pageInfo.fileName = page.nameUrl;
      }

      theList.push(pageInfo);

      (page.page || []).forEach((next) => getPagesList(theList, next));

      return theList;
    };

    this.pageInfos = getPagesList([], this.r4ImplementationGuide.definition ? this.r4ImplementationGuide.definition.page : null);
    const rootPageInfo = this.pageInfos.length > 0 ? this.pageInfos[0] : null;
    const tocEntries = [];

    if (rootPageInfo) {
      const pagesPath = path.join(rootPath, 'source/pages');
      fs.ensureDirSync(pagesPath);

      this.writePage(pagesPath, this.r4ImplementationGuide.definition.page, 1, tocEntries);

      // Append TOC Entries to the toc.md file in the template
      this.generateTableOfContents(rootPath, tocEntries, rootPageInfo.shouldAutoGenerate, {fileName: rootPageInfo.fileName, content: rootPageInfo.content});
    }
  }
}
