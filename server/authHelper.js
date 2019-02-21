module.exports = {
    checkJwt: function(req, res, next) {
        if (!req.user) {
            res.status(401).send();
        } else {
            next();
        }
    }
}