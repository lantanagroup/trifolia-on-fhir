module.exports = {
  async up(db, client) {
    // Rename the "igIds" property to "referencedBy" in the nonFhirResource collection
    let results = await db.collection('nonFhirResource').updateMany(
      { igIds: { $exists: true } },
      {
        $rename: { igIds: 'referencedBy' },
      }
    );

    console.log(
      `Renamed "igIds" to "referencedBy" for ${results.modifiedCount} resources in the "nonFhirResource" collection`
    );

    // Sets "referencedBy" ObjectId array to an array of ProjectResourceReference objects
    results = await db
      .collection('nonFhirResource')
      .updateMany({ 'referencedBy.0': { $exists: true } }, [
        {
          $set: {
            referencedBy: {
              $map: {
                input: '$referencedBy',
                as: 'ref',
                in: {
                  value: '$$ref',
                  valueType: 'FhirResource',
                  _id: '$_id',
                },
              },
            },
          },
        },
      ]);
    console.log(
      `Updated "referencedBy" for ${results.modifiedCount} resources to ProjectResourceReference objects`
    );
  },

  async down(db, client) {
    // Sets "referencedBy" array of ProjectResourceReference objects to an ObjectId array
    let results = await db
      .collection('nonFhirResource')
      .updateMany({ 'referencedBy.0': { $exists: true } }, [
        {
          $set: {
            referencedBy: {
              $map: {
                input: '$referencedBy',
                as: 'ref',
                in: '$$ref.value',
              },
            },
          },
        },
      ]);

    console.log(
      `Updated "referencedBy" ProjectResourceReference objects for ${results.modifiedCount} resources to flat ObjectId arrays.`
    );

    // Rename the "referencedBy" property to "igIds" in the nonFhirResource collection
    results = await db.collection('nonFhirResource').updateMany(
      { referencedBy: { $exists: true } },
      {
        $rename: { referencedBy: 'igIds' },
      }
    );

    console.log(
      `Renamed "referencedBy"to "igIds" for ${results.modifiedCount} resources in the "nonFhirResource" collection`
    );
  }
};
