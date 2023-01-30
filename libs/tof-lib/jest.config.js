process.env.SUPPRESS_NO_CONFIG_WARNING = true;

module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/tof-lib',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'tof-lib',
};
