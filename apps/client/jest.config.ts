/* eslint-disable */
import snapshotSerializers from 'jest-preset-angular/build/serializers';
export default {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/client/',

  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts',
  ],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  displayName: 'client',
  snapshotSerializers,
  transform: {
    '^.+.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
};
