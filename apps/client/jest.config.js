module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/client/',

  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts',
    '<rootDir>src/test-setup.ts',
  ],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',

      tsconfig: '<rootDir>tsconfig.spec.json',
    },
  },
  displayName: 'client',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
  transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
};
