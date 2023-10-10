module.exports = {
  async up(db, client) {
    // convert any FHIR resources with meta.versionId as a date to the expected ISO string

    let res = await db.collection('fhirResource').updateMany(
      {
        'resource.meta.lastUpdated': {
          $type: 'date',
        },
      },
      [
        {
          $set: {
            'resource.meta.lastUpdated': {
              $toString: '$resource.meta.lastUpdated',
            },
          },
        },
      ]
    );

    console.log(`Converted ${res.modifiedCount} FHIR resources with meta.lastUpdated as a date to a string`);
  },

  async down(db, client) {
    // no need to undo this conversion since these should have already been strings per the FHIR spec
  },
};
