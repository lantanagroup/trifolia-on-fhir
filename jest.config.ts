const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/server',
    '<rootDir>/libs/tof-lib',
    '<rootDir>/apps/client/',
    '<rootDir>/apps/tools',
  ],
};
