import {HtmlExporter} from './html';
import {ImplementationGuide, Bundle} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {STU3HtmlExporter} from './html.stu3';

jest.mock('config', () => {
  return {
    get: (config: string) => {
      return {};
    }
  };
});

describe('HtmlExporter', () => {
  describe('getStu3Control', () => {
    const bundle: Bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [{
        resource: <ImplementationGuide> {
          resourceType: 'ImplementationGuide',
          id: 'test-ig',
          url: 'http://test.com/test/ig',
          name: 'TestIg',
          status: 'active',
          extension: [{
            extension: [{
              url: 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-location',
              valueUri: 'http://some.com/uri'
            }, {
              url: 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-name',
              valueString: 'test-dependency'
            }, {
              url: 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-version',
              valueString: '1.2.3'
            }],
            url: 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency'
          }]
        }
      }]
    };

    const htmlExporter = new STU3HtmlExporter(null, null, null, null, null, null, null, null, null, null, 'test-ig');

    it('should create a basic control file with xml extension', () => {
      htmlExporter.implementationGuide = <ImplementationGuide> bundle.entry[0].resource;
      delete htmlExporter.implementationGuide.version;
      const control = htmlExporter.getControl(bundle, 'xml');
      const expected = '[IG]\n' +
        'ig = input/test-ig.xml\n' +
        'template = hl7.fhir.template\n' +
        'usage-stats-opt-out = false\n';
      expect(control).toEqual(expected);
    });

    it('should create a control file format with json extension', () => {
      htmlExporter.implementationGuide = <ImplementationGuide> bundle.entry[0].resource;
      htmlExporter.implementationGuide.version = '1.1.0';
      const control = htmlExporter.getControl(bundle, 'json');
      const expected = '[IG]\n' +
        'ig = input/test-ig.json\n' +
        'template = hl7.fhir.template\n' +
        'usage-stats-opt-out = false\n';
      expect(control).toEqual(expected);
    });

    it('should not require a version for dependencies', () => {
      const bundleCopy: Bundle = JSON.parse(JSON.stringify(bundle));
      bundleCopy.entry[0].resource.extension[0].extension.splice(2, 1);   // name is an extension at index 1 within the dependency extension

      htmlExporter.implementationGuide = <ImplementationGuide> bundleCopy.entry[0].resource;
      const newControl = htmlExporter.getControl(bundleCopy, 'xml');

      expect(newControl).toBeTruthy();
    });
  });
});
