import { ConstraintManager } from './constraint-manager';
import * as profileTypes from '../assets/r4/profiles-types.json';
import * as profileResources from '../assets/r4/profiles-resources.json';
import * as shareablePlanDefinitionData from '../../../../test/data/shareableplandefinition.profile.json';
import * as resprateProfileData from '../../../../test/data/resprate.profile.json';
import * as resprate2Data from '../../../../test/data/resprate2.profile.json';
import * as ccdData from '../../../../test/data/ccd.json';
import * as dentalReferralData from '../../../../test/data/dentalReferral.json';
import * as referralNoteData from '../../../../test/data/referralNote.json';
import * as dentalCCDData from '../../../../test/data/dental-ccd.json';
import * as fetalDeathReportdata from '../../../../test/data/composition-jurisdiction-fetal-death-report.json';
import * as observationHowDeathInjuryOccured from '../../../../test/data/observationHowDeathInjuryOccured.profile.json';

import { Fhir, Versions } from 'fhir/fhir';
import { IElementDefinition, IStructureDefinition } from './fhirInterfaces';
import { ParseConformance } from 'fhir/parseConformance';
import { ElementDefinition, StructureDefinition } from './r4/fhir';

describe('ConstraintManager', () => {
  const parser = new ParseConformance(false, Versions.R4);
  parser.parseBundle(profileTypes);
  parser.parseBundle(profileResources);
  const fhir = new Fhir(parser);

  describe('ccd profile tests', () => {
    let cm;
    let testData: IStructureDefinition;

    beforeEach(async () => {
      testData = JSON.parse(JSON.stringify(ccdData));
      const obsModel = fhir.parser.structureDefinitions.find(sd => sd.id === 'Composition');
      cm = new ConstraintManager(ElementDefinition, obsModel, testData, fhir.parser);
      await cm.initializeRoot();

      expect(cm.elements.length).toBe(43);
    });

    it('should have section slices in the correct order', () => {
      const actualSliceIds = cm.elements
        .filter((e, i) => i >= 24 && i <= 42 && e.depth === 1)
        .map(e => e.id);
      const expectedSliceIds = ['Composition.section:allergies_and_intolerances_section', 'Composition.section:medications_section', 'Composition.section:problem_section', 'Composition.section:results_section', 'Composition.section:social_history_section', 'Composition.section:vital_signs_section', 'Composition.section:plan_of_treatment_section', 'Composition.section:procedures_section', 'Composition.section:family_history_section', 'Composition.section:advance_directives_section', 'Composition.section:encounters_section', 'Composition.section:functional_status_section', 'Composition.section:immunizations_section', 'Composition.section:nutrition_section', 'Composition.section:mental_status_section', 'Composition.section:medical_equipment_section', 'Composition.section:payers_section', 'Composition.section:goals_section', 'Composition.section:health_concerns_section'];

      expect(cm.elements.length).toBe(43);
      expect(actualSliceIds).toStrictEqual(expectedSliceIds);
    });

    it('should expand section slices and have the correct children', async () => {
      await cm.toggleExpand(cm.elements[24]);
      const ids = cm.elements.map(e => e.id);
      let expectedIds = ['Composition', 'Composition.id', 'Composition.meta', 'Composition.implicitRules', 'Composition.language', 'Composition.text', 'Composition.contained', 'Composition.extension', 'Composition.modifierExtension', 'Composition.identifier', 'Composition.status', 'Composition.type', 'Composition.category', 'Composition.subject', 'Composition.encounter', 'Composition.date', 'Composition.author', 'Composition.title', 'Composition.confidentiality', 'Composition.attester', 'Composition.custodian', 'Composition.relatesTo', 'Composition.event', 'Composition.section', 'Composition.section:allergies_and_intolerances_section', 'Composition.section:allergies_and_intolerances_section.id', 'Composition.section:allergies_and_intolerances_section.extension', 'Composition.section:allergies_and_intolerances_section.modifierExtension', 'Composition.section:allergies_and_intolerances_section.title', 'Composition.section:allergies_and_intolerances_section.code', 'Composition.section:allergies_and_intolerances_section.author', 'Composition.section:allergies_and_intolerances_section.focus', 'Composition.section:allergies_and_intolerances_section.text', 'Composition.section:allergies_and_intolerances_section.mode', 'Composition.section:allergies_and_intolerances_section.orderedBy', 'Composition.section:allergies_and_intolerances_section.entry', 'Composition.section:allergies_and_intolerances_section.entry:allergy_entry', 'Composition.section:allergies_and_intolerances_section.emptyReason', 'Composition.section:allergies_and_intolerances_section.section', 'Composition.section:medications_section', 'Composition.section:problem_section', 'Composition.section:results_section', 'Composition.section:social_history_section', 'Composition.section:vital_signs_section', 'Composition.section:plan_of_treatment_section', 'Composition.section:procedures_section', 'Composition.section:family_history_section', 'Composition.section:advance_directives_section', 'Composition.section:encounters_section', 'Composition.section:functional_status_section', 'Composition.section:immunizations_section', 'Composition.section:nutrition_section', 'Composition.section:mental_status_section', 'Composition.section:medical_equipment_section', 'Composition.section:payers_section', 'Composition.section:goals_section', 'Composition.section:health_concerns_section'];
      expect(ids).toStrictEqual(expectedIds);

      let actualIds = cm.elements
        .filter((e, i) => i >= 25 && i <= 38 && e.depth === 2)
        .map(e => e.id);
      expectedIds = ['Composition.section:allergies_and_intolerances_section.id', 'Composition.section:allergies_and_intolerances_section.extension', 'Composition.section:allergies_and_intolerances_section.modifierExtension', 'Composition.section:allergies_and_intolerances_section.title', 'Composition.section:allergies_and_intolerances_section.code', 'Composition.section:allergies_and_intolerances_section.author', 'Composition.section:allergies_and_intolerances_section.focus', 'Composition.section:allergies_and_intolerances_section.text', 'Composition.section:allergies_and_intolerances_section.mode', 'Composition.section:allergies_and_intolerances_section.orderedBy', 'Composition.section:allergies_and_intolerances_section.entry', 'Composition.section:allergies_and_intolerances_section.entry:allergy_entry', 'Composition.section:allergies_and_intolerances_section.emptyReason', 'Composition.section:allergies_and_intolerances_section.section'];
      expect(actualIds).toStrictEqual(expectedIds);

      // expand medications section
      await cm.toggleExpand(cm.elements[39]);
      actualIds = cm.elements
        .filter((e, i) => i >= 40 && i <= 53 && e.depth === 2)
        .map(e => e.id);
      expectedIds = ['Composition.section:medications_section.id', 'Composition.section:medications_section.extension', 'Composition.section:medications_section.modifierExtension', 'Composition.section:medications_section.title', 'Composition.section:medications_section.code', 'Composition.section:medications_section.author', 'Composition.section:medications_section.focus', 'Composition.section:medications_section.text', 'Composition.section:medications_section.mode', 'Composition.section:medications_section.orderedBy', 'Composition.section:medications_section.entry', 'Composition.section:medications_section.entry:medication_entry', 'Composition.section:medications_section.emptyReason', 'Composition.section:medications_section.section'];
      expect(actualIds).toStrictEqual(expectedIds);
    });
  });

  describe('fetal death report', () => {
    let cm: ConstraintManager;

    beforeEach(async () => {
      const testData: IStructureDefinition = JSON.parse(JSON.stringify(fetalDeathReportdata));
      const compositionModel = fhir.parser.structureDefinitions.find(sd => sd.id === 'Composition');

      cm = new ConstraintManager(ElementDefinition, compositionModel, testData, fhir.parser);
      await cm.initializeRoot();
    });

    it('should expand elements in correct order', async () => {
      const sectionMotherPrentalSliceElement = cm.elements.find(e => e.constrainedElement && e.constrainedElement.sliceName === 'motherPrenatal');
      expect(sectionMotherPrentalSliceElement).toBeTruthy();

      const sectionFetusSliceElement = cm.elements.find(e => e.constrainedElement && e.constrainedElement.sliceName === 'fetus');
      expect(sectionFetusSliceElement).toBeTruthy();

      // Expand motherPrenatal
      await cm.toggleExpand(sectionMotherPrentalSliceElement);

      // Check that the elements are in the order expected after the expand of motherPrenatal slice
      let ids = cm.elements.map(e => e.constrainedElement ? e.constrainedElement.id : e.id);
      let expectedIds = ['Composition', 'Composition.id', 'Composition.meta', 'Composition.implicitRules', 'Composition.language', 'Composition.text', 'Composition.contained', 'Composition.extension:dateReceivedByRegistrar', 'Composition.extension:relatedPersonFather', 'Composition.modifierExtension', 'Composition.identifier', 'Composition.status', 'Composition.type', 'Composition.category', 'Composition.subject', 'Composition.encounter', 'Composition.date', 'Composition.author', 'Composition.author:personCompletingReport', 'Composition.title', 'Composition.confidentiality', 'Composition.attester', 'Composition.custodian', 'Composition.relatesTo', 'Composition.event', 'Composition.section', 'Composition.section:motherPrenatal', 'Composition.section:motherPrenatal.id', 'Composition.section:motherPrenatal.extension', 'Composition.section:motherPrenatal.modifierExtension', 'Composition.section:motherPrenatal.title', 'Composition.section:motherPrenatal.code', 'Composition.section:motherPrenatal.author', 'Composition.section:motherPrenatal.focus', 'Composition.section:motherPrenatal.text', 'Composition.section:motherPrenatal.mode', 'Composition.section:motherPrenatal.orderedBy', 'Composition.section:motherPrenatal.entry', 'Composition.section:motherPrenatal.entry:plannedToDeliverAtHome', 'Composition.section:motherPrenatal.entry:firstPrenatalCareVisit', 'Composition.section:motherPrenatal.entry:dateLastNormalMenses', 'Composition.section:motherPrenatal.entry:numberNowLiving', 'Composition.section:motherPrenatal.entry:numberNowDead', 'Composition.section:motherPrenatal.entry:dateLastLiveBirth', 'Composition.section:motherPrenatal.entry:mothersHeight', 'Composition.section:motherPrenatal.entry:mothersPrepregnancyWeight', 'Composition.section:motherPrenatal.entry:motherReceivedWICFood', 'Composition.section:motherPrenatal.entry:cigaretteSmokingBeforeDuringPregnancy', 'Composition.section:motherPrenatal.emptyReason', 'Composition.section:motherPrenatal.section', 'Composition.section:medicalHealthInformation', 'Composition.section:fetus', 'Composition.section:motherInformation'];
      expect(ids).toStrictEqual(expectedIds);

      // Expand fetus
      await cm.toggleExpand(sectionFetusSliceElement);

      // Check that the elements are in the order expected after the expand of fetus slice
      ids = cm.elements.map(e => e.constrainedElement ? e.constrainedElement.id : e.id);
      expectedIds = ['Composition', 'Composition.id', 'Composition.meta', 'Composition.implicitRules', 'Composition.language', 'Composition.text', 'Composition.contained', 'Composition.extension:dateReceivedByRegistrar', 'Composition.extension:relatedPersonFather', 'Composition.modifierExtension', 'Composition.identifier', 'Composition.status', 'Composition.type', 'Composition.category', 'Composition.subject', 'Composition.encounter', 'Composition.date', 'Composition.author', 'Composition.author:personCompletingReport', 'Composition.title', 'Composition.confidentiality', 'Composition.attester', 'Composition.custodian', 'Composition.relatesTo', 'Composition.event', 'Composition.section', 'Composition.section:motherPrenatal', 'Composition.section:motherPrenatal.id', 'Composition.section:motherPrenatal.extension', 'Composition.section:motherPrenatal.modifierExtension', 'Composition.section:motherPrenatal.title', 'Composition.section:motherPrenatal.code', 'Composition.section:motherPrenatal.author', 'Composition.section:motherPrenatal.focus', 'Composition.section:motherPrenatal.text', 'Composition.section:motherPrenatal.mode', 'Composition.section:motherPrenatal.orderedBy', 'Composition.section:motherPrenatal.entry', 'Composition.section:motherPrenatal.entry:plannedToDeliverAtHome', 'Composition.section:motherPrenatal.entry:firstPrenatalCareVisit', 'Composition.section:motherPrenatal.entry:dateLastNormalMenses', 'Composition.section:motherPrenatal.entry:numberNowLiving', 'Composition.section:motherPrenatal.entry:numberNowDead', 'Composition.section:motherPrenatal.entry:dateLastLiveBirth', 'Composition.section:motherPrenatal.entry:mothersHeight', 'Composition.section:motherPrenatal.entry:mothersPrepregnancyWeight', 'Composition.section:motherPrenatal.entry:motherReceivedWICFood', 'Composition.section:motherPrenatal.entry:cigaretteSmokingBeforeDuringPregnancy', 'Composition.section:motherPrenatal.emptyReason', 'Composition.section:motherPrenatal.section', 'Composition.section:medicalHealthInformation', 'Composition.section:fetus', 'Composition.section:fetus.id', 'Composition.section:fetus.extension', 'Composition.section:fetus.modifierExtension', 'Composition.section:fetus.title', 'Composition.section:fetus.code', 'Composition.section:fetus.author', 'Composition.section:fetus.focus', 'Composition.section:fetus.text', 'Composition.section:fetus.mode', 'Composition.section:fetus.orderedBy', 'Composition.section:fetus.entry', 'Composition.section:fetus.entry:deliveryWeight', 'Composition.section:fetus.entry:gestationalAgeAtDelivery', 'Composition.section:fetus.entry:causeOfFetalDeath', 'Composition.section:fetus.entry:otherCauseOfDeath', 'Composition.section:fetus.entry:estimatedTimeFetalDeath', 'Composition.section:fetus.entry:autopsyPerformed', 'Composition.section:fetus.entry:histologicalExamPerformed', 'Composition.section:fetus.entry:autopsyOrHistologicalExamUsed', 'Composition.section:fetus.entry:plurality', 'Composition.section:fetus.emptyReason', 'Composition.section:fetus.section', 'Composition.section:motherInformation'];
      expect(ids).toStrictEqual(expectedIds);
    });
  });

  describe('associate resprate2 observation', () => {
    it('should associate sub-sub constraint', async () => {
      const testData: IStructureDefinition = JSON.parse(JSON.stringify(resprate2Data));

      // Add a sub-sub constraint element to the resprate2 profile
      testData.differential.element.splice(2, 0,
        {
          "id": "Observation.code.coding.code",
          "path": "Observation.code.coding.code"
        });

      const obsModel = fhir.parser.structureDefinitions.find(sd => sd.id === 'Observation');
      const cm = new ConstraintManager(ElementDefinition, obsModel, testData, fhir.parser);
      await cm.initializeRoot();

      await cm.toggleExpand(cm.elements[14]);
      await cm.toggleExpand(cm.elements[17]);
      expect(cm.elements[22].basePath).toBe('Observation.code.coding.code');
      expect(cm.elements[22].constrainedElement).toBe(testData.differential.element[2]);
    });
  });

  /**
   * dental-referralnote is based on ccda-on-fhir's referral note and already
   * has a bunch of slices. this/these tests should prove that re-slicing is working.
   */
  describe('dental-referralnote tests', () => {
    it('should expand dental referral', async () => {
      const testData = new StructureDefinition(JSON.parse(JSON.stringify(dentalReferralData)));
      const referralNote = new StructureDefinition(JSON.parse(JSON.stringify(referralNoteData)));

      const cm = new ConstraintManager(ElementDefinition, referralNote, testData, fhir.parser);
      await cm.initializeRoot();

      const ids = cm.elements.map(e => e.constrainedElement ? e.constrainedElement.id : e.baseElement.id);
      const expectedIds = ['Composition', 'Composition.id', 'Composition.meta', 'Composition.implicitRules', 'Composition.language', 'Composition.text', 'Composition.contained', 'Composition.extension', 'Composition.extension:versionNumber', 'Composition.extension:data_enterer_extension', 'Composition.extension:informant_extension', 'Composition.extension:information_recipient_extension', 'Composition.extension:participant_extension', 'Composition.extension:performer_extension', 'Composition.extension:authorization_extension', 'Composition.extension:order_extension', 'Composition.modifierExtension', 'Composition.identifier', 'Composition.status', 'Composition.type', 'Composition.category', 'Composition.subject', 'Composition.encounter', 'Composition.date', 'Composition.author', 'Composition.title', 'Composition.confidentiality', 'Composition.attester', 'Composition.attester:legal_attester', 'Composition.attester:professional_attester', 'Composition.attester:personal_attester', 'Composition.custodian', 'Composition.relatesTo', 'Composition.event', 'Composition.section', 'Composition.section:allergies_and_intolerances_section', 'Composition.section:medications_section', 'Composition.section:problem_section/newSlice', 'Composition.section:reason_for_referral_section', 'Composition.section:functional_status_section', 'Composition.section:mental_status_section', 'Composition.section:nutrition_section', 'Composition.section:plan_of_treatment_section', 'Composition.section:results_section', 'Composition.section:assessment_and_plan_section', 'Composition.section:advance_directives_section', 'Composition.section:assessment_section', 'Composition.section:family_history_section', 'Composition.section:general_status_section', 'Composition.section:past_medical_history_section', 'Composition.section:history_of_present_illness_section', 'Composition.section:immunizations_section', 'Composition.section:medical_equipment_section', 'Composition.section:physical_exam_section', 'Composition.section:procedures_section', 'Composition.section:review_of_systems_section', 'Composition.section:social_history_section', 'Composition.section:vital_signs_section', 'Composition.section:goals_section', 'Composition.section:health_concerns_section'];
      expect(ids).toStrictEqual(expectedIds);
    });
  });

  /**
   * Tests related to constraining and removing constraints for the resperate2
   * profile, which is a basic profile based on the core FHIR Observation.
   */
  describe('[un]constrain resprate2 observation', () => {
    let cm: ConstraintManager;
    let testData: IStructureDefinition;

    beforeEach(async () => {
      testData = JSON.parse(JSON.stringify(resprate2Data));
      const obsModel = fhir.parser.structureDefinitions.find(sd => sd.id === 'Observation');
      cm = new ConstraintManager(ElementDefinition, obsModel, testData, fhir.parser);
      await cm.initializeRoot();

      expect(cm.elements.length).toBe(33);
    });

    it('should constrain code.coding', async () => {
      await cm.toggleExpand(cm.elements[14]);
      expect(cm.elements.length).toBe(37);

      expect(testData.differential.element.length).toBe(7);
      cm.constrain(cm.elements[17]);
      expect(testData.differential.element.length).toBe(8);
      expect(testData.differential.element[2].id).toBe('Observation.code.coding');
      expect(testData.differential.element[2].path).toBe('Observation.code.coding');
    });

    it('should constraint code.coding.code', async () => {
      await cm.toggleExpand(cm.elements[14]);
      await cm.toggleExpand(cm.elements[17]);
      expect(cm.elements.length).toBe(44);

      expect(testData.differential.element.length).toBe(7);
      cm.constrain(cm.elements[22]);
      expect(testData.differential.element.length).toBe(8);
      expect(testData.differential.element[2].id).toBe('Observation.code.coding.code');
      expect(testData.differential.element[2].path).toBe('Observation.code.coding.code');
    });

    it('should remove the constraint for valueQuantity', async () => {
      expect(testData.differential.element.length).toBe(7);
      expect(cm.elements.length).toBe(33);
      await cm.toggleExpand(cm.elements[21]);
      expect(cm.elements.length).toBe(40);
      cm.removeConstraint(cm.elements[21]);
      expect(cm.elements.length).toBe(33);
      const actualIds = testData.differential.element.map(e => e.id);
      const expectedIds = ["Observation", "Observation.code"];
      expect(actualIds).toStrictEqual(expectedIds);
    });
  });

  describe('dental CCD tests', () => {
    let dentalCCD: IStructureDefinition;
    let cm: ConstraintManager;

    beforeEach(async () => {
      dentalCCD = JSON.parse(JSON.stringify(dentalCCDData));

      const ccdModel = JSON.parse(JSON.stringify(ccdData));
      cm = new ConstraintManager(ElementDefinition, ccdModel, dentalCCD, fhir.parser);
      await cm.initializeRoot();
    });

    it('should delete the re-slice', async () => {
      const originalConstrainedElements = cm.elements.filter(e => !!e.constrainedElement);
      cm.removeConstraint(cm.elements[11]);

      // Should have one less constrained elements, but the same number of base elements
      const updatedConstrainedElements = cm.elements.filter(e => !!e.constrainedElement);
      expect(updatedConstrainedElements.length).toBe(originalConstrainedElements.length - 1);

      const ids = cm.elements.map(e => e.constrainedElement ? e.constrainedElement.id : e.baseElement.id);
      const expectedIds = ['Composition', 'Composition.id', 'Composition.meta', 'Composition.implicitRules', 'Composition.language', 'Composition.text', 'Composition.contained', 'Composition.extension', 'Composition.extension:versionNumber', 'Composition.extension:data_enterer_extension', 'Composition.extension:informant_extension', 'Composition.extension:information_recipient_extension', 'Composition.extension:participant_extension', 'Composition.extension:performer_extension', 'Composition.extension:authorization_extension', 'Composition.extension:order_extension/slice4823', 'Composition.modifierExtension', 'Composition.identifier', 'Composition.status', 'Composition.type', 'Composition.category', 'Composition.subject', 'Composition.encounter', 'Composition.date', 'Composition.author', 'Composition.title', 'Composition.confidentiality', 'Composition.attester', 'Composition.attester:legal_attester', 'Composition.attester:professional_attester', 'Composition.attester:personal_attester', 'Composition.custodian', 'Composition.relatesTo', 'Composition.event', 'Composition.section', 'Composition.section:allergies_and_intolerances_section', 'Composition.section:medications_section', 'Composition.section:problem_section', 'Composition.section:results_section', 'Composition.section:social_history_section', 'Composition.section:vital_signs_section', 'Composition.section:plan_of_treatment_section', 'Composition.section:procedures_section', 'Composition.section:family_history_section', 'Composition.section:advance_directives_section', 'Composition.section:encounters_section', 'Composition.section:functional_status_section', 'Composition.section:immunizations_section', 'Composition.section:nutrition_section', 'Composition.section:mental_status_section', 'Composition.section:medical_equipment_section', 'Composition.section:payers_section', 'Composition.section:goals_section', 'Composition.section:health_concerns_section'];
      expect(ids).toStrictEqual(expectedIds);
    });

    it('it should have a child of a slice after expanding', async () => {
      await cm.toggleExpand(cm.elements[15]);
      expect(cm.elements[16].id).toBe('Composition.extension:order_extension/slice4823.id');
      expect(cm.elements[16].constrainedElement).toBeTruthy();
    });
  });

  describe('reseperate2 tests', () => {
    let cm: ConstraintManager;
    let resperate2: IStructureDefinition;

    beforeEach(async () => {
      resperate2 = JSON.parse(JSON.stringify(resprate2Data));

      const obsModel = fhir.parser.structureDefinitions.find(sd => sd.id === 'Observation');
      cm = new ConstraintManager(ElementDefinition, obsModel, resperate2, fhir.parser);
      await cm.initializeRoot();

      const ids = cm.elements.map(e => e.constrainedElement ? e.constrainedElement.id : e.baseElement.id);
      const expectedIds = ['Observation', 'Observation.id', 'Observation.meta', 'Observation.implicitRules', 'Observation.language', 'Observation.text', 'Observation.contained', 'Observation.extension', 'Observation.modifierExtension', 'Observation.identifier', 'Observation.basedOn', 'Observation.partOf', 'Observation.status', 'Observation.category', 'Observation.code', 'Observation.subject', 'Observation.focus', 'Observation.encounter', 'Observation.effective[x]', 'Observation.issued', 'Observation.performer', 'Observation.valueQuantity', 'Observation.dataAbsentReason', 'Observation.interpretation', 'Observation.note', 'Observation.bodySite', 'Observation.method', 'Observation.specimen', 'Observation.device', 'Observation.referenceRange', 'Observation.hasMember', 'Observation.derivedFrom', 'Observation.component'];
      expect(ids).toStrictEqual(expectedIds);
    });

    it('should not slice code because it is not repeatable', () => {
      cm.slice(cm.elements[14]);

      const ids = resperate2.differential.element.map(e => e.id);
      const expectedIds = ['Observation', 'Observation.code', 'Observation.valueQuantity', 'Observation.valueQuantity.value', 'Observation.valueQuantity.unit', 'Observation.valueQuantity.system', 'Observation.valueQuantity.code'];
      expect(ids).toStrictEqual(expectedIds);
    });

    it('should slice category', async () => {
      const categoryTreeElement = cm.elements.find(e => e.id === 'Observation.category');

      cm.constrain(categoryTreeElement);
      expect(cm.elements.length).toBe(33);
      expect(resperate2.differential.element.length).toBe(8);

      await cm.toggleExpand(categoryTreeElement);
      expect(cm.elements.length).toBe(37);

      // slice category
      cm.slice(categoryTreeElement, 'mySlice');

      // Check the differential elements
      let ids = resperate2.differential.element.map(e => e.id);
      let expectedIds = ['Observation', 'Observation.category', 'Observation.category:mySlice', 'Observation.code', 'Observation.valueQuantity', 'Observation.valueQuantity.value', 'Observation.valueQuantity.unit', 'Observation.valueQuantity.system', 'Observation.valueQuantity.code'];
      expect(ids).toStrictEqual(expectedIds);

      ids = cm.elements.map(e => e.constrainedElement ? e.constrainedElement.id : e.baseElement.id);
      expectedIds = ['Observation', 'Observation.id', 'Observation.meta', 'Observation.implicitRules', 'Observation.language', 'Observation.text', 'Observation.contained', 'Observation.extension', 'Observation.modifierExtension', 'Observation.identifier', 'Observation.basedOn', 'Observation.partOf', 'Observation.status', 'Observation.category', 'Observation.category.id', 'Observation.category.extension', 'Observation.category.coding', 'Observation.category.text', 'Observation.category:mySlice', 'Observation.code', 'Observation.subject', 'Observation.focus', 'Observation.encounter', 'Observation.effective[x]', 'Observation.issued', 'Observation.performer', 'Observation.valueQuantity', 'Observation.dataAbsentReason', 'Observation.interpretation', 'Observation.note', 'Observation.bodySite', 'Observation.method', 'Observation.specimen', 'Observation.device', 'Observation.referenceRange', 'Observation.hasMember', 'Observation.derivedFrom', 'Observation.component'];
      expect(ids).toStrictEqual(expectedIds);

      const categorySliceTreeElement = cm.elements.find(e => e.constrainedElement && e.constrainedElement.id === 'Observation.category:mySlice');
      expect(categorySliceTreeElement).toBeTruthy();

      const categoryElement: IElementDefinition = resperate2.differential.element.find(e => e.id === 'Observation.category');
      expect(categoryElement).toBeTruthy();

      expect(categoryElement.slicing).toBeTruthy();
      expect(categoryElement.slicing.rules).toBe('open');

      const categorySliceElement = resperate2.differential.element.find(e => e.id === 'Observation.category:mySlice');
      expect(categorySliceElement).toBeTruthy();

      expect(categorySliceElement.path).toBe('Observation.category');
      expect(categorySliceElement.sliceName).toBe('mySlice');

      await cm.toggleExpand(cm.elements[18]);     // expand the new slice
      expect(cm.elements.length).toBe(42);
    });

    it('should slice category and category.coding', async () => {
      cm.constrain(cm.elements[13]);
      await cm.toggleExpand(cm.elements[13]);   // expand category
      cm.slice(cm.elements[13], 'mySlice');
      await cm.toggleExpand(cm.elements[18]);     // expand the new slice

      cm.constrain(cm.elements[21]);        // constrain the category.coding element so that it *can* be sliced
      expect(resperate2.differential.element.length).toBe(10);
      expect(resperate2.differential.element[3].id).toBe('Observation.category:mySlice.coding');
      expect(resperate2.differential.element[3].path).toBe('Observation.category.coding');
      expect(cm.elements[21].constrainedElement).toBe(resperate2.differential.element[3]);

      cm.slice(cm.elements[21], 'mySlice2');            // slice the category.coding element
      expect(resperate2.differential.element.length).toBe(11);
      expect(resperate2.differential.element[4].sliceName).toBe('mySlice2');
      expect(resperate2.differential.element[4].id).toBe('Observation.category:mySlice.coding:mySlice2');
      expect(resperate2.differential.element[4].path).toBe('Observation.category.coding');
      expect(cm.elements.length).toBe(43);
      expect(cm.elements[22].constrainedElement).toBe(resperate2.differential.element[4]);
    });

    it('should slice category.coding twice', async () => {
      cm.constrain(cm.elements[13]);
      await cm.toggleExpand(cm.elements[13]);   // expand category
      cm.slice(cm.elements[13], 'mySlice');
      await cm.toggleExpand(cm.elements[18]);     // expand the new slice
      cm.constrain(cm.elements[21]);        // constrain the category.coding element so that it *can* be sliced
      cm.slice(cm.elements[21], 'mySlice2');            // slice the category.coding element
      cm.slice(cm.elements[21], 'mySlice3');            // slice category.coding a second time
      expect(cm.elements.length).toBe(44);
      expect(resperate2.differential.element.length).toBe(12);
      expect(resperate2.differential.element[5].sliceName).toBe('mySlice3');
      expect(resperate2.differential.element[5].id).toBe('Observation.category:mySlice.coding:mySlice3');
      expect(resperate2.differential.element[5].path).toBe('Observation.category.coding');
      expect(cm.elements[23].constrainedElement).toBe(resperate2.differential.element[5]);
    });

    it('should delete the slices', async () => {
      cm.constrain(cm.elements[13]);
      await cm.toggleExpand(cm.elements[13]);   // expand category
      cm.slice(cm.elements[13], 'mySlice');
      await cm.toggleExpand(cm.elements[18]);     // expand the new slice
      cm.constrain(cm.elements[21]);        // constrain the category.coding element so that it *can* be sliced
      cm.slice(cm.elements[21], 'mySlice2');            // slice the category.coding element
      cm.slice(cm.elements[21], 'mySlice3');            // slice category.coding a second time
      cm.removeConstraint(cm.elements[23]);

      expect(cm.elements.length).toBe(43);
      expect(cm.elements[23].baseId).toBe('Observation.category.text');
      expect(resperate2.differential.element.length).toBe(11);
    });

    it('should delete the category.coding slicing and all slices associated with it', async () => {
      cm.constrain(cm.elements[13]);
      await cm.toggleExpand(cm.elements[13]);   // expand category
      cm.slice(cm.elements[13], 'mySlice');
      await cm.toggleExpand(cm.elements[18]);     // expand the new slice
      cm.constrain(cm.elements[21]);        // constrain the category.coding element so that it *can* be sliced
      cm.slice(cm.elements[21], 'mySlice2');            // slice the category.coding element
      cm.slice(cm.elements[21], 'mySlice3');            // slice category.coding a second time
      cm.removeConstraint(cm.elements[21]);

      expect(cm.elements.length).toBe(42);
      expect(cm.elements[22].baseId).toBe('Observation.category.text');
      expect(resperate2.differential.element.length).toBe(9);

      const actualIds = resperate2.differential.element.map(e => e.id);
      const expectedIds = ['Observation', 'Observation.category', 'Observation.category:mySlice', 'Observation.code', 'Observation.valueQuantity', 'Observation.valueQuantity.value', 'Observation.valueQuantity.unit', 'Observation.valueQuantity.system', 'Observation.valueQuantity.code'];
      expect(actualIds).toStrictEqual(expectedIds);
    });

    it('should delete the category slicing and all slices associated with it', async () => {
      cm.constrain(cm.elements[13]);
      await cm.toggleExpand(cm.elements[13]);   // expand category
      cm.slice(cm.elements[13], 'mySlice');
      await cm.toggleExpand(cm.elements[18]);     // expand the new slice
      cm.constrain(cm.elements[21]);        // constrain the category.coding element so that it *can* be sliced
      cm.slice(cm.elements[21], 'mySlice2');            // slice the category.coding element
      cm.slice(cm.elements[21], 'mySlice3');            // slice category.coding a second time
      cm.removeConstraint(cm.elements[13]);

      expect(cm.elements.length).toBe(33);
      expect(cm.elements[13].baseId).toBe('Observation.category');
      expect(cm.elements[14].baseId).toBe('Observation.code');
      expect(resperate2.differential.element.length).toBe(7);

      const actualIds = resperate2.differential.element.map(e => e.id);
      const expectedIds = ['Observation', 'Observation.code', 'Observation.valueQuantity', 'Observation.valueQuantity.value', 'Observation.valueQuantity.unit', 'Observation.valueQuantity.system', 'Observation.valueQuantity.code'];
      expect(actualIds).toStrictEqual(expectedIds);
    });
  });

  describe('resprate observation', () => {
    let cm;
    let testData: IStructureDefinition;

    beforeEach(async () => {
      testData = <IStructureDefinition> JSON.parse(JSON.stringify(resprateProfileData));
      const obsModel = fhir.parser.structureDefinitions.find(sd => sd.id === 'Observation');
      cm = new ConstraintManager(ElementDefinition, obsModel, testData, fhir.parser);
      await cm.initializeRoot();

      expect(cm.elements.length).toBe(33);
      expect(cm.elements[0].constrainedElement).toBe(testData.differential.element[0]);
      expect(cm.elements[14].constrainedElement).toBe(testData.differential.element[1]);
      expect(cm.elements[21].constrainedElement).toBe(testData.differential.element[6]);
    });

    it('should expand constrained code', async () => {
      await cm.toggleExpand(cm.elements[14]);           // expand code

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

    it('should expand constrained code.coding', async () => {
      await cm.toggleExpand(cm.elements[14]);     // expand code
      await cm.toggleExpand(cm.elements[17]);     // expand code.coding

      expect(cm.elements[17].expanded).toBe(true);
      expect(cm.elements.length).toBe(45);

      const newElements = cm.elements.filter((e, i) => i >= 18 && i <= 24);
      const actualBasePaths = newElements.map(e => e.basePath);
      const expectedBasePaths = ["Observation.code.coding.id", "Observation.code.coding.extension", "Observation.code.coding.system", "Observation.code.coding.version", "Observation.code.coding.code", "Observation.code.coding.display", "Observation.code.coding.userSelected"];
      expect(actualBasePaths).toStrictEqual(expectedBasePaths);

      newElements.forEach(e => {
        expect(e.parent).toBe(cm.elements[17]);
        expect(e.depth).toBe(3);
      });

      await cm.toggleExpand(cm.elements[25]);
      expect(cm.elements.length).toBe(52);
    });

    it('should expand code.coding.code', async () => {
      await cm.toggleExpand(cm.elements[14]);     // expand code
      await cm.toggleExpand(cm.elements[17]);     // expand code.coding
      await cm.toggleExpand(cm.elements[22]);     // expand code.coding.code

      expect(cm.elements[22].expanded).toBe(true);
      expect(cm.elements.length).toBe(48);

      const newElements = cm.elements.filter((e, i) => i >= 23 && i <= 25);
      const actualBasePaths = newElements.map(e => e.basePath);
      const expectedBasePaths = ["Observation.code.coding.code.id", "Observation.code.coding.code.extension", "Observation.code.coding.code.value"];

      expect(actualBasePaths).toStrictEqual(expectedBasePaths);

      newElements.forEach(e => {
        expect(e.parent).toBe(cm.elements[22]);
        expect(e.depth).toBe(4);
        expect(e.hasChildren).toBe(e.baseId !== 'Observation.code.coding.code.value');
      });
    });

    it('should collapse code with code.coding.code', async () => {
      expect(cm.elements.length).toBe(33);
      await cm.toggleExpand(cm.elements[14]);     // expand code
      await cm.toggleExpand(cm.elements[17]);     // expand code.coding
      await cm.toggleExpand(cm.elements[24]);     // expand code.coding.code

      await cm.toggleExpand(cm.elements[14]);     // collapse code
      expect(cm.elements.length).toBe(33);

      const actualIds = cm.elements.map(e => e.baseId);
      expect(actualIds).toStrictEqual(["Observation","Observation.id","Observation.meta","Observation.implicitRules","Observation.language","Observation.text","Observation.contained","Observation.extension","Observation.modifierExtension","Observation.identifier","Observation.basedOn","Observation.partOf","Observation.status","Observation.category","Observation.code","Observation.subject","Observation.focus","Observation.encounter","Observation.effective[x]","Observation.issued","Observation.performer","Observation.value[x]","Observation.dataAbsentReason","Observation.interpretation","Observation.note","Observation.bodySite","Observation.method","Observation.specimen","Observation.device","Observation.referenceRange","Observation.hasMember","Observation.derivedFrom","Observation.component"]);
    });

    it('should expand constrained valueQuantity', async () => {
      // Expand the Observation.valueQuantity constraint, and we should get child properties for the Quantity data type
      await cm.toggleExpand(cm.elements[21]);
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
    const testData: IStructureDefinition = <IStructureDefinition> JSON.parse(JSON.stringify(shareablePlanDefinitionData));

    it('should initialize with the first level expanded', async () => {
      const planDefModel = <IStructureDefinition> fhir.parser.structureDefinitions.find(sd => sd.id === 'PlanDefinition');
      const cm = new ConstraintManager(ElementDefinition, planDefModel, testData, fhir.parser);
      await cm.initializeRoot();

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
      expect(constrainedElementTreeModels).toStrictEqual(testData.differential.element);
    });
  });

  describe('findChildren(element, elements)', () => {
    const testData: IStructureDefinition = <IStructureDefinition> JSON.parse(JSON.stringify(shareablePlanDefinitionData));

    it('should find children of a regular element', () => {
      const goalElement = testData.snapshot.element[38];
      const children = ConstraintManager.findElementChildren(goalElement.path, testData.snapshot.element);
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

      const rootChildren = ConstraintManager.findElementChildren(elements[0].path, elements);
      expect(rootChildren).toBeTruthy();
      expect(rootChildren.length).toBe(2);
      expect(rootChildren[0].id).toBe('PlanDefinition.goal');
      expect(rootChildren[1].id).toBe('PlanDefinition.goal:someSlice');

      // Asking for children of PlanDefinition.goal:someSlice
      const children1 = ConstraintManager.findElementChildren(elements[3].id, elements);
      expect(children1).toBeTruthy();
      expect(children1.length).toBe(4);
      expect(children1[0].id).toEqual('PlanDefinition.goal:someSlice.id');
      expect(children1[1].id).toEqual('PlanDefinition.goal:someSlice.target');
      expect(children1[2].id).toEqual('PlanDefinition.goal:someSlice.target:targetSlice1');
      expect(children1[3].id).toEqual('PlanDefinition.goal:someSlice.target:targetSlice2');

      // Should return single grand-child of the slice
      const children2 = ConstraintManager.findElementChildren(elements[5].id, elements);
      expect(children2).toBeTruthy();
      expect(children2.length).toBe(1);
      expect(children2[0].id).toEqual('PlanDefinition.goal:someSlice.target.id');

      // Asking for children of PlanDefinition.goal:someSlice.target:targetSlice1
      const children3 = ConstraintManager.findElementChildren(elements[7].id, elements);
      expect(children3).toBeTruthy();
      expect(children3.length).toBe(3);
      expect(children3[0].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice1.id');
      expect(children3[1].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice1.extension');
      expect(children3[2].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice1.reference');

      // Asking for children of PlanDefinition.goal:someSlice.target:targetSlice1.reference
      const children4 = ConstraintManager.findElementChildren(elements[10].id, elements);
      expect(children4).toBeTruthy();
      expect(children4.length).toBe(1);
      expect(children4[0].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice1.reference.reference');

      // Asking for children of PlanDefinition.goal:someSlice.target:targetSlice2
      const children5 = ConstraintManager.findElementChildren(elements[12].id, elements);
      expect(children5).toBeTruthy();
      expect(children5.length).toBe(1);
      expect(children5[0].id).toBe('PlanDefinition.goal:someSlice.target:targetSlice2.id');
    });
  });

  describe('findChildren(element)', () => {
    const testData: IStructureDefinition = <IStructureDefinition> JSON.parse(JSON.stringify(shareablePlanDefinitionData));

    it('should find children', async () => {
      const planDefModel = <IStructureDefinition> fhir.parser.structureDefinitions.find(sd => sd.id === 'PlanDefinition');
      const cm = new ConstraintManager(ElementDefinition, planDefModel, testData, fhir.parser);
      const children = await cm.findChildren(planDefModel.snapshot.element[0]);     // ask for children of PlanDefinition
      expect(children).toBeTruthy();
      expect(children.length).toBe(39);
    });

    it('should find children of a child type', async () => {
      const planDefModel = <IStructureDefinition> fhir.parser.structureDefinitions.find(sd => sd.id === 'PlanDefinition');
      const cm = new ConstraintManager(ElementDefinition, planDefModel, testData, fhir.parser);
      const children = await cm.findChildren(planDefModel.snapshot.element[2]);     // ask for children of PlanDefinition.meta
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

    /*
    it('should find children for a type that is no loaded', async () => {
      const getStructureDefinitionCalled = false;

      fhir.parser.parseBundle(cdaBundle);
      const cdaObs = <IStructureDefinition> fhir.parser.structureDefinitions.find(sd => sd.url === 'http://cda.../Observation');
      const cm = new ConstraintManager(ElementDefinition, cdaObs, someNewCdaTestData, fhir.parser);

      cm.getStructureDefinition = (url: string) => {
        // TODO: Return the requested StructureDefinition
        getStructureDefinitionCalled = true;
        return null;
      };

      await cm.initializeRoot();

      const children = await cm.findChildren(someParentElementWithATypeNotLoaded);

      expect(getStructureDefinitionCalled).toBe(true);
    });
       */
  });

  describe('maintain order after constraining', () => {
    let cm;
    let testData: IStructureDefinition;

    it('constrain Observation.note', async () => {
      testData = <IStructureDefinition>JSON.parse(JSON.stringify(observationHowDeathInjuryOccured));
      const obsModel = fhir.parser.structureDefinitions.find(sd => sd.id === 'Observation');
      cm = new ConstraintManager(ElementDefinition, obsModel, testData, fhir.parser);
      await cm.initializeRoot();

      expect(cm.elements.length).toBe(36);
      expect(cm.elements[21].constrainedElement).toBe(testData.differential.element[7]);
      expect(testData.differential.element[7].id).toBe('Observation.value[x]');
      expect(testData.differential.element[8].id).toBe('Observation.value[x].text');

      expect(testData.differential.element.length).toBe(23);
      cm.constrain(cm.elements[24]);
      expect(cm.elements.length).toBe(36);
      expect(testData.differential.element.length).toBe(24);
      expect(testData.differential.element[7].id).toBe('Observation.value[x]');
      expect(testData.differential.element[8].id).toBe('Observation.value[x].text'); // should fail here
      expect(testData.differential.element[9].id).toBe('Observation.note'); // also causes fail

    });

    it('constrain Observatione.note with must support', async () => {
      testData = <IStructureDefinition>JSON.parse(JSON.stringify(observationHowDeathInjuryOccured));
      const obsModel = fhir.parser.structureDefinitions.find(sd => sd.id === 'Observation');
      cm = new ConstraintManager(ElementDefinition, obsModel, testData, fhir.parser);
      await cm.initializeRoot();

      expect(cm.elements.length).toBe(36);
      expect(cm.elements[21].constrainedElement).toBe(testData.differential.element[7]);
      expect(testData.differential.element[7].id).toBe('Observation.value[x]');
      expect(testData.differential.element[8].id).toBe('Observation.value[x].text');

      expect(testData.differential.element.length).toBe(23);
      cm.constrain(cm.elements[24]);
      testData.differential.element[8].mustSupport = true;
      expect(cm.elements.length).toBe(36);
      expect(testData.differential.element.length).toBe(24);
      expect(testData.differential.element[7].id).toBe('Observation.value[x]');
      expect(testData.differential.element[8].id).toBe('Observation.value[x].text'); // should fail here
      expect(testData.differential.element[9].id).toBe('Observation.note'); // also causes fail


    });

  });
});
