const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    // Currently IG resources have a reference to their containing project in the "projects" field.
    // This fixes IG resources to properly contain a "referencedBy" reference to its parent project.

    let igResults = await db
      .collection('fhirResource')
      .find({
        'resource.resourceType': 'ImplementationGuide',
        'projects.0': { $exists: true },
        'referencedBy.valueType': { $ne: 'Project' },
      })
      .toArray();

    let count = 0;

    for (const igRes of igResults) {
      await db.collection('fhirResource').findOneAndUpdate(
        { _id: igRes._id },
        {
          $push: {
            referencedBy: {
              value: new ObjectId(igRes.projects[0]),
              valueType: 'Project',
              _id: new ObjectId(),
            },
          },
        }
      );

      count++;
    }

    console.log(`Modified ${count} resources in 'fhirResource' .`);
  },

  async down(db, client) {
    // Removes "Project" referencedBy entry from IG's current referencedBy list

    let igResults = await db
      .collection('fhirResource')
      .find({
        'resource.resourceType': 'ImplementationGuide',
        'projects.0': { $exists: true },
        'referencedBy.valueType': 'Project',
      })
      .toArray();

    let count = 0;

    for (const igRes of igResults) {
      await db.collection('fhirResource').findOneAndUpdate(
        { _id: igRes._id },
        {
          $pull: {
            referencedBy: { valueType: 'Project' },
          },
        }
      );

      count++;
    }

    console.log(`Modified ${count} resources in 'fhirResource' .`);
  },
};
