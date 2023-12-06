module.exports = {
  async up(db, client) {
    
    // renames the "example" collection (if it exists) to the new "nonFhirResource" name
    if ((await db.listCollections({name: 'example'}).toArray()).length > 0) {
      await db.renameCollection('example', 'nonFhirResource', { dropTarget: true });
      console.log("Renamed 'example' collection to 'nonFhirResource'");
    } else {
      console.log("The 'example' collection doesn't exist, skipping renaming.");
    }
    
  },

  async down(db, client) {

    // restores old "example" collection name from "nonFhirResource" (if it exists)
    if ((await db.listCollections({name: 'nonFhirResource'}).toArray()).length > 0) {
      await db.renameCollection('nonFhirResource', 'example', { dropTarget: true });
      console.log("Renamed 'nonFhirResource' collection to 'example'");
    } else {
      console.log("The 'nonFhirResource' collection doesn't exist, skipping renaming.");
    }    
    
  }
};
