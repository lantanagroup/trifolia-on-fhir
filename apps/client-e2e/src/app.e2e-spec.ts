import { AppPage } from './app.po';
import {protractor, browser, logging, by, element} from 'protractor';

const EC = protractor.ExpectedConditions;

describe('ToF App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', async () => {
    await page.navigateTo();
    await browser.waitForAngularEnabled(false);
    await browser.sleep(1000);      // to finish loading
    const welcomeText = await page.getWelcomeText();
    const whatsNewText = await page.getWhatsNewText();
    expect(welcomeText).toEqual('Welcome');
    expect(whatsNewText).toEqual('What\'s New');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser
      .manage()
      .logs()
      .get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE
      })
    );
  });
});
