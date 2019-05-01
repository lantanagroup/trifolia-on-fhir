const fs = require('fs');
const { resolve } = require('path');
const { readdir, stat } = require('fs').promises;

if (process.argv.length < 3) {
    console.log('Must specify directory to remove extras from resources');
    return process.exit(1);
}

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

function cleanResource(resource) {
  if (!resource) {
    return;
  }

  console.log(`Found resource ${resource.resourceType} with url '${resource.url}`);

  delete resource.extension;
  delete resource.meta;
  delete resource.text;
  delete resource.publisher;
  delete resource.differential;
  delete resource.experimental;
  delete resource.contact;

  if (resource.resourceType === 'StructureDefinition') {
    for (let i = 0; i < resource.snapshot.element.length; i++) {
      const element = resource.snapshot.element[i];

      delete element.comment;
      delete element.constraint;
      delete element.mapping;
      delete element.isSummary;
      delete element.alias;
      delete element.extension;
      delete element.base;
      delete element.isModifier;

      if (element.binding) {
        delete element.binding.extension;
      }
    }
  } else if (resource.resourceType === 'CodeSystem') {
    delete resource.copyright;
    delete resource.caseSensitive;
    delete resource.versionNeeded;
    delete resource.status;
    delete resource.jurisdiction;
    delete resource.date;
    delete resource.description;
    delete resource.concept;

    if (resource.concept) {
      for (let i = 0; i < resource.concept.length; i++) {
        delete resource.concept[i].definition;
      }
    }
  } else if (resource.resourceType === 'ValueSet') {
    delete resource.copyright;
    delete resource.description;
  }
}

getFiles(process.argv[2])
  .then((files) => {
    files
      .filter((filePath) => filePath.endsWith('.json'))
      .forEach((filePath) => {

        let fileContent = fs.readFileSync(filePath).toString();
        const resource = JSON.parse(fileContent);

        if (resource.resourceType === 'StructureDefinition' && resource.type === 'Extension' && resource.url.startsWith('https://trifolia')) {
          return;
        }

        console.log(`Processing ${filePath}`);

        if (resource.resourceType === 'Bundle') {
          for (let i = 0; i < resource.entry.length; i++) {
            const entry = resource.entry[i];
            cleanResource(entry.resource);
          }
        } else if (resource.resourceType) {
          cleanResource(resource);
        }

        // save
        fileContent = JSON.stringify(resource);
        fs.writeFileSync(filePath, fileContent);
      });
    console.log('Done');
  });

