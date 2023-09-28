module.exports = {
  async up(db, client) {
    // renames the "conformance" collection to the new "fhirResource" name
    await db.renameCollection('conformance', 'fhirResource', { dropTarget: true });
    console.log("Renamed 'conformance' collection to 'fhirResource'");
  },

  async down(db, client) {
    // restores old "conformance" collection name from "fhirResource"
    await db.renameCollection('fhirResource', 'conformance', { dropTarget: true });
    console.log("Renamed 'fhirResource' collection to 'conformance'");
  }
};
