const { ObjectId } = require('bson');

const hl7WorkGroups = [
  { code: 'ssdsd ', name: 'Administrative Steering Division', url: 'http://www.hl7.org/Special/committees/ssdsd' },
  { code: 'affildued ', name: 'Affiliate Due Diligence', url: 'http://www.hl7.org/Special/committees/affildued' },
  { code: 'gas', name: 'Anesthesia', url: 'http://www.hl7.org/Special/committees/gas' },
  { code: 'arb', name: 'Architectural Review', url: 'http://www.hl7.org/Special/committees/arb' },
  { code: 'arden', name: 'Arden Syntax', url: 'http://www.hl7.org/Special/committees/arden' },
  { code: 'brr', name: 'Biomedical Research and Regulation', url: 'http://www.hl7.org/Special/committees/rcrim' },
  { code: 'boardmotions', name: 'Board Motions', url: 'http://www.hl7.org/Special/committees/boardmotions' },
  { code: 'cdamg', name: 'CDA Management Group', url: 'http://www.hl7.org/Special/committees/cdamg' },
  { code: 'cds', name: 'Clinical Decision Support', url: 'http://www.hl7.org/Special/committees/dss' },
  { code: 'cg', name: 'Clinical Genomics', url: 'http://www.hl7.org/Special/committees/clingenomics' },
  { code: 'cimi', name: 'Clinical Information Modeling Initiative', url: 'http://www.hl7.org/Special/committees/cimi' },
  { code: 'cic', name: 'Clinical Interoperability Council', url: 'http://www.hl7.org/Special/committees/cic' },
  { code: 'cqi', name: 'Clinical Quality Information', url: 'http://www.hl7.org/Special/committees/cqi' },
  { code: 'desd', name: 'Clinical Steering Division', url: 'http://www.hl7.org/Special/committees/desd' },
  { code: 'homehealth', name: 'Community-Based Care and Privacy (CBCP)', url: 'http://www.hl7.org/Special/committees/homehealth' },
  { code: 'ictc', name: 'Conformance', url: 'http://www.hl7.org/Special/committees/ictc' },
  { code: 'cgp', name: 'Cross-Group Projects', url: 'http://www.hl7.org/Special/committees/cgp' },
  { code: 'education', name: 'Education', url: 'http://www.hl7.org/Special/committees/education' },
  { code: 'ehr', name: 'Electronic Health Records', url: 'http://www.hl7.org/Special/committees/ehr' },
  { code: 'ec', name: 'Electronic Services and Tools', url: 'http://www.hl7.org/Special/committees/esTools' },
  { code: '', name: 'Emergency Care', url: 'http://www.hl7.org/Special/committees/emergencycare' },
  { code: 'fhir', name: 'FHIR Infrastructure', url: 'http://www.hl7.org/Special/committees/fiwg' },
  { code: 'fmg', name: 'FHIR Management Group', url: 'http://www.hl7.org/Special/committees/fhirmg' },
  { code: 'fm', name: 'Financial Management', url: 'http://www.hl7.org/Special/committees/fm' },
  { code: 'gno', name: 'Governance and Operations', url: 'http://www.hl7.org/Special/committees/gno' },
  { code: 'healthcaredevices', name: 'Health Care Devices', url: 'http://www.hl7.org/Special/committees/healthcaredevices' },
  { code: 'foundtf', name: 'HL7 Foundation Task Force / Advisory Council', url: 'http://www.hl7.org/Special/committees/foundtf' },
  { code: 'hsswg', name: 'Human and Social Services', url: 'http://www.hl7.org/Special/committees/hsswg' },
  { code: 'imagemgt', name: 'Imaging Integration', url: 'http://www.hl7.org/Special/committees/imagemgt' },
  { code: 'its', name: 'Implementable Technology Specifications', url: 'http://www.hl7.org/Special/committees/xml' },
  { code: 'inm', name: 'Infrastructure and Messaging', url: 'http://www.hl7.org/Special/committees/inm' },
  { code: 'ftsd', name: 'Infrastructure Steering Division', url: 'http://www.hl7.org/Special/committees/ftsd' },
  { code: 'international', name: 'International Council', url: 'http://www.hl7.org/Special/committees/international' },
  { code: 'nominate', name: 'Leadership Development and Nomination Committee', url: 'http://www.hl7.org/Special/committees/nominate' },
  { code: 'lhs', name: 'Learning Health Systems', url: 'http://www.hl7.org/Special/committees/lhs' },
  { code: 'mobile', name: 'Mobile Health', url: 'http://www.hl7.org/Special/committees/mobile' },
  { code: 'mnm', name: 'Modeling and Methodology', url: 'http://www.hl7.org/Special/committees/mmm' },
  { code: 'oo', name: 'Orders and Observations', url: 'http://www.hl7.org/Special/committees/orders' },
  { code: 't3sd', name: 'Organizational Support Steering Division', url: 'http://www.hl7.org/Special/committees/t3sd' },
  { code: 'pa', name: 'Patient Administration', url: 'http://www.hl7.org/Special/committees/pafm' },
  { code: 'pc', name: 'Patient Care', url: 'http://www.hl7.org/Special/committees/patientare' },
  { code: 'pe', name: 'Patient Empowerment', url: 'http://www.hl7.org/Special/committees/patientempowerment' },
  { code: 'claims', name: 'Payer/Provider Information Exchange Work Group', url: 'http://www.hl7.org/Special/committees/claims' },
  { code: 'medication', name: 'Pharmacy', url: 'http://www.hl7.org/Special/committees/medication' },
  { code: 'policy', name: 'Policy Advisory Committee', url: 'http://www.hl7.org/Special/committees/policy' },
  { code: 'pi', name: 'Process Improvement', url: 'http://www.hl7.org/Special/committees/pi' },
  { code: 'projectServices', name: 'Project Services', url: 'http://www.hl7.org/Special/committees/projectServices' },
  { code: 'pher', name: 'Public Health', url: 'http://www.hl7.org/Special/committees/pher' },
  { code: 'publishing', name: 'Publishing', url: 'http://www.hl7.org/Special/committees/publishing' },
  { code: 'awards', name: 'Recognition and Awards', url: 'http://www.hl7.org/Special/committees/awards' },
  { code: 'sec', name: 'Security', url: 'http://www.hl7.org/Special/committees/secure' },
  { code: 'soa', name: 'Services Oriented Architecture', url: 'http://www.hl7.org/Special/committees/soa' },
  { code: '', name: 'Standards Governance Board', url: 'http://www.hl7.org/Special/committees/sgb' },
  { code: 'sd', name: 'Structured Documents', url: 'http://www.hl7.org/Special/committees/structure' },
  { code: 'tsc', name: 'Technical Steering Committee', url: 'http://www.hl7.org/Special/committees/tsc' },
  { code: 'termauth', name: 'Terminology Authority', url: 'http://www.hl7.org/Special/committees/termauth' },
  { code: 'us', name: 'US Realm Steering Committee', url: 'http://www.hl7.org/Special/committees/usrealm' },
  { code: 'v2', name: 'V2 Management Group', url: 'http://www.hl7.org/Special/committees/v2management' },
  { code: 'vocab', name: 'Vocabulary', url: 'http://www.hl7.org/Special/committees/vocab' }
];

