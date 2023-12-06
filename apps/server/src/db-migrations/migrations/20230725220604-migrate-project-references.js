
module.exports = {
  async up(db, client) {
    // renames "igs" property on projects to "references"
    let results = await db
      .collection('project')
      .updateMany(
        { igs: { $exists: true } },
        { $rename: { igs: 'references' } }
      );

    console.log(
      `Renamed project 'igs' field to 'references' for ${results.modifiedCount} projects`
    );

    // restructures references property from an ObjectId array to a ProjectResourceReference array
    results = await db
      .collection('project')
      .updateMany({ 'references.0.value': { $exists: false } }, [
        {
          $set: {
            references: {
              $map: {
                input: '$references',
                as: 'reference',
                in: {
                  value: '$$reference',
                  valueType: 'FhirResource',
                  _id: '$_id',
                },
              },
            },
          },
        },
      ]);

    console.log(
      `Updated references for ${results.modifiedCount} projects to ProjectResourceReference objects`
    );
  },



  async down(db, client) {
    // restructures references property from a ProjectResourceReference array to flat ObjectId array
    let results = await db
      .collection('project')
      .updateMany({ 'references.0.value': { $exists: true } }, [
        {
          $set: {
            references: {
              $map: {
                input: '$references',
                as: 'reference',
                in: '$$reference.value',
              },
            },
          },
        },
      ]);

    console.log(
      `Updated ProjectResourceReference array for ${results.modifiedCount} projects to flat ObjectId arrays.`
    );

    // renames "references" property on projects to "igs"
    results = await db
      .collection('project')
      .updateMany(
        { references: { $exists: true } },
        { $rename: { references: 'igs' } }
      );

    console.log(
      `Renamed project 'references' field to 'igs' for ${results.modifiedCount} projects.`
    );
  },
};
