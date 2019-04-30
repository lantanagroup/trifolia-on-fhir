const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Must specify file to remove text from resources');
  return process.exit(1);
}

const filePath = process.argv[2];
let fileContent = fs.readFileSync(filePath).toString();
const resource = JSON.parse(fileContent);

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

if (resource.resourceType === 'Bundle') {
  for (let i = 0; i < resource.entry.length; i++) {
    const entry = resource.entry[i];
    const resourceType = entry.resource.resourceType;

    if (resourceType === 'OperationDefinition' || resourceType === 'CompartmentDefinition' || resourceType === 'CapabilityStatement') {
      resource.entry.splice(i, 1);
      i--;
    } else {
      cleanResource(entry.resource);
    }
  }
} else if (resource.resourceType) {
  cleanResource(resource);
}

// save
fileContent = JSON.stringify(resource);
fs.writeFileSync(filePath, fileContent);

console.log('Done');