module.exports = {
  async up(db, client) {
    let igResults = await db.collection('fhirResource').find({
      $and: [
        { 'resource.resourceType': 'ImplementationGuide' },
        { 'resource.contact': { $exists: true } }
      ]
    }).toArray();
    let count = 0;
    for (const igRes of igResults) {
      if (!igRes.resource.contact) igRes.resource.contact = [];
      const contacts = igRes.resource.contact;
      let foundContact = contacts.find(c => {
        return c.telecom && c.telecom.find(t => t.system === 'url' && t.value && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
      });
      if (foundContact) {
        //  console.log('Found contact');
        const telecom = foundContact.telecom.find(t => t.system === 'url' && t.value.toLowerCase().startsWith('http://www.hl7.org/Special/committees/'.toLowerCase()));
        const value = telecom.value;
        //  console.log('Value: ' + value);
        const wg = hl7WorkGroups.find(w => w.url === value);
        if (!!wg) {
          if (!igRes.resource.extension) igRes.resource.extension = [];

          let foundExt = igRes.resource.extension.find(e => {
            let b = e.url == 'http://hl7.org/fhir/StructureDefinition/structuredefinition-wg' && e.valueCode == wg.code;
            return b;
          });
          if (!foundExt && value) {
            foundExt = {
              url: 'http://hl7.org/fhir/StructureDefinition/structuredefinition-wg',
              valueCode: wg.code
            };
            igRes.resource.extension.push(foundExt);
            // update ig
            await db.collection('fhirResource').updateOne({ '_id': new ObjectId(igRes._id) }, { $set: igRes });
            count++;
          }
        } else {
         // console.log('Bad value is: ' + value + 'ig: ' + igRes._id);
        }
      }
    }

    console.log(`Up-Updated extension for ${count} Ig-s `);
  },


  async down(db, client) {
    let igResults = await db.collection('fhirResource').find({
      $and: [
        { 'resource.resourceType': 'ImplementationGuide' },
        { 'resource.extension': { $exists: true } }
      ]
    }).toArray();
    let count = 0;
    for (const igRes of igResults) {
      if (!igRes.resource.extension) igRes.resource.extension = [];
      let foundExt = igRes.resource.extension.find(e => {
        return e.url == 'http://hl7.org/fhir/StructureDefinition/structuredefinition-wg';
      });
      if (foundExt) {
        const index = igRes.resource.extension.indexOf(foundExt);
        igRes.resource.extension.splice(index, index >= 0 ? 1 : 0);
        if (igRes.resource.extension.length === 0) delete igRes.resource.extension;
        await db.collection('fhirResource').updateOne({ '_id': new ObjectId(igRes._id) }, { $set: igRes });
        count++;
      }
    }
    console.log(`Down-Deleted extension for ${count} Ig-s `);
  }
};
