const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
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