module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/client/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts',
    '<rootDir>src/test-setup.ts',
  ],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer',
      ],
    },
  },
  displayName: 'client',
};
