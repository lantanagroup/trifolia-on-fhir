const { ObjectId, ReturnDocument } = require("mongodb");

module.exports = {
  async up(db, client) {

    const migrate = async function (extensionUrl, type) {
      let igResults = await db.collection('fhirResource').find({
        $and: [
          {'resource.resourceType': 'ImplementationGuide'},
          {'resource.extension.url':extensionUrl}
        ]
      }).toArray();

      let count = 0;

      for (const igRes of igResults) {

          let existingExtension = (igRes.resource.extension || []).find(r => r.url === extensionUrl);
          if (!existingExtension) {
            continue;
          }
          let templateContent = "";
          let templateType = "";
          if (existingExtension.hasOwnProperty('valueUri')) {
            templateContent = existingExtension.valueUri;
            templateType = 'custom-uri';
          } else if (existingExtension.hasOwnProperty('valueString')) {
            templateContent = existingExtension.valueString;
            templateType = 'official';
          }

          let projects = [];
          if (igRes.projects) {
            projects = [...igRes.projects];
          }

          let newRes = {
            versionId: 1,
            lastUpdated: new Date(),
            content: templateContent,
            templateType: templateType,
            type: type,
            referencedBy: [{ _id: new ObjectId(), value: igRes._id, valueType: 'FhirResource' }],
            references: [],
            projects: projects
          };

          const updateResult = await db.collection('nonFhirResource').findOneAndUpdate(
            { type: type, 'referencedBy.value': igRes._id, 'referencedBy.valueType': 'FhirResource', $or: [{ "isDeleted": { $exists: false } }, { isDeleted: false }] },
            { $set: newRes }, { upsert: true, returnDocument: ReturnDocument.AFTER }
          );
          // remove this pub-template from the current IG resource's extension list and contained list and add the new reference
          await db.collection('fhirResource').findOneAndUpdate({ _id: igRes._id },
            {
              $pull: { 'resource.extension': { 'url': extensionUrl } },
              $push: { 'references': { _id: new ObjectId(), value: updateResult.value._id, valueType: 'NonFhirResource' } }
            }
          );


        count++;
      }
      console.log(`Modified ${count} resources in 'fhirResource' .`);
    }

    // migrate SD templates
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-pub-template', 'Template');
  },

  async down(db, client) {

    const migrate = async function(extensionUrl, type) {

      let nonFhirResults = await db.collection('nonFhirResource').find({type: type}).toArray();

      let count = 0;

      for (const nonFhirRes of nonFhirResults) {

        let value = {url: extensionUrl}
         if(nonFhirRes["templateType"] == 'official'){
           value["valueString"] = nonFhirRes.content;
         }
         else if(nonFhirRes["templateType"] == 'custom-uri') {
           value["valueUri"] = nonFhirRes.content;
         }
        // add to referenced IG FHIR resource
        if(nonFhirRes["templateType"] == 'official' || nonFhirRes["templateType"] == 'custom-uri') {
          await db.collection('fhirResource').findOneAndUpdate(
            { _id: nonFhirRes.referencedBy[0].value },
            {
              $push: { 'resource.extension': value },
              $pull: { 'references': { value: nonFhirRes._id, valueType: 'NonFhirResource' } }
            });

          await db.collection('nonFhirResource').deleteOne({ _id: nonFhirRes._id });
          count++;
        }


      }
      console.log(`Modified ${count} resources in 'fhirResource' .`);
    }

    // migrate SD intros
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-pub-template', 'Template');

  }
};
