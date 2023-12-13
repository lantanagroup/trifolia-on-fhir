import {ImplementationGuide as R5ImplementationGuide, ImplementationGuideDefinitionPage} from './r5/fhir';
import {ImplementationGuide, ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent} from './r4/fhir';
import {ContactDetail, ImplementationGuide as STU3ImplementationGuide, PageComponent} from './stu3/fhir';
import {IExtension, IImplementationGuide} from './fhirInterfaces';
import {createTableFromArray, escapeForXml} from './helper';
import {Globals} from './globals';
import {IFhirResource, INonFhirResource, IProjectResourceReference, NonFhirResource, Page} from '@trifolia-fhir/models';
import {FhirServerVersion} from '../../../../apps/server/src/app/server.decorators';
import {FhirResource} from '../../../../apps/server/src/app/fhir-resources/fhir-resource.schema';

export class PageInfo {
  page: PageComponent | ImplementationGuidePageComponent | ImplementationGuideDefinitionPage;
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

export class IgPageHelper {

  protected static getIndexContent(implementationGuide: IImplementationGuide) {
    let content = '### Overview\n\n';

    if (implementationGuide.description) {
      const descriptionContent = implementationGuide.description + '\n\n';
      content += descriptionContent + '\n\n';
    } else {
      content += 'This implementation guide does not have a description, yet.\n\n';
    }

    if (implementationGuide.contact) {
      const authorsData = (<any>implementationGuide.contact || []).map((contact: ContactDetail) => {
        const foundEmail = (contact.telecom || []).find(t => t.system === 'email');
        const foundURL = (contact.telecom || []).find(t => t.system === 'url');

        let display: string;

        if (foundEmail) {
          display = `<a href="mailto:${foundEmail.value}">${foundEmail.value}</a>`;
        } else if (foundURL) {
          display = `<a href="${foundURL.value}" target="_new">${foundURL.value}</a>`;
        }

        return [contact.name, display || ''];
      });
      const authorsContent = '### Authors\n\n' + createTableFromArray(['Name', 'Email/URL'], authorsData) + '\n\n';
      content += authorsContent;
    }

    return content;
  }

  public static getSTU3PagesList(theList: PageInfo[], pages: Page[], page: PageComponent, implementationGuide: STU3ImplementationGuide) {
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

      // get the resource page
      let pageFound = (pages || []).find(pageElem => pageElem.name == ((page.source.lastIndexOf('.') > 0) ? page.source.slice(0, page.source.indexOf('.')) : page.source));

      if (pageFound && pageFound['reuseDescription']) {
        pageInfo.content = this.getIndexContent(implementationGuide);
      } else {
        pageInfo.content = pageFound?.content || 'No content has been defined for this page, yet.';
      }

      theList.push(pageInfo);
    }

    (page.page || []).forEach((next) => IgPageHelper.getSTU3PagesList(theList, pages, next, implementationGuide));

    return theList;
  }

  public static getR4andR5PagesList(theList: PageInfo[], pages: Page[], page: ImplementationGuidePageComponent | ImplementationGuideDefinitionPage, implementationGuide: R4ImplementationGuide | R5ImplementationGuide) {
    if (!page) {
      return theList;
    }

    const pageInfo = new PageInfo();
    pageInfo.page = page;
    pageInfo.fileName = page.fileName;

    let pageName = "";
    let name = page.nameUrl ?? page.nameReference?.reference;
    if(name){
      pageName = name;
      let index = name.indexOf('.');
      if (index > -1) {
        pageName = pageName.slice(0, index);
      }
    }
    // get the resource page
    let pageFound = (pages || []).find(pageElem => pageElem.name == pageName);

    if (pageFound && pageFound['reuseDescription']) {
      pageInfo.content = this.getIndexContent(implementationGuide);
    } else {
      pageInfo.content = pageFound?.content || 'No content has been defined for this page, yet.';
    }

    theList.push(pageInfo);

    (page.page || []).forEach((next) => this.getR4andR5PagesList(theList, pages, next, implementationGuide));

    return theList;
  }

  public static getMenuContent(pages: Page[], res: IFhirResource) {

    let ig;
    if (res.fhirVersion === 'r4') {
      ig = <R4ImplementationGuide>res.resource;
    }
    else if (res.fhirVersion === 'r5') {
      ig = <R5ImplementationGuide>res.resource;
    }
    else if (res.fhirVersion === 'stu3') {
      ig = <STU3ImplementationGuide>res.resource;
    }

    function findPage(page, searchPageName) {
      let result;
      let pageName = page.nameUrl ?? page.nameReference?.reference ?? '';
      if (pageName && pageName.indexOf('.') > -1) {
        pageName = pageName.substring(0, pageName.indexOf('.'));
      }
      if (pageName === searchPageName) {
        return page;
      } else {
        if (page.page) {
          for (let i = 0; i < page.page.length; i++) {
            result = findPage(page.page[i], searchPageName);
            if (result !== false) {
              return result;
            }
          }
        }
        return false;
      }
    }

    const allPageMenuNames = pages
      .filter(pg => !!pg.navMenu)
      .map(pg => escapeForXml(pg.navMenu));

    const distinctPageMenuNames = allPageMenuNames.reduce((init, next) => {
      if (init.indexOf(next) < 0) init.push(next);
      return init;
    }, []);

    const pageMenuContent = distinctPageMenuNames.map(pmn => {
      const menuPages = pages
        .filter(pi => {
          return pi.navMenu && pi.navMenu === pmn;
        });

      if (menuPages.length === 1) {

        let result = findPage(ig.definition.page, menuPages[0].name);
        const title = escapeForXml(result.title);
        const fileName = menuPages[0].name + '.html';
        return `  <li><a href="${fileName}">${title}</a></li>\n`;
      } else {
        const pageMenuItems = menuPages
          .map(pi => {
            let result = findPage(ig.definition.page, pi.name);
            const title = escapeForXml(result.title);
            const fileName = pi.name + '.html';
            return `      <li><a href="${fileName}">${title}</a></li>`;   // TODO: Should not show fileName
          });

        return '  <li class="dropdown">\n' +
          `    <a data-toggle="dropdown" href="#" class="dropdown-toggle">${pmn}<b class="caret">\n` +
          '      </b>\n' +
          '    </a>\n' +
          '    <ul class="dropdown-menu">\n' + pageMenuItems.join('\n') +
          '    </ul>\n' +
          '  </li>';
      }
    });

    return '<ul xmlns="http://www.w3.org/1999/xhtml" class="nav navbar-nav">\n' +
      '  <li><a href="index.html">IG Home</a></li>\n' +
      '  <li><a href="toc.html">Table of Contents</a></li>\n' + pageMenuContent.join('\n') +
      '  <li><a href="artifacts.html">Artifacts</a></li>\n' +
      '</ul>\n';
  }
}
