module.exports = {
  async up(db, client) {

    // removes permissions from fhirResource and nonFhirResource collections
    // stores previous permissions in __permissionsPreMigration field to allow for rollback

    const removePermissions = async function (collection) {
      await db.collection(collection).updateMany(
        {
          permissions: { $exists: true },
        },
        [
          {
            $set: {
              __permissionsPreMigration: "$permissions",
            },
          },
          {
            $unset: 'permissions'
          }
        ]
      );

      console.log(`Removed permissions from ${collection}`);
    };
    
    await removePermissions('fhirResource');
    await removePermissions('nonFhirResource');
  },

  async down(db, client) {

    // restores permissions to fhirResource and nonFhirResource collections using __permissionsPreMigration field

    const restorePermissions = async function (collection) {
      await db.collection(collection).updateMany(
        {
          __permissionsPreMigration: { $exists: true },
        },
        [
          {
            $set: {
              permissions: "$__permissionsPreMigration",
            },
          },
          {
            $unset: '__permissionsPreMigration'
          }
        ]
      );

      console.log(`Restored permissions to ${collection}`);
    };

    await restorePermissions('fhirResource');
    await restorePermissions('nonFhirResource');

  }
};
