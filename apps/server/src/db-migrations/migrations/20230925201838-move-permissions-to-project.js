module.exports = {
  async up(db, client) {
    // Moves permissions from IGs to projects while merging any existing permissions
    // Adds a __permissionsPreMigration field to projects to allow for a rollback

    await db
      .collection('project')
      .aggregate([
        {
          $lookup: {
            from: 'fhirResource',
            localField: 'references.value',
            foreignField: '_id',
            as: 'igReferences',
          },
        },
        {
          $addFields: {
            __permissionsPreMigration: '$permissions',
          },
        },
        {
          $set: {
            permissions: {
              $reduce: {
                input: '$igReferences',
                initialValue: {
                  $cond: {
                    if: { $isArray: '$permissions' },
                    then: '$permissions',
                    else: [],
                  },
                },
                in: {
                  $setUnion: ['$$value', '$$this.permissions'],
                },
              },
            },
          },
        },
        {
          $unset: 'igReferences',
        },
        {
          $merge: {
            into: 'project',
            on: '_id',
            whenMatched: 'replace',
          },
        },
      ])
      .toArray();

    await db.collection('project').updateMany(
      { '__permissionsPreMigration.0': { $exists: false } },
      {
        $unset: { __permissionsPreMigration: '' },
      }
    );

    console.log('Updated project permissions.');
  },

  async down(db, client) {
    // Restores previous permissions from the __permissionsPreMigration field

    await db
      .collection('project')
      .updateMany({}, [
        { $set: { permissions: '$__permissionsPreMigration' } },
      ]);

    await db.collection('project').updateMany(
      { __permissionsPreMigration: { $exists: true } },
      {
        $unset: { __permissionsPreMigration: '' },
      }
    );

    console.log('Restored previous project permissions.');
  },
};
