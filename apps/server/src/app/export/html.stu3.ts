import {HtmlExporter} from './html';
import {PageInfo} from './html.models';
import {
  Binary as STU3Binary, ContactDetail,
  DomainResource,
  ImplementationGuide,
  PackageResourceComponent,
  PageComponent,
  StructureDefinition
} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import * as path from 'path';
import * as fs from 'fs-extra';
import {createTableFromArray, parseReference} from '../../../../../libs/tof-lib/src/lib/helper';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent, ImplementationGuideResourceComponent} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {release} from 'os';

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

  private ensureParameterExtensions() {
    this.stu3ImplementationGuide.extension = this.stu3ImplementationGuide.extension || [];
    const parameters = this.stu3ImplementationGuide.extension.filter(e => {
      return e.url === Globals.extensionUrls['extension-ig-parameter'] &&
        e.extension &&
        !!e.extension.find(n => n.url === 'code') &&
        !!e.extension.find(n => n.url === 'value');
    });

    let releaseLabel = parameters.find(e => {
      const code = e.extension.find(n => n.url === 'code').valueString;
      return code === 'releaselabel';
    });

    if (!releaseLabel) {
      releaseLabel = {
        url: Globals.extensionUrls['extension-ig-parameter'],
        extension: [{
          url: 'code',
          valueString: 'releaselabel'
        }, {
          url: 'value',
          valueString: 'CI Build'
        }]
      };
      this.stu3ImplementationGuide.extension.push(releaseLabel);
    }

    let copyrightYear = parameters.find(e => {
      const code = e.extension.find(n => n.url === 'code').valueString;
      return code === 'copyrightyear';
    });

    if (!copyrightYear) {
      copyrightYear = {
        url: Globals.extensionUrls['extension-ig-parameter'],
        extension: [{
          url: 'code',
          valueString: 'copyrightyear'
        }, {
          url: 'value',
          valueString: '2020+'
        }]
      };
      this.stu3ImplementationGuide.extension.push(copyrightYear);
    }
  }

  protected prepareImplementationGuide(): R4ImplementationGuide {
    super.prepareImplementationGuide();

    this.ensureParameterExtensions();

    const getPage = (stu3Page: PageComponent): ImplementationGuidePageComponent => {
      if (!stu3Page) return;

      const ret = new ImplementationGuidePageComponent();
      ret.title = stu3Page.title;
      ret.generation = stu3Page.format || 'markdown';
      ret.nameUrl = stu3Page.source;

      if (stu3Page.extension && stu3Page.extension.length > 0) {
        ret.extension = stu3Page.extension;
      }

      if (stu3Page.page) {
        ret.page = stu3Page.page.map(nextPage => getPage(nextPage));
      }

      return ret;
    };

    const parameters = this.stu3ImplementationGuide.extension.filter(e => {
      return e.url === Globals.extensionUrls['extension-ig-parameter'] &&
        e.extension &&
        !!e.extension.find(n => n.url === 'code') &&
        !!e.extension.find(n => n.url === 'value');
    });

    const newIg = new R4ImplementationGuide();
    newIg.id = this.stu3ImplementationGuide.id;
    newIg.url = this.stu3ImplementationGuide.url;
    newIg.fhirVersion = [this.getOfficialFhirVersion()];
    newIg.packageId = `hl7.fhir.${newIg.id}`;
    newIg.contact = this.stu3ImplementationGuide.contact;
    newIg.version = this.stu3ImplementationGuide.version;
    newIg.description = this.stu3ImplementationGuide.description;
    newIg.name = this.stu3ImplementationGuide.name;

    // Dependencies
    newIg.dependsOn = (this.stu3ImplementationGuide.extension || [])
      .filter(e => e.url === Globals.extensionUrls['extension-ig-dependency'])
      .map(dependencyExt => {
        const versionExt = (dependencyExt.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-dependency-version']);
        const nameExt = (dependencyExt.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-dependency-name']);
        const locationExt = (dependencyExt.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-dependency-location']);

        return {
          uri: locationExt ? locationExt.valueUri : undefined,
          packageId: nameExt ? nameExt.valueString : undefined,
          version: versionExt ? versionExt.valueString : undefined
        };
      });

    const foundPackageExtension = (this.stu3ImplementationGuide.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-package-id']);
    if (foundPackageExtension && foundPackageExtension.valueString) {
      newIg.packageId = foundPackageExtension.valueString;
    }

    newIg.definition = {
      resource: [],
      page: getPage(this.stu3ImplementationGuide.page),
      parameter: parameters.map(p => {
        const code = p.extension.find(e => e.url === 'code').valueString;
        const value = p.extension.find(e => e.url === 'value').valueString;
        return {
          code: code,
          value: value
        };
      })
    };

    // Convert ImplementationGuide.package.resource to ImplementationGuide.definition.resource
    (this.stu3ImplementationGuide.package || []).forEach(p => {
      newIg.definition.resource = newIg.definition.resource.concat((p.resource || []).map(r => {
        const ret = new ImplementationGuideResourceComponent();
        ret.extension = r.extension;
        ret.description = r.description;
        ret.name = r.name;

        if (r.sourceReference) {
          ret.reference = {
            reference: r.sourceReference.reference,
            display: r.sourceReference.display
          };
        } else if (r.sourceUri) {
          ret.reference = {
            reference: r.sourceUri
          };
        }

        if (r.hasOwnProperty('example')) {
          ret.exampleBoolean = r.example;
        } else if (r.exampleFor) {
          ret.exampleBoolean = true;
        }

        if (!ret.description && ret.reference && ret.reference.reference) {
          const parsedReference = parseReference(ret.reference.reference);
          const foundResourceEntry = this.bundle.entry.find(e => e.resource && e.resource.resourceType === parsedReference.resourceType && e.resource.id === parsedReference.id);

          if (foundResourceEntry) {
            const foundResource: any = foundResourceEntry.resource;

            if (foundResource.description) {
              ret.description = foundResource.description;
            }
          }
        }

        return ret;
      }));
    });

    return newIg;
  }

  public static getPagesList(theList: PageInfo[], page: PageComponent, implementationGuide: ImplementationGuide) {
    if (!page) {
      return theList;
    }

    if (page.source && !page.source.startsWith('http://') && !page.source.startsWith('https://')) {
      const contentExtension = (page.extension || []).find((ext) => ext.url === Globals.extensionUrls['extension-ig-page-content']);

      const pageInfo = new PageInfo();
      pageInfo.page = page;

      if (page.source) {
        if (page.source.lastIndexOf('.') > 0) {
          pageInfo.fileName = page.source.substring(0, page.source.lastIndexOf('.')) + page.getExtension();
        } else {
          pageInfo.fileName = page.source;
        }
      }

      if (page.reuseDescription) {
        pageInfo.content = this.getIndexContent(implementationGuide);
      } else {
        pageInfo.content = page.contentMarkdown || 'No content has been defined for this page, yet.';
      }

      theList.push(pageInfo);
    }

    (page.page || []).forEach((next) => STU3HtmlExporter.getPagesList(theList, next, implementationGuide));

    return theList;
  }

  protected populatePageInfos() {
    this.pageInfos = STU3HtmlExporter.getPagesList([], this.stu3ImplementationGuide.page, this.stu3ImplementationGuide);
  }

  protected writePages(rootPath: string) {
    const rootPageInfo = this.pageInfos.length > 0 ? this.pageInfos[0] : null;

    if (rootPageInfo) {
      const pagesPath = path.join(rootPath, 'input/pagecontent');
      fs.ensureDirSync(pagesPath);

      this.writePage(pagesPath, <PageComponent> rootPageInfo.page, 1);
    }
  }

  private writePage(pagesPath: string, page: PageComponent, level: number) {
    const pageInfo = this.pageInfos.find(next => next.page === page);
    const pageIndex = pageInfo ? this.pageInfos.indexOf(pageInfo) : -1;
    const previousPage = pageIndex === 0 ? null : this.pageInfos[pageIndex - 1];
    const nextPage = pageIndex === this.pageInfos.length - 1 ? null : this.pageInfos[pageIndex + 1];
    const previousPageLink = previousPage && previousPage.finalFileName && previousPage.title ?
      `[Previous Page - ${previousPage.title}](${previousPage.finalFileName})\n\n` :
      undefined;
    const nextPageLink = nextPage && nextPage.finalFileName && nextPage.title ?
      `\n\n[Next Page - ${nextPage.title}](${nextPage.finalFileName})` :
      undefined;

    if (pageInfo && page.kind !== 'toc') {
      const pagesPathFiles = fs.readdirSync(pagesPath);
      const foundExistingPage = pagesPathFiles.find(y => y.toLowerCase() === pageInfo.fileName.toLowerCase());

      if (foundExistingPage) {
        this.sendSocketMessage('progress', `Removing pre-existing framework/template file ${foundExistingPage} to be replaced by a narrative page in the IG.`);
        const removePagePath = path.join(pagesPath, foundExistingPage);
        fs.unlinkSync(removePagePath);
        pageInfo.fileName = foundExistingPage;
      }

      const newPagePath = path.join(pagesPath, pageInfo.fileName);
      const content = `${previousPageLink || ''}${pageInfo.content || 'No content has been specified for this page.'}${nextPageLink || ''}`;

      fs.writeFileSync(newPagePath, content);
    }

    (page.page || []).forEach((subPage) => this.writePage(pagesPath, subPage, level + 1));
  }
}
