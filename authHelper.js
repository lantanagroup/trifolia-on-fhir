const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const config = require('config');

const authConfig = config.get('auth');

module.exports = {
    checkJwt: jwt({
        // Dynamically provide a signing key
        // based on the kid in the header and
        // the signing keys provided by the JWKS endpoint.
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: authConfig.jwksUri
        }),

        // Validate the audience and the issuer.
        audience: authConfig.audience,
        issuer: authConfig.issuer,
        algorithms: authConfig.algorithms
    })
}