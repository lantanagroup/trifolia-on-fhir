process.env.SUPPRESS_NO_CONFIG_WARNING = true;

module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/server',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'server',
  testEnvironment: 'node',
};
