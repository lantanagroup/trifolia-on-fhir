module.exports = {
  async up(db, client) {

    // update any existing examples that do not have a type property set to "CdaExample" since this was the only previously stored non-FHIR type
    let results = await db.collection('nonFhirResource').updateMany(
      {
        type: { $exists: false }
      },
      {
        $set: { type: 'CdaExample' }
      }
    );

    console.log(
      `Updated ${results.modifiedCount} Resources in the "nonFhirResource" collection`
    );
  },

  async down(db, client) {

    // remove type for any non-FHIR records that were set to "CdaExample"
    let results = await db.collection('nonFhirResource').updateMany(
      {
        type: 'CdaExample'
      },
      {
        $unset: { type: '' }
      }
    );


    console.log(
      `Updated ${results.modifiedCount} Resources in the "nonFhirResource" collection`
    );
  }
};
