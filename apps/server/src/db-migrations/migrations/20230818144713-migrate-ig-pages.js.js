const { ObjectId } = require('bson');
module.exports = {

  async up(db, client) {


    async function migrateExtensions(ig, page) {
      if (!page) {
        return;
      }
      let pageContent = '';
      let navMenu = '';
      let reuseDescription = false;

      let name = page.nameUrl ?? page.nameReference?.reference;
      if (!name) {
        return;
      }
      let pageName = name;
      if (pageName && pageName.indexOf('.') > -1) {
        pageName = pageName.substring(0, pageName.indexOf('.'));
      }

      // add it if only for those extensions

      let createPage = false;
      for (let i = 0; i < (page.extension?.length || 0); i++) {
        if (page.extension[i].url.indexOf('extension-ig-page-content') > -1) {
          pageContent = page.extension[i].valueMarkdown;
          createPage = true;
        }
        if (page.extension[i].url.indexOf('extension-ig-page-nav-menu') > -1) {
          navMenu = page.extension[i].valueString;
          createPage = true;
        }
        if (page.extension[i].url.indexOf('extension-ig-page-reuse-description') > -1) {
          reuseDescription = page.extension[i].valueBoolean;
          createPage = true;
        }
        if (page.extension[i].url.indexOf('extension-ig-page-auto-generate-toc') > -1) {
          createPage = true;
        }
      }
      if (createPage) {
        const newPage = {
          type: 'Page',
          content: pageContent,
          navMenu: navMenu,
          reuseDescription: reuseDescription,
          name: pageName,
          referencedBy: [{ _id: new ObjectId(), value: ig._id, valueType: 'FhirResource' }],
          lastUpdated: new Date(),
          versionId: 1,
          isDeleted: false
        };
        let newPageRes = await db.collection('nonFhirResource').updateOne({
          name: pageName,
          type: 'Page',
          'referencedBy.value': new ObjectId(ig._id)
        }, { $set: newPage }, { upsert: true });
        ig.references = ig.references || [];
        // add to references if not already in the reference list
        if (!ig.references.find((r) => {
          if (r.valueType !== 'NonFhirResource') return false;
          if (r.value && r.value.toString() === newPageRes.upsertedId) return true;
        })) {
          ig.references.push({ _id: new ObjectId(), value: newPageRes.upsertedId, valueType: 'NonFhirResource' });
        }
      }
      if (page.page) {
        for (let i = 0; i < page.page.length; i++) {
          await migrateExtensions(ig, page.page[i]);
        }
      }
    }

    async function deleteExtensions(igId, page) {

      for (let i = 0; i < (page.extension?.length || 0); i++) {
        let index = page.extension[i].url.indexOf('extension-ig-page-content');
        if (index > -1) {
          page.extension.splice(i, 1);
          i = i - 1;
          continue;
        }
        index = page.extension[i].url.indexOf('extension-ig-page-nav-menu');
        if (index > -1) {
          page.extension.splice(i, 1);
          i = i - 1;
          continue;
        }
        index = page.extension[i].url.indexOf('extension-ig-page-reuse-description');
        if (index > -1) {
          page.extension.splice(i, 1);
          i = i - 1;
          continue;
        }
        index = page.extension[i].url.indexOf('extension-ig-page-filename');
        if (index > -1) {
          page.extension.splice(i, 1);
          i = i - 1;
          continue;
        }
        index = page.extension[i].url.indexOf('extension-ig-page-auto-generate-toc');
        if (index > -1) {
          page.extension.splice(i, 1);
          i = i - 1;
          continue;
        }
      }

      if (page.page) {
        for (let i = 0; i < page.page.length; i++) {
          await deleteExtensions(igId, page.page[i]);
        }
      }
    }

    //let results = await db.collection('fhirResource').find({ '_id': new ObjectId('645aa11600669ee940513ef1'), 'resource.definition.page.extension': { $exists: true } }).toArray();
    let results = await db.collection('fhirResource').find({ 'resource.resourceType': 'ImplementationGuide', 'resource.definition.page.extension': { $exists: true } }).toArray();
    for (const result of results) {
      await migrateExtensions(result, result.resource.definition.page);
      await deleteExtensions(result._id, result.resource.definition.page);

      // update ig
      await db.collection('fhirResource').updateOne({ '_id': new ObjectId(result._id) }, { $set: result });
    }
  },

  async down(db, client) {

    let results = await db.collection('nonFhirResource').find({ 'type': 'Page' }).toArray();

    function findPage(page, searchPageName) {
      let result;
      let pageName = page.nameUrl ?? page.nameReference?.reference ?? '';
      if (pageName && pageName.indexOf('.') > -1) {
        pageName = pageName.substring(0, pageName.indexOf('.'));
      }
      if (pageName === searchPageName) {
        return page;
      } else {
        if (page.page) {
          for (let i = 0; i < page.page.length; i++) {
            result = findPage(page.page[i], searchPageName);
            if (result !== false) {
              return result;
            }
          }
        }
        return false;
      }
    }

    function insertExtension(page, result) {

      function getExtension(generation) {
        switch (generation) {
          case 'markdown':
          case 'generated':
            return '.md';
          default:
            return `.${generation}`;
        }
      }


      page.extension = page.extension || [];

      if (result.content) {
        let contentExt = page.extension.find(e => e.url.indexOf('extension-ig-page-content') > -1);
        if (!contentExt) {
          contentExt = {
            url: 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content',
            valueMarkdown: result.content
          };
          page.extension.push(contentExt);
        }
      }
      if (result.reuseDescription) {
        let pageReuseDescription = page.extension.find(e => e.url.indexOf('extension-ig-page-reuse-description') > -1);
        if (!pageReuseDescription) {
          pageReuseDescription = {
            url: 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-reuse-description',
            valueBoolean: result.reuseDescription
          };
          page.extension.push(pageReuseDescription);
        }
      }
      if (result.navMenu) {
        let pageNavMenu = page.extension.find(e => e.url.indexOf('extension-ig-page-nav-menu') > -1);
        if (!pageNavMenu) {
          pageNavMenu = {
            url: 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-nav-menu',
            valueString: result.navMenu
          };
          page.extension.push(pageNavMenu);
        }
      }
      if (result.name == 'toc') {
        let pageToc = page.extension.find(e => e.url.indexOf('extension-ig-page-auto-generate-toc') > -1);
        if (!pageToc) {
          pageToc = {
            url: 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc',
            valueBoolean: true
          };
          page.extension.push(pageToc);
        }
      }
      // add filename based on page url
      let filename = page.extension.find(e => e.url.indexOf('extension-ig-page-filename') > -1);
      let pageName = '';

      if (page.nameUrl) {
        pageName = page.nameUrl;
      } else if (page.nameReference && page.title) {
        pageName = page.title.toLowerCase().replace(/\s/g, '_');
      }
      let index = pageName.indexOf('.');
      if (index > -1) {
        pageName = pageName.slice(0, pageName.indexOf('.'));
      }
      let ext = getExtension(page.generation);
      if (!filename) {
        filename = {
          url: 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-filename',
          valueUri: pageName + ext
        };
        page.extension.push(filename);
      }
    }

    for (const result of results) {
      const ig = await db.collection('fhirResource').findOne({ '_id': new ObjectId(result.referencedBy[0].value) });

      let page = findPage(ig['resource'].definition.page, result.name);
      if (page !== undefined) {
        insertExtension(page, result);
      }

      let refIndex = (ig.references || []).findIndex(ref => ref.value === result._id && ref.valueType === 'NonFhirResource');
      if (refIndex > -1) {
        ig.references.splice(refIndex, 1);
      }

      await db.collection('fhirResource').updateOne({ '_id': new ObjectId(result.referencedBy[0].value) }, { $set: ig });
    }

    // drop the pages
    await db.collection('nonFhirResource').deleteMany({ 'type': 'Page' });
  }
};
