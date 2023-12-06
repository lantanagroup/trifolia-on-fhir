module.exports = {
  async up(db, client) {

    // renames the "conformance" collection (if it exists) to the new "fhirResource" name
    if ((await db.listCollections({name: 'conformance'}).toArray()).length > 0) {
      await db.renameCollection('conformance', 'fhirResource', { dropTarget: true });
      console.log("Renamed 'conformance' collection to 'fhirResource'");  
    } else {
      console.log("The 'conformance' collection doesn't exist, skipping renaming.");
    }
    
  },

  async down(db, client) {

    // restores old "conformance" collection name from "fhirResource" (if it exists)
    if ((await db.listCollections({name: 'fhirResource'}).toArray()).length > 0) {
      await db.renameCollection('fhirResource', 'conformance', { dropTarget: true });
      console.log("Renamed 'fhirResource' collection to 'conformance'");
    } else {
      console.log("The 'fhirResource' collection doesn't exist, skipping renaming.");
    }
  }
  
};
