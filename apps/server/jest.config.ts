/* eslint-disable */
process.env.SUPPRESS_NO_CONFIG_WARNING = "true";

export default {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/server',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'server',
  testEnvironment: 'node',
};
