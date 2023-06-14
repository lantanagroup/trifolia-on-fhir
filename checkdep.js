const { readdir, readFile } = require('fs').promises;
const { resolve } = require('path');
const thePackage = require('./package.json');

const imports = [];
const ignore = [
  'zone.js',
  'concurrently',
  'jasmine-spec-reporter',
  'ts-node',
  '@popperjs/core'
];

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (let dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory() && dirent.name !== 'node_modules' && dirent.name !== '.git') {
      await getFiles(res);
    } else if (res.toLowerCase().endsWith('.ts')) {
      const content = (await readFile(res)).toString();
      const regex = /(import.+? from ['"](.+?)['"])|(require\(['"](.+?)['"]\))/gm;
      let match;

      while ((match = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        if (match[2]) {
          imports.push(match[2]);
        } else if (match[4]) {
          imports.push(match[4]);
        }
      }
    }
  }
}

function check(blockName, block) {
  const dependencies = Object.keys(block);

  for (let dep of dependencies) {
    if (dep.startsWith('@types/') || ignore.indexOf(dep) >= 0) {
      continue;
    }

    const found = imports.filter(next => next.indexOf(dep) === 0 || next.indexOf(dep + '/') === 0);
    if (found.length <= 0) {
      console.log(blockName + ': ' + dep);
    }
  }
}

getFiles('.')
  .then(() => {
    check('dep', thePackage.dependencies);
    check('dev', thePackage.devDependencies);
  });
