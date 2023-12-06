const { ObjectId } = require('bson');

module.exports = {
  async up(db, client) {

    const addHistory = async function (type) {
      let nonFhirResources = await db
        .collection('nonFhirResource')
        .find({ 'type': type })
        .toArray();

      let count = 0;

      for (const nfRes of nonFhirResources) {
        let newHistory = {
          content: nfRes.content,
          versionId: 1,
          lastUpdated: nfRes.lastUpdated,
          current: { _id: new ObjectId(), value: nfRes._id.toString(), valueType: 'NonFhirResource' },
        }

        await db.collection('history').updateOne(
          { 'versionId': 1, 'current.value': nfRes._id.toString(), 'current.valueType': 'NonFhirResource' },
          { $setOnInsert: newHistory }, { upsert: true }
        );
        count++;
      }
      console.log(`Inserted ${count} resources in 'history' for type ${type}.`);
    }

    await addHistory('Page');
    await addHistory('StructureDefinitionIntro');
    await addHistory('StructureDefinitionNotes');

  },

  async down(db, client) {

  }
};
