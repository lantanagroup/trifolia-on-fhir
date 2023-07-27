module.exports = {
  async up(db, client) {
    // renames the "example" collection to the new "nonFhirResource" name
    await db.renameCollection('example', 'nonFhirResource', { dropTarget: true });
    console.log("Renamed 'example' collection to 'nonFhirResource'");
  },

  async down(db, client) {
    // restores old "example" collection name from "nonFhirResource"
    await db.renameCollection('nonFhirResource', 'example', { dropTarget: true });
    console.log("Renamed 'nonFhirResource' collection to 'example'");
  }
};
