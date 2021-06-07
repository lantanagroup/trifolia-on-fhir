import {ImplementationGuide as R4ImplementationGuide, ImplementationGuidePageComponent} from './r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide, ContactDetail, PageComponent} from './stu3/fhir';
import {IExtension, IImplementationGuide} from './fhirInterfaces';
import {createTableFromArray, escapeForXml} from './helper';
import {Globals} from './globals';

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
      const authorsData = (<any> implementationGuide.contact || []).map((contact: ContactDetail) => {
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

  public static getSTU3PagesList(theList: PageInfo[], page: PageComponent, implementationGuide: STU3ImplementationGuide) {
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

    (page.page || []).forEach((next) => IgPageHelper.getSTU3PagesList(theList, next, implementationGuide));

    return theList;
  }

  public static getR4PagesList(theList: PageInfo[], page: ImplementationGuidePageComponent, implementationGuide: R4ImplementationGuide) {
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

    (page.page || []).forEach((next) => this.getR4PagesList(theList, next, implementationGuide));

    return theList;
  }

  public static getMenuContent(pageInfos: PageInfo[]) {
    const allPageMenuNames = pageInfos
      .filter(pi => {
        const extensions = <IExtension[]>(pi.page.extension || []);
        const extension = extensions.find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
        return !!extension && extension.valueString;
      })
      .map(pi => {
        const extensions = <IExtension[]>(pi.page.extension || []);
        const extension = extensions.find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
        return escapeForXml(extension.valueString);
      });
    const distinctPageMenuNames = allPageMenuNames.reduce((init, next) => {
      if (init.indexOf(next) < 0) init.push(next);
      return init;
    }, []);
    const pageMenuContent = distinctPageMenuNames.map(pmn => {
      const menuPages = pageInfos
        .filter(pi => {
          const extensions = <IExtension[]>(pi.page.extension || []);
          const extension = extensions.find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
          return extension && extension.valueString === pmn && pi.fileName;
        });

      if (menuPages.length === 1) {
        const title = escapeForXml(menuPages[0].title);
        const fileName = menuPages[0].fileName.substring(0, menuPages[0].fileName.lastIndexOf('.')) + '.html';
        return `  <li><a href="${fileName}">${title}</a></li>\n`;
      } else {
        const pageMenuItems = menuPages
          .map(pi => {
            const title = escapeForXml(pi.title);
            const fileName = pi.fileName.substring(0, pi.fileName.lastIndexOf('.')) + '.html';
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
      '  <li><a href="artifacts.html">Artifact Index</a></li>\n' +
      '</ul>\n';
  }
}
