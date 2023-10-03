module.exports = {
  async up(db, client) {

    // Sets resource references from 'Example' to 'NonFhirResource' in the fhirResource collection
    let results = await db.collection('fhirResource').updateMany(
      { 'references.valueType': 'Example' },
      {
        $set: {
          'references.$[ref].valueType': 'NonFhirResource',
        },
      },
      {
        arrayFilters: [{ 'ref.valueType': 'Example' }],
      }
    );

    console.log(
      `Updated 'Example' to 'NonFhirResource' for ${results.modifiedCount} resources.`
    );
  },

  async down(db, client) {

    // Reverts change and sets resource references from 'NonFhirResource' to 'Example' in the fhirResource collection
    let results = await db.collection('fhirResource').updateMany(
      { 'references.valueType': 'NonFhirResource' },
      {
        $set: {
          'references.$[ref].valueType': 'Example',
        },
      },
      {
        arrayFilters: [{ 'ref.valueType': 'NonFhirResource' }],
      }
    );

    console.log(
      `Updated 'NonFhirResource' to 'Example' for ${results.modifiedCount} resources.`
    );
  },
};
