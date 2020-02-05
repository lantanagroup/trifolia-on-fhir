import {ConstraintManager} from './constraint-manager';
import * as profileTypes from '../assets/r4/profiles-types.json';
import * as profileResources from '../assets/r4/profiles-resources.json';
import * as testData1 from '../../../../test/data/shareableplandefinition.profile.json';
import * as testData2 from '../../../../test/data/resprate.profile.json';

import {Fhir, Versions} from 'fhir/fhir';
import {IStructureDefinition} from './fhirInterfaces';
import {ParseConformance} from 'fhir/parseConformance';
import {preserveWhitespacesDefault} from '@angular/compiler';

describe('ConstraintManager', () => {
  const parser = new ParseConformance(false, Versions.R4);
  parser.parseBundle(profileTypes);
  parser.parseBundle(profileResources);
  const fhir = new Fhir(parser);

  describe('resprate observation', () => {
    let cm;

    beforeEach(() => {
      const obsModel = fhir.parser.structureDefinitions.find(sd => sd.id === 'Observation');
      cm = new ConstraintManager(obsModel, testData2, fhir.parser);

      expect(cm.elements.length).toBe(33);
      expect(cm.elements[0].constrainedElement).toBe(testData2.differential.element[0]);
      expect(cm.elements[14].constrainedElement).toBe(testData2.differential.element[1]);
      expect(cm.elements[21].constrainedElement).toBe(testData2.differential.element[6]);
    });

    it('should expand constrained code', () => {
      cm.toggleExpand(cm.elements[14]);           // expand code

      expect(cm.elements[14].expanded).toBe(true);
      expect(cm.elements.length).toBe(38);

      const newElements = cm.elements.filter((e, i) => i >= 15 && i <= 19);
      const actualBasePaths = newElements.map(e => e.basePath);
      const expectedBasePaths = ['Observation.code.id', 'Observation.code.extension', 'Observation.code.coding', 'Observation.code.coding', 'Observation.code.text'];
      expect(actualBasePaths).toStrictEqual(expectedBasePaths);

      expect(newElements[2].isSlice).toBe(false);
      expect(newElements[2].displayId).toBe('coding');
      expect(newElements[3].isSlice).toBe(true);
      expect(newElements[3].displayId).toBe('coding:RespRateCode');

      // All new elements should have the right parent, and a depth of 2
      newElements
        .forEach(e => {
          expect(e.parent).toBe(cm.elements[14]);
          expect(e.depth).toBe(2);
          expect(e.hasChildren).toBe(true);
        });
    });

    it('should expand constrained code.coding', () => {
      cm.toggleExpand(cm.elements[14]);     // expand code
      cm.toggleExpand(cm.elements[17]);     // expand code.coding

      expect(cm.elements[17].expanded).toBe(true);
      expect(cm.elements.length).toBe(47);

      const newElements = cm.elements.filter((e, i) => i >= 18 && i <= 26);
      const actualBasePaths = newElements.map(e => e.basePath);
      const expectedBasePaths = ["Observation.code.coding.id", "Observation.code.coding.extension", "Observation.code.coding.system", "Observation.code.coding.system", "Observation.code.coding.version", "Observation.code.coding.code", "Observation.code.coding.code", "Observation.code.coding.display", "Observation.code.coding.userSelected"];
      expect(actualBasePaths).toStrictEqual(expectedBasePaths);

      newElements.forEach(e => {
        expect(e.parent).toBe(cm.elements[17]);
        expect(e.depth).toBe(3);
      });

      expect(cm.elements[21].constrainedElement).toBe(testData2.differential.element[4]);
      expect(cm.elements[24].constrainedElement).toBe(testData2.differential.element[5]);
    });

    it('should expand code.coding.code', () => {
      cm.toggleExpand(cm.elements[14]);     // expand code
      cm.toggleExpand(cm.elements[17]);     // expand code.coding
      cm.toggleExpand(cm.elements[24]);     // expand code.coding.code

      expect(cm.elements[24].expanded).toBe(true);
      expect(cm.elements.length).toBe(50);

      const newElements = cm.elements.filter((e, i) => i >= 25 && i <= 27);
      const actualBasePaths = newElements.map(e => e.basePath);
      const expectedBasePaths = ["Observation.code.coding.code.id", "Observation.code.coding.code.extension", "Observation.code.coding.code.value"];

      expect(actualBasePaths).toStrictEqual(expectedBasePaths);

      newElements.forEach(e => {
        expect(e.parent).toBe(cm.elements[24]);
        expect(e.depth).toBe(4);
        expect(e.hasChildren).toBe(e.baseId !== 'Observation.code.coding.code.value');
      });
    });

    it('should collapse code with code.coding.code', () => {
      expect(cm.elements.length).toBe(33);
      cm.toggleExpand(cm.elements[14]);     // expand code
      cm.toggleExpand(cm.elements[17]);     // expand code.coding
      cm.toggleExpand(cm.elements[24]);     // expand code.coding.code

      cm.toggleExpand(cm.elements[14]);     // collapse code
      expect(cm.elements.length).toBe(33);

      const actualIds = cm.elements.map(e => e.baseId);
      expect(actualIds).toStrictEqual(["Observation","Observation.id","Observation.meta","Observation.implicitRules","Observation.language","Observation.text","Observation.contained","Observation.extension","Observation.modifierExtension","Observation.identifier","Observation.basedOn","Observation.partOf","Observation.status","Observation.category","Observation.code","Observation.subject","Observation.focus","Observation.encounter","Observation.effective[x]","Observation.issued","Observation.performer","Observation.value[x]","Observation.dataAbsentReason","Observation.interpretation","Observation.note","Observation.bodySite","Observation.method","Observation.specimen","Observation.device","Observation.referenceRange","Observation.hasMember","Observation.derivedFrom","Observation.component"]);
    });

    it('should expand constrained valueQuantity', () => {
      // Expand the Observation.valueQuantity constraint, and we should get child properties for the Quantity data type
      cm.toggleExpand(cm.elements[21]);
      expect(cm.elements.length).toBe(40);

      const newElements = cm.elements.filter((e, i) => i >= 22 && i <= 28);
      const actualBasePaths = newElements.map(e => e.basePath);
      const expectedBasePaths = ['Observation.value[x].id','Observation.value[x].extension','Observation.value[x].value','Observation.value[x].comparator','Observation.value[x].unit','Observation.value[x].system','Observation.value[x].code'];
      expect(actualBasePaths).toStrictEqual(expectedBasePaths);

      // All new elements should have the right parent, and a depth of 2
      newElements
        .forEach(e => {
          expect(e.parent).toBe(cm.elements[21]);
          expect(e.depth).toBe(2);
          expect(e.hasChildren).toBe(true);
        });

      expect(newElements[2].constrainedElement).toBeTruthy();
      expect(newElements[2].constrainedElement.id).toBe('Observation.valueQuantity.value');
      expect(newElements[4].constrainedElement).toBeTruthy();
      expect(newElements[4].constrainedElement.id).toBe('Observation.valueQuantity.unit');
      expect(newElements[5].constrainedElement).toBeTruthy();
      expect(newElements[5].constrainedElement.id).toBe('Observation.valueQuantity.system');
      expect(newElements[6].constrainedElement).toBeTruthy();
      expect(newElements[6].constrainedElement.id).toBe('Observation.valueQuantity.code');
    });
  });

  describe('ctor(), toggleExpand(), associate()', () => {
    it('should initialize with the first level expanded', () => {
      const planDefModel = <IStructureDefinition> fhir.parser.structureDefinitions.find(sd => sd.id === 'PlanDefinition');
      const cm = new ConstraintManager(planDefModel, <IStructureDefinition> <any> testData1, fhir.parser);
      expect(cm.elements).toBeTruthy();
      expect(cm.elements.length).toBe(40);
      const ids = cm.elements.map(e => e.baseId);
      const expectedIds = ["PlanDefinition", "PlanDefinition.id", "PlanDefinition.meta", "PlanDefinition.implicitRules", "PlanDefinition.language", "PlanDefinition.text",
        "PlanDefinition.contained", "PlanDefinition.extension", "PlanDefinition.modifierExtension", "PlanDefinition.url", "PlanDefinition.identifier", "PlanDefinition.version",
        "PlanDefinition.name", "PlanDefinition.title", "PlanDefinition.subtitle", "PlanDefinition.type", "PlanDefinition.status", "PlanDefinition.experimental",
        "PlanDefinition.subject[x]", "PlanDefinition.date", "PlanDefinition.publisher", "PlanDefinition.contact", "PlanDefinition.description", "PlanDefinition.useContext",
        "PlanDefinition.jurisdiction", "PlanDefinition.purpose", "PlanDefinition.usage", "PlanDefinition.copyright", "PlanDefinition.approvalDate", "PlanDefinition.lastReviewDate",
        "PlanDefinition.effectivePeriod", "PlanDefinition.topic", "PlanDefinition.author", "PlanDefinition.editor", "PlanDefinition.reviewer", "PlanDefinition.endorser",
        "PlanDefinition.relatedArtifact", "PlanDefinition.library", "PlanDefinition.goal", "PlanDefinition.action" ];
      expect(ids).toStrictEqual(expectedIds);
      expect(cm.elements[0].depth).toBe(0);

      cm.elements
        .filter((e, i) => i > 0)
        .forEach(e => {
          expect(e.depth).toBe(1);
          expect(e.hasChildren).toBe(e.baseElement.path !== 'PlanDefinition.subject[x]');   // only subject[x] should not have children
        });

      // check associations - this is a simple test for the profile since all elements in the differential are second-level constraints. we can compare straight-across after init
      const constrainedElementTreeModels = cm.elements.filter(e => !!e.constrainedElement).map(e => e.constrainedElement);
      expect(constrainedElementTreeModels.length).toBe(13);
      expect(constrainedElementTreeModels).toStrictEqual(testData1.differential.element);
    });
  });

  describe('findChildren(element, elements)', () => {
    it('should find children of a regular element', () => {
      const goalElement = testData1.snapshot.element[38];
      const children = ConstraintManager.findElementChildren(goalElement, testData1.snapshot.element);
      expect(children).toBeTruthy();
      expect(children.length).toEqual(10);
      expect(children[0].id).toEqual('PlanDefinition.goal.id');
      expect(children[1].id).toEqual('PlanDefinition.goal.extension');
      expect(children[9].id).toEqual('PlanDefinition.goal.target');
    });

    it('to find children of a slice', () => {
      const elements = [{   // 0
        id: 'PlanDefinition',
        path: 'PlanDefinition'
      }, {    // 1
        id: 'PlanDefinition.goal',
        path: 'PlanDefinition.goal'
      }, {    // 2
        id: 'PlanDefinition.goal.id',
        path: 'PlanDefinition.goal.id'
      }, {   // 3
        id: 'PlanDefinition.goal:someSlice',
        path: 'PlanDefinition.goal'
      }, {   // 4
        id: 'PlanDefinition.goal:someSlice.id',
        path: 'PlanDefinition.goal.id'
      }, {   // 5
        id: 'PlanDefinition.goal:someSlice.target',
        path: 'PlanDefinition.goal.target'
      }, {   // 6
        id: 'PlanDefinition.goal:someSlice.target.id',
        path: 'PlanDefinition.goal.target.id'
      }, {   // 7
        id: 'PlanDefinition.goal:someSlice.target:targetSlice1',
        path: 'PlanDefinition.goal.target'
      }, {   // 8
        id: 'PlanDefinition.goal:someSlice.target:targetSlice1.id',
        path: 'PlanDefinition.goal.target.id'
      }, {   // 9
        id: 'PlanDefinition.goal:someSlice.target:targetSlice1.extension',
        path: 'PlanDefinition.goal.target.extension'
      }, {   // 10
        id: 'PlanDefinition.goal:someSlice.target:targetSlice1.reference',
        path: 'PlanDefinition.goal.target.reference'
      }, {   // 11
        id: 'PlanDefinition.goal:someSlice.target:targetSlice1.reference.reference',
        path: 'PlanDefinition.goal.target.reference.reference'
      }, {   // 12
        id: 'PlanDefinition.goal:someSlice.target:targetSlice2',
        path: 'PlanDefinition.goal.target'
      }, {   // 13
        id: 'PlanDefinition.goal:someSlice.target:targetSlice2.id',
        path: 'PlanDefinition.goal.target.id'
      }];

      const rootChildren = ConstraintManager.findElementChildren(elements[0], elements);
      expect(rootChildren).toBeTruthy();
      expect(rootChildren.length).toBe(2);
      expect(rootChildren[0].id).toBe('PlanDefinition.goal');
      expect(rootChildren[1].id).toBe('PlanDefinition.goal:someSlice');

      // Asking for children of PlanDefinition.goal:someSlice
      const children1 = ConstraintManager.findElementChildren(elements[3], elements);
      expect(children1).toBeTruthy();
      expect(children1.length).toBe(4);
      expect(children1[0].id).toEqual('PlanDefinition.goal:someSlice.id');
      expect(children1[1].id).toEqual('PlanDefinition.goal:someSlice.target');
      expect(children1[2].id).toEqual('PlanDefinition.goal:someSlice.target:targetSlice1');
      expect(children1[3].id).toEqual('PlanDefinition.goal:someSlice.target:targetSlice2');

      // Should return single grand-child of the slice
      const children2 = ConstraintManager.findElementChildren(elements[5], elements);
      expect(children2).toBeTruthy();
      expect(children2.length).toBe(1);
      expect(children2[0].id).toEqual('PlanDefinition.goal:someSlice.target.id');

      // Asking for children of PlanDefinition.goal:someSlice.target:targetSlice1
      const children3 = ConstraintManager.findElementChildren(elements[7], elements);
      expect(children3).toBeTruthy();
      expect(children3.length).toBe(3);
      expect(children3[0].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice1.id');
      expect(children3[1].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice1.extension');
      expect(children3[2].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice1.reference');

      // Asking for children of PlanDefinition.goal:someSlice.target:targetSlice1.reference
      const children4 = ConstraintManager.findElementChildren(elements[10], elements);
      expect(children4).toBeTruthy();
      expect(children4.length).toBe(1);
      expect(children4[0].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice1.reference.reference');

      // Asking for children of PlanDefinition.goal:someSlice.target:targetSlice2
      const children5 = ConstraintManager.findElementChildren(elements[12], elements);
      expect(children5).toBeTruthy();
      expect(children5.length).toBe(1);
      expect(children5[0].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice2.id');
    });
  });

  describe('findChildren(element)', () => {
    it('should find children', () => {
      const planDefModel = <IStructureDefinition> fhir.parser.structureDefinitions.find(sd => sd.id === 'PlanDefinition');
      const cm = new ConstraintManager(planDefModel, <IStructureDefinition> <any> testData1, fhir.parser);
      const children = cm.findChildren(planDefModel.snapshot.element[0]);     // ask for children of PlanDefinition
      expect(children).toBeTruthy();
      expect(children.length).toBe(39);
    });

    it('should find children of a child type', () => {
      const planDefModel = <IStructureDefinition> fhir.parser.structureDefinitions.find(sd => sd.id === 'PlanDefinition');
      const cm = new ConstraintManager(planDefModel, <IStructureDefinition> <any> testData1, fhir.parser);
      const children = cm.findChildren(planDefModel.snapshot.element[2]);     // ask for children of PlanDefinition.meta
      expect(children).toBeTruthy();
      expect(children.length).toBe(8);

      // Make sure it converted to the ids and paths to match the profile the request was made for
      expect(children[0].id).toBe('PlanDefinition.meta.id');
      expect(children[0].path).toBe('PlanDefinition.meta.id');
      expect(children[1].id).toBe('PlanDefinition.meta.extension');
      expect(children[1].path).toBe('PlanDefinition.meta.extension');
      expect(children[7].id).toBe('PlanDefinition.meta.tag');
      expect(children[7].path).toBe('PlanDefinition.meta.tag');
    });
  });
});
