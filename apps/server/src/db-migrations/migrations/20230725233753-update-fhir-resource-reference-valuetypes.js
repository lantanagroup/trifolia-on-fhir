module.exports = {
  async up(db, client) {

    // Sets resource references from 'Conformance' to 'FhirResource' in the fhirResource collection
    let results = await db.collection('fhirResource').updateMany(
      { 'references.valueType': 'Conformance' },
      {
        $set: {
          'references.$[ref].valueType': 'FhirResource',
        },
      },
      {
        arrayFilters: [{ 'ref.valueType': 'Conformance' }],
      }
    );

    console.log(
      `Updated 'Conformance' to 'FhirResource' for ${results.modifiedCount} resources.`
    );
  },

  async down(db, client) {

    // Reverts change and sets resource references from 'FhirResource' to 'Conformance' in the fhirResource collection
    let results = await db.collection('fhirResource').updateMany(
      { 'references.valueType': 'FhirResource' },
      {
        $set: {
          'references.$[ref].valueType': 'Conformance',
        },
      },
      {
        arrayFilters: [{ 'ref.valueType': 'FhirResource' }],
      }
    );

    console.log(
      `Updated 'FhirResource' to 'Conformance' for ${results.modifiedCount} resources.`
    );
  },
};
