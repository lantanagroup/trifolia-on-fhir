import { HomePage } from './home.po';
import {browser, logging} from 'protractor';

beforeEach(async () => {
  await browser.get(browser.baseUrl);
  await browser.waitForAngularEnabled(false);
  await browser.sleep(1000);      // to finish loading
});

describe('ToF App', () => {
  describe('home', async () => {
    let homePage: HomePage;

    it('should display welcome message on the home screen', async () => {
      await homePage.testHome();
    });
  });

  /*
  it('should navigate to browse implementation guides', async () => {

  });
   */
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
