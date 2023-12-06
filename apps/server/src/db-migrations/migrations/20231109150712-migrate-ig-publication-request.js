const { ReturnDocument } = require('mongodb');
const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    const migrate = async function(extensionUrl, type) {
      let igResults = await db.collection('fhirResource').find({
        $and: [
          { 'resource.resourceType': 'ImplementationGuide' },
          { 'resource.extension.url': extensionUrl }
        ]
      }).toArray();

      let count = 0;



      for (const igRes of igResults) {
        // create new non-fhir resource

        let existingExtension = (igRes.resource.extension || []).find(r => r.url === extensionUrl);
        if (!existingExtension) {
          continue;
        }

        const PublicationRequestReference = existingExtension.valueReference ? existingExtension.valueReference.reference : '';
        if (!PublicationRequestReference.startsWith('#')) continue;

        // get the content to store
        let existingContained = existingExtension && existingExtension.valueReference && existingExtension.valueReference.reference ?
          igRes.resource.contained.find(c => c.resourceType == 'DocumentReference' && c.id === existingExtension.valueReference.reference.substring(1)) : null;

        if(existingContained) {
          const typeContained = existingContained.type;
          if (!typeContained || !typeContained.coding || typeContained.coding.length < 1) continue;
          let coding = typeContained.coding.find(c => c.code === "publication-request");
          if(!coding){
            continue;
          }
          const contentContained = existingContained.content;
          if(!contentContained || contentContained.length < 1 || !contentContained[0].attachment || !contentContained[0].attachment.data)  continue;
          let value = atob(existingContained.content[0].attachment.data);
          value = JSON.parse(value);
          let projects = [];
          if (igRes.projects){
            projects = [...igRes.projects];
          }
          let newRes = {
            versionId: 1,
            lastUpdated: new Date(),
            content: value,
            type: type,
            referencedBy: [{ _id: new ObjectId(), value: igRes._id, valueType: 'FhirResource' }],
            references: [],
            projects: projects
          };
          const updateResult = await db.collection('nonFhirResource').findOneAndUpdate(
            { type: type, 'referencedBy.value': igRes._id, 'referencedBy.valueType': 'FhirResource', $or: [{ "isDeleted": { $exists: false } }, { isDeleted : false }] },
            { $set: newRes }, { upsert: true, returnDocument: ReturnDocument.AFTER }
          );
          // remove this publication-request from the current IG resource's extension list and contained list and add the new reference
          await db.collection('fhirResource').findOneAndUpdate({ _id: igRes._id },
            {
              $pull: { 'resource.extension': { 'url': extensionUrl }, 'resource.contained': { 'id': existingContained.id } },
              $push: { 'references': { _id: new ObjectId(), value: updateResult.value._id, valueType: 'NonFhirResource' } }
            }
          );
        }
        else {
          await db.collection('fhirResource').findOneAndUpdate({ _id: igRes._id },
            {
              $pull: { 'resource.extension': { 'url': extensionUrl } }
            }
          );
        }

        count++;
      }
      console.log(`Modified ${count} resources in 'fhirResource' .`);
    };

    // migrate IG Publication Request
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-publication-request', 'PublicationRequest');
  },

  async down(db, client) {

    const migrate = async function(extensionUrl, type) {

      let nonFhirResults = await db.collection('nonFhirResource').find({type: type,  $or: [{ "isDeleted": { $exists: false } }, { isDeleted : false }]}).toArray();

      let count = 0;

      for (const nonFhirRes of nonFhirResults) {

        let content = JSON.stringify(nonFhirRes.content)

        let extension = {
          url: extensionUrl,
          valueReference: {
            reference: `#publication-request`
          }
        };
        let contained = {
          resourceType: 'DocumentReference',
          id: 'publication-request',
          status: 'current',
          type: {
            coding: [{
              code: 'publication-request'
            }]
          },
          content: [{
            attachment: {
              contentType: 'application/json',
              data: btoa(content)
            }
          }]
        };
        // add to referenced IG FHIR resource
        await db.collection('fhirResource').findOneAndUpdate(
          { _id: nonFhirRes.referencedBy[0].value},
          {
            $push: { 'resource.extension': extension, 'resource.contained': contained },
            $pull: { 'references': { value: nonFhirRes._id, valueType: 'NonFhirResource' } }
          });
        await db.collection('nonFhirResource').deleteOne({ _id: nonFhirRes._id });

        count++;
      }
      console.log(`Modified ${count} resources in 'fhirResource' .`);
    }
    // migrate IG Publication Request
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-publication-request', 'PublicationRequest');

  }
};
