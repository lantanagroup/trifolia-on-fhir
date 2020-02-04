module.exports = {
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: false,
  coverageReporters: ['html'],
  verbose: true
};
