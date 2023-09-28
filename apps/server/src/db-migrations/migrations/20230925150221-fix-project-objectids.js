module.exports = {
  async up(db, client) {
    // Converts string IDs to ObjectIds in projects.references and resource.projects fields

    await db.collection('project').updateMany(
      {
        'references.value': { $type: 'string' },
      },
      [
        {
          $set: {
            references: {
              $map: {
                input: '$references',
                as: 'ref',
                in: {
                  value: { $convert: { input: '$$ref.value', to: 'objectId' } },
                  valueType: '$$ref.valueType',
                  _id: '$$ref._id',
                },
              },
            },
          },
        },
      ]
    );

    const resAgg = [
      {
        $set: {
          projects: {
            $map: {
              input: '$projects',
              as: 'project',
              in: { $convert: { input: '$$project', to: 'objectId' } },
            },
          },
        },
      },
    ];

    await db.collection('fhirResource').updateMany(
      { 'projects.0': { $type: 'string' } },
      resAgg
    );

    await db.collection('nonFhirResource').updateMany(
      { 'projects.0': { $type: 'string' } },
      resAgg
    );
  },

  async down(db, client) {
    // No need to revert this since data model already required ObjectIds
  },
};
