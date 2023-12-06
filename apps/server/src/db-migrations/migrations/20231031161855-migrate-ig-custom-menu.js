const { customAlphabet } = require('nanoid');
const { ReturnDocument } = require('mongodb');
const { ObjectId } = require('bson');

module.exports = {
  async up(db, client) {

    const migrate = async function(extensionUrl, type) {
      let igResults = await db.collection('fhirResource').find({
        $and: [
          { 'resource.resourceType': 'ImplementationGuide' },
          { 'resource.extension.url': extensionUrl }
        ]
      }).toArray();

      for (const igRes of igResults) {
        // create new non-fhir resource
        let existingExtension = (igRes.resource.extension || []).find(r => r.url === extensionUrl);
        if (!existingExtension) {
          continue;
        }
        const customMenuReference = existingExtension.valueReference ? existingExtension.valueReference.reference : '';
        if (!customMenuReference.startsWith('#')) continue;

        // get the content to store
        let existingContained = existingExtension && existingExtension.valueReference && existingExtension.valueReference.reference ?
          igRes.resource.contained.find(c => c.resourceType == 'DocumentReference' && c.id === existingExtension.valueReference.reference.substring(1)) : null;

        if(existingContained) {
          const typeContained = existingContained.type;
          if (!typeContained || !typeContained.coding || typeContained.coding.length < 1) continue;
          let coding = typeContained.coding.find(c => c.code === "custom-menu");
          if(!coding){
            continue;
          }
          const contentContained = existingContained.content;
          if(!contentContained || contentContained.length < 1 || !contentContained[0].attachment || !contentContained[0].attachment.data)  continue;
          let value = atob(existingContained.content[0].attachment.data);
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
            { type: type, 'referencedBy.value': igRes._id, 'referencedBy.valueType': 'FhirResource' },
            { $set: newRes }, { upsert: true, returnDocument: ReturnDocument.AFTER }
          );

          // remove this custom menu from the current IG resource's extension list and contained list and add the new reference
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
      }
    };

    // migrate IG Custom Menu
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-custom-menu', 'CustomMenu');
  },

  async down(db, client) {

    function generateId() {
      const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUBWXYZ', 8);
      return nanoid();
    }

    const migrate = async function(extensionUrl, type) {

      let nonFhirResults = await db.collection('nonFhirResource').find({type: type }).toArray();

      for (const nonFhirRes of nonFhirResults) {
        let extension = {
          url: extensionUrl,
          valueReference: {
            reference: `#${generateId()}`
          }
        };
        let contained = {
          resourceType: 'DocumentReference',
          id: extension.valueReference.reference.substring(1),
          status: 'current',
          type: {
            coding: [{
              code: 'custom-menu'
            }]
          },
          content: [{
            attachment: {
              contentType: 'application/xml',
              title: 'menu.xml',
              data: btoa(nonFhirRes.content)
            }
          }]
        };
        // add to referenced IG FHIR resource
        await db.collection('fhirResource').findOneAndUpdate(
          { _id: nonFhirRes.referencedBy[0].value },
          {
            $push: { 'resource.extension': extension, 'resource.contained': contained },
            $pull: { 'references': { value: nonFhirRes._id, valueType: 'NonFhirResource' } }
          });
        await db.collection('nonFhirResource').deleteOne({ _id: nonFhirRes._id });
      }
    }

    // migrate IG Custom Menu
    await migrate('https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-custom-menu', 'CustomMenu');
  }
};

