module.exports = {
  async up(db, client) {
    // Non-IG resources currently lack a reference to their containing project
    // This sets the "projects" field to match the containing IG's "projects" field

    const migrate = async function (collection) {
      db.collection(collection).aggregate([
        {
          $match: {
            'projects.0': { $exists: false },
          },
        },
        {
          $lookup: {
            from: collection,
            localField: 'referencedBy.value',
            foreignField: '_id',
            as: 'projectReference',
          },
        },
        {
          $set: {
            projects: { $first: '$projectReference.projects' },
          },
        },
        {
          $unset: 'projectReference',
        },
        {
          $merge: {
            into: collection,
            on: '_id',
            whenMatched: 'replace',
          },
        },
      ]).toArray();

      console.log(`Updated ${collection}`);
    };

    await migrate('fhirResource');
    await migrate('nonFhirResource');
  },

  async down(db, client) {
    // Removes the "projects" field from all non-IG resources
    await db.collection('fhirResource').updateMany(
      {
        'projects.0': { $exists: true },
        'resource.resourceType': { $ne: 'ImplementationGuide' },
      },
      {
        $unset: { projects: '' },
      }
    );

    await db.collection('nonFhirResource').updateMany(
      {
        'projects.0': { $exists: true },
        'resource.resourceType': { $ne: 'ImplementationGuide' },
      },
      {
        $unset: { projects: '' },
      }
    );
  }

};
