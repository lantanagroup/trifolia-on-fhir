import { browser, by, element } from 'protractor';

export class HomePage {
  private getWelcomeText() {
    return element(by.css('#welcomeDiv h2')).getText() as Promise<string>;
  }

  private getWhatsNewText() {
    return element(by.css('#whatsNewDiv h2')).getText() as Promise<string>;
  }

  async testHome() {
    const welcomeText = await this.getWelcomeText();
    const whatsNewText = await this.getWhatsNewText();
    expect(welcomeText).toEqual('Welcome');
    expect(whatsNewText).toEqual('What\'s New');
  }
}
