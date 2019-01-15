const jwt = require('express-jwt');
const config = require('config');

const authConfig = config.get('auth');

module.exports = {
    checkJwt: jwt({
        issuer: authConfig.issuer,
        secret: function(req, payload, callback) {
            callback(null, authConfig.secret)
        }
    })
}