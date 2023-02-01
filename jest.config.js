const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/server',
    '<rootDir>/libs/tof-lib',
    '<rootDir>/apps/client/',
    '<rootDir>/apps/tools',
  ],
};
