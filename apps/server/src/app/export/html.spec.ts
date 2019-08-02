import {HtmlExporter} from './html';
import {ImplementationGuide, Bundle} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';

jest.mock('config', () => {
  return {
    get: (config: string) => {
      return {};
    }
  };
});

describe('HtmlExporter', () => {
  describe('getStu3Control', () => {
    const ig: ImplementationGuide = {
      resourceType: 'ImplementationGuide',
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
    };
    const bundle: Bundle = {
      resourceType: 'Bundle',
      type: 'collection'
    };
    const control = HtmlExporter.getStu3Control(ig, bundle, '3.6.0');

    it('should create a basic control format', () => {
      expect(control).toBeTruthy();
      expect(control.defaults).toBeTruthy();
      expect(control.canonicalBase).toEqual('http://test.com/test');
      expect(control['extension-domains']).toEqual(['https://trifolia-on-fhir.lantanagroup.com']);
      expect(control['allowed-domains']).toEqual(['https://trifolia-on-fhir.lantanagroup.com']);
      expect(control.pages).toBeTruthy();
      expect(control.pages.length).toEqual(1);
      expect(control.pages[0]).toEqual('pages');
      expect(control.paths).toBeTruthy();
      expect(control.paths.qa).toEqual('generated_output/qa');
      expect(control.paths.temp).toEqual('generated_output/temp');
      expect(control.paths.txCache).toEqual('generated_output/txCache');
      expect(control.paths.output).toEqual('output');
      expect(control.paths.resources).toEqual(['source/resources']);
      expect(control.paths.pages).toEqual(['framework', 'source/pages']);
    });

    it('should create a control file with dependencies', () => {
      expect(control).toBeTruthy();
      expect(control.dependencyList).toBeTruthy();
      expect(control.dependencyList.length).toEqual(1);
      expect(control.dependencyList[0].location).toEqual('http://some.com/uri');
      expect(control.dependencyList[0].name).toEqual('test-dependency');
      expect(control.dependencyList[0].version).toEqual('1.2.3');
    });

    it('should not create a dependency without both a name and location', () => {
      const igCopy: ImplementationGuide = JSON.parse(JSON.stringify(ig));
      igCopy.extension[0].extension.splice(1, 1);   // name is an extension at index 1 within the dependency extension
      const newControl = HtmlExporter.getStu3Control(igCopy, bundle, '3.6.0');

      expect(newControl).toBeTruthy();
      expect(newControl.dependencyList).toBeTruthy();
      expect(newControl.dependencyList.length).toEqual(0);
    });

    it('should not require a version for dependencies', () => {
      const igCopy: ImplementationGuide = JSON.parse(JSON.stringify(ig));
      igCopy.extension[0].extension.splice(2, 1);   // name is an extension at index 1 within the dependency extension
      const newControl = HtmlExporter.getStu3Control(igCopy, bundle, '3.6.0');

      expect(newControl).toBeTruthy();
      expect(newControl.dependencyList).toBeTruthy();
      expect(newControl.dependencyList.length).toEqual(1);
    });
  });
});
