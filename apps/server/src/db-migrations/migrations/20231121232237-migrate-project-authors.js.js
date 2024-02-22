 module.exports = {
  async up(db, client) {
    let count = 0;
    let projects = await db.collection('project').find({}).toArray();
    for (const proj of projects) {
        // find the author
        if (proj.author) {
          let names = proj.author.split(' ');
          proj.author = [];
          let users = await db.collection('user').find({ 'firstName': names[0], 'lastName': names[1] }).toArray();
          for (let i = 0; i < (users.length || 0); i++) {
            proj.author.push(users[i]._id);
          }
          await db.collection('project').updateOne({ _id: proj._id }, { $set: proj });
          count++;
        }
      }
    console.log(`Up-Updated author for ${count} projects `
    );
  },

  async down(db, client) {
    let count = 0;
    let projects = await db.collection('project').find({}).toArray();
    for (const proj of projects) {
      // find the author
      if (proj.author && proj.author.length > 0) {
        let user = await db.collection('user').find({_id: proj.author[0]}).toArray();
        proj.author = user[0].firstName + ' ' + user[0].lastName;
        await db.collection('project').updateOne({ _id: proj._id }, { $set: proj });
        count++;
      }
    }
    console.log(`Down-Updated author for ${count} projects `
    );
  }
};
