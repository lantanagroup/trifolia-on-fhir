module.exports = {
  name: 'client',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/client/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts']
};
