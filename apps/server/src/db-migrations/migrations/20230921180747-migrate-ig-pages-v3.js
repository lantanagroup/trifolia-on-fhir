
const { ObjectId } = require('bson');
module.exports = {

  async up(db, client) {


    async function migrateExtensions(igId, page) {
      let pageContent = '';
      let navMenu = '';
      let reuseDescription = false;
      let pageName = page.nameUrl.substring(0, page.nameUrl.indexOf('.html'));

      let createPage = false;
      for (let i = 0; i < page.extension.length; i++) {
        console.log('Url ' + page.nameUrl + ' ext' + page.extension[i].url);
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
      }
      if (createPage) {
        const newPage = {
          type: 'Page',
          content: pageContent,
          navMenu: navMenu,
          reuseDescription: reuseDescription,
          name: pageName,
          referencedBy: { value: igId, valueType: 'FhirResource' },
          lastUpdated: new Date(),
          versionId: 1,
          isDeleted: false
        };
        await db.collection('nonFhirResource').updateOne({ name: pageName, type: 'Page', 'referencedBy.value': new ObjectId(igId) }, { $set: newPage }, { upsert: true });
      }
      if (page.page) {
        for (let i = 0; i < page.page.length; i++) {
          await migrateExtensions(igId, page.page[i]);
        }
      }
    }

    async function deleteExtensions(igId, page) {

      for (let i = 0; i < page.extension.length; i++) {
        let index = page.extension[i].url.indexOf('extension-ig-page-content');
        if (index > -1) {
          console.log('delete ' + page.nameUrl + ' - ' + page.extension[i].url);
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
      }
      if (page.page) {
        for (let i = 0; i < page.page.length; i++) {
          await deleteExtensions(igId, page.page[i]);
        }
      }
    }


    let results = await db.collection('fhirResource').find({ 'resource.resourceType' : 'ImplementationGuide', 'resource.page.extension': { $exists: true } }).toArray();
    for (const result of results) {
      await migrateExtensions(result._id, result.resource.page);
      await deleteExtensions(result._id, result.resource.page);


      // update ig
      await db.collection('fhirResource').updateOne({ '_id': new ObjectId( result._id) }, { $set: result });
    }
  },

  async down(db, client) {

    let results = await db.collection('nonFhirResource').find({ 'type': 'Page'}).toArray();

    function findPage(page, searchPageName) {
      let result;
      let pageName = page.nameUrl.substring(0, page.nameUrl.indexOf('.html'));
      if (pageName === searchPageName) {
        return page;
      } else {
        for (let i = 0; i < page.page.length; i++) {
          result = findPage(page.page[i], searchPageName);
          if (result !== false) {
            return result;
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

      if(page.extension instanceof  Array) {
        let contentExt = page.extension.find(e => e.url.indexOf('extension-ig-page-content') > -1);
        if (result.content) {
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
        // add filename based on page url
        let filename = page.extension.find(e => e.url.indexOf('extension-ig-page-filename') > -1);
        let pageName = page.nameUrl.substring(0, page.nameUrl.indexOf('.html'));
        let ext = getExtension(page.generation)
        if (!filename) {
          filename = {
            url: 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-filename',
            valueUri: pageName + ext
          };
          page.extension.push(filename);
        }
      }
    }

    for (const result of results) {
      const ig = await db.collection('fhirResource').findOne({ '_id': new ObjectId(result.referencedBy.value) });
      let page = findPage(ig["resource"].page, result.name);
      if(page !== undefined){
        insertExtension(page, result);
      }

      await db.collection('fhirResource').updateOne({ '_id': new ObjectId(result.referencedBy.value) }, { $set: ig });
    }

    // drop the pages
    await db.collection('nonFhirResource').deleteMany({ 'type': 'Page' });
  }
};
