import {HtmlExporter} from './html';
import {PageInfo} from './html.models';
import {Binary as STU3Binary, DomainResource, PackageResourceComponent, PageComponent, StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import * as path from 'path';
import * as fs from 'fs-extra';
import {parseReference} from '../../../../../libs/tof-lib/src/lib/helper';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent, ImplementationGuideResourceComponent} from '../../../../../libs/tof-lib/src/lib/r4/fhir';

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

  protected prepareImplementationGuide(): R4ImplementationGuide {
    super.prepareImplementationGuide();

    const getPage = (stu3Page: PageComponent): ImplementationGuidePageComponent => {
      if (!stu3Page) return;

      const ret = new ImplementationGuidePageComponent();
      ret.title = stu3Page.title;
      ret.generation = stu3Page.format;

      if (stu3Page.extension && stu3Page.extension.length > 0) {
        ret.extension = stu3Page.extension;
      }

      if (stu3Page.page) {
        ret.page = stu3Page.page.map(nextPage => getPage(nextPage));
      }

      if (stu3Page.source) {
        ret.nameUrl = stu3Page.source;
      }

      return ret;
    };

    const newIg = new R4ImplementationGuide();
    newIg.id = this.stu3ImplementationGuide.id;
    newIg.url = this.stu3ImplementationGuide.url;
    newIg.fhirVersion = [this.getOfficialFhirVersion()];
    newIg.packageId = `hl7.fhir.${newIg.id}`;

    newIg.definition = {
      resource: [],
      page: getPage(this.stu3ImplementationGuide.page)
    };

    // Convert ImplementationGuide.package.resource to ImplementationGuide.definition.resource
    this.stu3ImplementationGuide.package.forEach(p => {
      newIg.definition.resource = newIg.definition.resource.concat((p.resource || []).map(r => {
        const ret = new ImplementationGuideResourceComponent();

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

        return ret;
      }));
    });

    return newIg;
  }

  protected populatePageInfos() {
    // Flatten the hierarchy of pages into a single array that we can use to determine previous and next pages
    const getPagesList = (theList: PageInfo[], page: PageComponent) => {
      if (!page) {
        return theList;
      }

      if (page.source && !page.source.startsWith('http://') && !page.source.startsWith('https://')) {
        const contentExtension = (page.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-ig-page-content']);

        const pageInfo = new PageInfo();
        pageInfo.page = page;
        pageInfo.fileName = Globals.getCleanFileName(page.source);

        // the page in the ImplementationGuide should be what we want the page to output as
        // while the file might have a different extension
        const extension = page.source.substring(page.source.lastIndexOf('.'));
        page.source = page.source.substring(0, page.source.lastIndexOf('.')) + '.html';

        if (!page.format) {
          switch (extension) {
            case '.md':
              page.format = 'markdown';
              break;
            case '.html':
              page.format = 'html';
              break;
          }
        }

        if (contentExtension && contentExtension.valueReference && contentExtension.valueReference.reference && page.source) {
          const reference = contentExtension.valueReference.reference;

          if (reference.startsWith('#')) {
            const contained = (this.stu3ImplementationGuide.contained || []).find((next: DomainResource) => next.id === reference.substring(1));
            const binary = contained && contained.resourceType === 'Binary' ? <STU3Binary>contained : undefined;

            if (binary) {
              if (binary.content) {
                pageInfo.content = Buffer.from(binary.content, 'base64').toString();
              } else {
                pageInfo.content = 'No content has been specified for this page.';
              }
            }
          }
        }

        theList.push(pageInfo);
      }

      (page.page || []).forEach((next) => getPagesList(theList, next));

      return theList;
    };

    if (!this.stu3ImplementationGuide.page || !this.stu3ImplementationGuide.page.source || !this.stu3ImplementationGuide.page.source.startsWith('index.')) {
      const originalFirstPage = this.stu3ImplementationGuide.page;
      this.stu3ImplementationGuide.page = {
        title: 'IG Home Page',
        source: 'index.html',
        kind: 'page',
        format: 'markdown',
        page: originalFirstPage ? [originalFirstPage] : []
      };
    }

    this.pageInfos = getPagesList([], this.stu3ImplementationGuide.page);
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
