module.exports = {
  async up(db, client) {
    
    // sets isDeleted to true for any audit logs that were imported from the old database

    let res = await db.collection('audit').updateMany(
      {
        $or: [
          { 'what': { $exists: true } },
          { 'who': { $exists: true } },
        ]
      },
      [
        {
          $set: {
            'isDeleted': true,
          },
        },
      ]
    );
    
    console.log(`Set ${res.modifiedCount} audit logs to isDeleted: true`);

  },

  async down(db, client) {

    // sets isDeleted to false for any audit logs that were imported from the old database

    let res = await db.collection('audit').updateMany(
      {
        $or: [
          { 'what': { $exists: true } },
          { 'who': { $exists: true } },
        ]
      },
      [
        {
          $set: {
            'isDeleted': false,
          },
        },
      ]
    );

    console.log(`Set ${res.modifiedCount} audit logs to isDeleted: false`);
    
  }
};
