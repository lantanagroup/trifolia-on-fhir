import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getWelcomeText() {
    return element(by.css('#welcomeDiv h2')).getText() as Promise<string>;
  }

  getWhatsNewText() {
    return element(by.css('#whatsNewDiv h2')).getText() as Promise<string>;
  }
}
