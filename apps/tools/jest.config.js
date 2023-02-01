module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/tools',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'tools',
  testEnvironment: 'node',
};
