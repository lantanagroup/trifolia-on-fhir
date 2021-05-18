import {HtmlExporter} from './html';
import {PackageResourceComponent, PageComponent, ImplementationGuide as STU3ImplementationGuide} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import * as path from 'path';
import * as fs from 'fs-extra';
import {parseReference} from '../../../../../libs/tof-lib/src/lib/helper';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent, ImplementationGuideResourceComponent} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {IgPageHelper} from '../../../../../libs/tof-lib/src/lib/ig-page-helper';

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
        const idExt = (dependencyExt.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-dependency-id']);
        // TODO: capture ID extension

        return {
          uri: locationExt ? locationExt.valueUri : undefined,
          packageId: nameExt ? nameExt.valueString : undefined,
          version: versionExt ? versionExt.valueString : undefined,
          id: idExt ? idExt.valueUri : undefined
          // TODO: Output ID from extension
        }
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

  protected populatePageInfos() {
    this.pageInfos = IgPageHelper.getSTU3PagesList([], this.stu3ImplementationGuide.page, this.stu3ImplementationGuide);
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
      const content = `${pageInfo.content || 'No content has been specified for this page.'}`;

      fs.writeFileSync(newPagePath, content);
    }

    (page.page || []).forEach((subPage) => this.writePage(pagesPath, subPage, level + 1));
  }
}
