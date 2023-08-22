const { ObjectId, ReturnDocument } = require("mongodb");

module.exports = {
  async up(db, client) {
        
    const migrate = async function (extensionUrl, type) {
      let sdResults = await db.collection('fhirResource').find({ 
        $and: [
          {'resource.resourceType':'StructureDefinition'}, 
          {'resource.extension.url':extensionUrl}
        ] 
      }).toArray();

      for (const sdRes of sdResults) {

        // create new non-fhir resource
        let existingExtension = (sdRes.resource.extension || []).find(r => r.url === extensionUrl);
        if (!existingExtension) {
          continue;
        }

        let newRes = {
          versionId: 1,
          lastUpdated: new Date(),
          content: existingExtension.valueMarkdown,
          type: type,
          referencedBy: [ { _id: new ObjectId(), value: sdRes._id, valueType: 'FhirResource' }],
          references: []
        };

        const updateResult = await db.collection('nonFhirResource').findOneAndUpdate(
          { type: type, 'referencedBy.value': sdRes._id, 'referencedBy.valueType': 'FhirResource' }, 
          { $set: newRes }, { upsert: true, returnDocument: ReturnDocument.AFTER }
        );

        // remove this intro from the current SD resource's extension list and add the new reference
        await db.collection('fhirResource').findOneAndUpdate({_id: sdRes._id},  
          { 
            $pull: {'resource.extension': {'url': extensionUrl} },
            $push: {'references': {_id: new ObjectId(), value: updateResult.value._id, valueType: 'NonFhirResource' } }
          }
        );

      }

    }



    // migrate SD intros
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-sd-intro', 'StructureDefinitionIntro');

    // migrate SD notes
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-sd-notes', 'StructureDefinitionNotes');    

  },



  async down(db, client) {

    const migrate = async function(extensionUrl, type) {

      let nonFhirResults = await db.collection('nonFhirResource').find({type: type}).toArray();

      for (const nonFhirRes of nonFhirResults) {

        // add to referenced SD FHIR resource
        await db.collection('fhirResource').findOneAndUpdate(
          { _id: nonFhirRes.referencedBy[0].value }, 
          {
            $push: { 'resource.extension': { url: extensionUrl, valueMarkdown: nonFhirRes.content } },
            $pull: { 'references': { value: nonFhirRes._id, valueType: 'NonFhirResource' } }
          });

        await db.collection('nonFhirResource').deleteOne({_id: nonFhirRes._id});

      }

    }

    // migrate SD intros
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-sd-intro', 'StructureDefinitionIntro');

    // migrate SD notes
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-sd-notes', 'StructureDefinitionNotes');


  }
};
