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

    delete resource.text;

    if (resource.resourceType === 'StructureDefinition') {
        delete resource.differential;
    }
}

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

console.log('Done');