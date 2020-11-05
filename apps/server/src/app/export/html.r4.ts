import {HtmlExporter} from './html';
import {PageInfo} from './html.models';
import {
  Binary as R4Binary,
  DomainResource,
  ImplementationGuide,
  ImplementationGuidePageComponent,
  ImplementationGuideResourceComponent
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import * as path from 'path';
import * as fs from 'fs-extra';
import {createTableFromArray, parseReference} from '../../../../../libs/tof-lib/src/lib/helper';
import {ContactDetail, StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {Formats} from '../models/export-options';
import {ExceptionHandler} from '@nestjs/core/errors/exception-handler';
import {HttpException, HttpStatus} from '@nestjs/common';

export class R4HtmlExporter extends HtmlExporter {
  /**
   * Removes Media resources from the implementation guide that are not an example.
   * Those Media resources are meant to be exported as images in the file
   * structure, rather than actual Media resources.
   */
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

  private writePage(pagesPath: string, page: ImplementationGuidePageComponent, level: number) {
    const pageInfo = this.pageInfos.find(next => next.page === page);
    const pageInfoIndex = this.pageInfos.indexOf(pageInfo);
    const previousPage = pageInfoIndex > 0 ? this.pageInfos[pageInfoIndex - 1] : null;
    const nextPage = pageInfoIndex < this.pageInfos.length - 1 ? this.pageInfos[pageInfoIndex + 1] : null;
    const fileName = pageInfo.fileName;

    const previousPageLink = previousPage && previousPage.finalFileName && previousPage.title ?
      `[Previous Page - ${previousPage.title}](${previousPage.finalFileName})\n\n` :
      undefined;
    const nextPageLink = nextPage && nextPage.finalFileName && nextPage.title ?
      `\n\n[Next Page - ${nextPage.title}](${nextPage.finalFileName})` :
      undefined;

    if (pageInfo.fileName) {
      const pagesPathFiles = fs.readdirSync(pagesPath);
      const foundExistingPage = pagesPathFiles.find(y => y.toLowerCase() === pageInfo.fileName.toLowerCase());

      if (foundExistingPage) {
        this.sendSocketMessage('progress', `Removing pre-existing framework/template file ${foundExistingPage} to be replaced by a narrative page in the IG.`);
        const removePagePath = path.join(pagesPath, foundExistingPage);
        fs.unlinkSync(removePagePath);
        pageInfo.fileName = foundExistingPage;
      }

      const newPagePath = path.join(pagesPath, fileName);

      fs.writeFileSync(newPagePath, `${previousPageLink || ''}${pageInfo.content || 'No content has been specified for this page.'}${nextPageLink || ''}`);
    }

    (page.page || []).forEach((subPage) => this.writePage(pagesPath, subPage, level + 1));
  }

  public static getPagesList(theList: PageInfo[], page: ImplementationGuidePageComponent, implementationGuide: ImplementationGuide) {
    if (!page) {
      return theList;
    }

    const pageInfo = new PageInfo();
    pageInfo.page = page;
    pageInfo.fileName = page.fileName || page.nameUrl;

    if (page.reuseDescription) {
      pageInfo.content = this.getIndexContent(implementationGuide);
    } else {
      pageInfo.content = page.contentMarkdown || 'No content has been defined for this page, yet.';
    }

    theList.push(pageInfo);

    (page.page || []).forEach((next) => this.getPagesList(theList, next, implementationGuide));

    return theList;
  }

  protected populatePageInfos() {
    if (!this.r4ImplementationGuide.definition) {
      this.pageInfos = [];
      return;
    }

    // Ensure that the implementation guide has an index page
    if (!this.r4ImplementationGuide.definition.page) {
      this.r4ImplementationGuide.definition.page = new ImplementationGuidePageComponent();
      this.r4ImplementationGuide.definition.page.setTitle('Home Page');
      this.r4ImplementationGuide.definition.page.fileName = 'index.md';
      this.r4ImplementationGuide.definition.page.reuseDescription = true;
      this.r4ImplementationGuide.definition.page.generation = 'markdown';
    }

    this.pageInfos = R4HtmlExporter.getPagesList([], this.r4ImplementationGuide.definition ? this.r4ImplementationGuide.definition.page : null, this.r4ImplementationGuide);
  }

  protected prepareImplementationGuide(): DomainResource {
    super.prepareImplementationGuide();

    this.r4ImplementationGuide.fhirVersion = [this.getOfficialFhirVersion()];

    if (!this.r4ImplementationGuide.definition) {
      this.r4ImplementationGuide.definition = {
        resource: []
      };
    }

    this.r4ImplementationGuide.definition.parameter = this.r4ImplementationGuide.definition.parameter || [];
    this.r4ImplementationGuide.definition.resource = this.r4ImplementationGuide.definition.resource || [];

    // Make sure the resources in the IG have a description
    this.r4ImplementationGuide.definition.resource.forEach(r => {
      if (!r.description && r.reference && r.reference.reference) {
        const parsedReference = parseReference(r.reference.reference);
        const foundResourceEntry = this.bundle.entry.find(e => e.resource && e.resource.resourceType === parsedReference.resourceType && e.resource.id === parsedReference.id);

        if (foundResourceEntry) {
          const foundResource: any = foundResourceEntry.resource;

          if (foundResource.description) {
            r.description = foundResource.description;
          }
        }
      }
    });

    // The copyrightyear and releaselabel parameters are required parameters for the IG Publisher
    let copyrightYearParam = this.r4ImplementationGuide.definition.parameter.find(p => p.code && p.code.toLowerCase() === 'copyrightyear');
    let releaseLabelParam = this.r4ImplementationGuide.definition.parameter.find(p => p.code && p.code.toLowerCase() === 'releaselabel');

    if (!copyrightYearParam) {
      copyrightYearParam = {
        code: 'copyrightyear',
        value: '2020+'
      };
      this.r4ImplementationGuide.definition.parameter.push(copyrightYearParam);
    }

    if (!releaseLabelParam) {
      releaseLabelParam = {
        code: 'releaselabel',
        value: 'CI Build'
      };
      this.r4ImplementationGuide.definition.parameter.push(releaseLabelParam);
    }

    return this.r4ImplementationGuide;
  }

  protected updateTemplates(rootPath: string, bundle) {
    if (!this.r4ImplementationGuide.definition) {
      this.r4ImplementationGuide.definition = {
        resource: []
      };
    }

    this.r4ImplementationGuide.definition.parameter = this.r4ImplementationGuide.definition.parameter || [];

    super.updateTemplates(rootPath, bundle);
  }

  protected writePages(rootPath: string) {
    if (!this.r4ImplementationGuide.definition.page) return;

    const pagesPath = path.join(rootPath, 'input/pagecontent');
    fs.ensureDirSync(pagesPath);

    if (this.r4ImplementationGuide.definition.page) {
      this.writePage(pagesPath, this.r4ImplementationGuide.definition.page, 1);
    }
  }
}
