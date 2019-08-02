process.env.SUPPRESS_NO_CONFIG_WARNING = true;

module.exports = {
  name: 'server',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/server'
};
