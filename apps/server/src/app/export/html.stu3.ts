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

  private writePage(pagesPath: string, page: PageComponent, level: number, tocEntries: TableOfContentsEntry[]) {
    const pageInfo = this.pageInfos.find(next => next.page === page);
    const pageIndex = this.pageInfos.indexOf(pageInfo);
    const previousPage = pageIndex === 0 ? null : this.pageInfos[pageIndex - 1];
    const nextPage = pageIndex === this.pageInfos.length - 1 ? null : this.pageInfos[pageIndex + 1];
    const previousPageLink = previousPage && previousPage.finalFileName ?
      `[Previous Page](${previousPage.finalFileName})\n\n` :
      undefined;
    const nextPageLink = nextPage && nextPage.finalFileName ?
      `\n\n[Next Page](${nextPage.finalFileName})` :
      undefined;

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
        `---\n\n${previousPageLink || ''}${pageInfo.content}${nextPageLink || ''}`;

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
