module.exports = {
  async up(db, client) {
    // remove fhirVersion to  'nonFhirResource'
    let results = await db.collection('nonFhirResource').updateMany(
      { },
      {
        $unset: {
          fhirVersion: '',
        },
      }
    );

    console.log(
      `Dropped fhirVersion for ${results.modifiedCount} resources in 'nonFhirResource' .`
    );
  },

  async down(db, client) {
    // add fhirVersion to 'nonFhirResource'
    let results = await db.collection('nonFhirResource').updateMany(
      { },
      {
        $set: {
          fhirVersion: 'r4',
        },
      }
    );

    console.log(
      `Added fhirVersion for ${results.modifiedCount} resources in 'nonFhirResource' .`
    );
  }
};
