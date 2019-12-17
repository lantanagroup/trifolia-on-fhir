import {HtmlExporter} from './html';
import {FhirControl, PageInfo, TableOfContentsEntry} from './html.models';
import {
  Binary as R4Binary, Bundle as R4Bundle,
  ImplementationGuidePageComponent, ImplementationGuideResourceComponent
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import * as path from "path";
import * as fs from 'fs-extra';
import {createTableFromArray, parseReference} from '../../../../../libs/tof-lib/src/lib/helper';
import {ContactDetail} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';

export class R4HtmlExporter extends HtmlExporter {

  protected removeNonExampleMedia() {
    if (!this.r4ImplementationGuide.definition) {
      return;
    }

    const resourcesToRemove = (this.r4ImplementationGuide.definition.resource || []).filter(resource => {
      if (!resource.reference || !resource.reference.reference) {
        return false;
      }

      const parsed = parseReference(resource.reference.reference);
      return parsed.resourceType === 'Media' && !resource.exampleBoolean && !resource.exampleCanonical;
    });

    resourcesToRemove.forEach(resource => {
      const index = this.r4ImplementationGuide.definition.resource.indexOf(resource);
      this.r4ImplementationGuide.definition.resource.splice(index, index >= 0 ? 1 : 0);
    });
  }

  protected getImplementationGuideResource(resourceType: string, id: string): ImplementationGuideResourceComponent {
    if (this.r4ImplementationGuide.definition) {
      const found = (this.r4ImplementationGuide.definition.resource || [])
        .find(res => res.reference && res.reference.reference === `${resourceType}/${id}`);
      return found;
    }
  }

  private writePage(pagesPath: string, page: ImplementationGuidePageComponent, level: number, tocEntries: TableOfContentsEntry[]) {
    const pageInfo = this.pageInfos.find(next => next.page === page);
    const pageInfoIndex = this.pageInfos.indexOf(pageInfo);
    const previousPage = pageInfoIndex > 0 ? this.pageInfos[pageInfoIndex - 1] : null;
    const nextPage = pageInfoIndex < this.pageInfos.length - 1 ? this.pageInfos[pageInfoIndex + 1] : null;
    const fileName = pageInfo.fileName;

    const previousPageLink = previousPage && previousPage.finalFileName ?
      `[Previous Page](${previousPage.finalFileName})\n\n` :
      undefined;
    const nextPageLink = nextPage && nextPage.finalFileName ?
      `\n\n[Next Page](${nextPage.finalFileName})` :
      undefined;

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

      fs.writeFileSync(newPagePath, `${previousPageLink || ''}${pageInfo.content}${nextPageLink || ''}`);
    }

    // Add an entry to the TOC
    tocEntries.push({level: level, fileName: fileName, title: page.title});
    (page.page || []).forEach((subPage) => this.writePage(pagesPath, subPage, level + 1, tocEntries));
  }

  protected updateTemplates(rootPath: string, bundle) {
    if (!this.r4ImplementationGuide.definition) {
      this.r4ImplementationGuide.definition = {
        resource: []
      };
    }

    if (!this.r4ImplementationGuide.definition.page || this.r4ImplementationGuide.definition.page.nameUrl !== 'index.html') {
      const originalFirstPage = this.r4ImplementationGuide.definition.page;
      this.r4ImplementationGuide.definition.page = {
        title: 'IG Home Page',
        nameUrl: 'index.html',
        generation: 'markdown',
        page: originalFirstPage ? [originalFirstPage] : []
      };
    }

    // always automatically create index.md, it might be overwritten by writePages()
    if (this.r4ImplementationGuide) {
      const pagesPath = path.join(rootPath, 'input/pagecontent');
      fs.ensureDirSync(pagesPath);

      const indexPath = path.join(pagesPath, 'index.md');

      fs.appendFileSync(indexPath, '<a name="intro"> </a>\n### Introduction\n\n');

      if (this.r4ImplementationGuide.description) {
        const descriptionContent = '### Description\n\n' + this.r4ImplementationGuide.description + '\n\n';
        fs.appendFileSync(indexPath, descriptionContent);
      } else {
        fs.appendFileSync(indexPath, 'This implementation guide does not have a description, yet.');
      }

      if (this.r4ImplementationGuide.contact) {
        const authorsData = (<any> this.r4ImplementationGuide.contact || []).map((contact: ContactDetail) => {
          const foundEmail = (contact.telecom || []).find((telecom) => telecom.system === 'email');
          return [contact.name, foundEmail ? `<a href="mailto:${foundEmail.value}">${foundEmail.value}</a>` : ''];
        });
        const authorsContent = '### Authors\n\n' + createTableFromArray(['Name', 'Email'], authorsData) + '\n\n';
        fs.appendFileSync(indexPath, authorsContent);
      }
    }

    super.updateTemplates(rootPath, bundle);
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
    const tocEntries = [];

    const pagesPath = path.join(rootPath, 'input/pagecontent');
    fs.ensureDirSync(pagesPath);

    this.writePage(pagesPath, this.r4ImplementationGuide.definition.page, 1, tocEntries);

    // Append TOC Entries to the toc.md file in the template
    //this.generateTableOfContents(rootPath, tocEntries, this.pageInfos[0].shouldAutoGenerate, {fileName: this.pageInfos[0].fileName, content: this.pageInfos[0].content});
  }
}
