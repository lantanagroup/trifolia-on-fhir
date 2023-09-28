var path = require('path');
const cfgDir = path.join(__dirname, '../config');
process.env["NODE_CONFIG_DIR"] = cfgDir;
var cfg = require('config');

var config = require(path.join(cfgDir, 'migration-default.json'));
config.mongodb.url = cfg.get('database').uri;

module.exports = config;
