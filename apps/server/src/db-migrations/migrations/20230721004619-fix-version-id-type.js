/**
 * Updates every conformance object that has a meta.versionId that is currently a number to a string
 */

module.exports = {
  async up(db, client) {
    console.log(
      'Updating conformance resources with a numeric meta.versionId to be a string'
    );

    const results = await db
      .collection('conformance')
      .updateMany({ 'resource.meta.versionId': { $type: 'number' } }, [
        {
          $set: {
            'resource.meta.versionId': {
              $toString: '$resource.meta.versionId',
            },
          },
        },
      ]);

    console.log(
      `Updated versionId's type of ${results.modifiedCount} resources`
    );
  },

  async down(db, client) {
    console.log('Reverting meta.versionId to be a number.');

    const results = await db
      .collection('conformance')
      .updateMany({ 'resource.meta.versionId': { $type: 'string' } }, [
        {
          $set: {
            'resource.meta.versionId': { $toInt: '$resource.meta.versionId' },
          },
        },
      ]);

    console.log(
      `Reverted versionId's type of ${results.modifiedCount} resources`
    );
  },
};
