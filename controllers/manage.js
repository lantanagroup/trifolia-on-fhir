const express = require('express');
const router = express.Router();
const _ = require('underscore');
const checkJwt = require('../authHelper').checkJwt;

router.get('/user/active', checkJwt, (req, res) => {
    const connections = _.map(req.ioConnections, (connection) => {
        let name;

        if (connection.practitioner && connection.practitioner.name && connection.practitioner.name.length > 0) {
            name = connection.practitioner.name[0].family;

            if (connection.practitioner.name[0].given && connection.practitioner.name[0].given.length > 0) {
                if (name) {
                    name += ', ';
                }

                name += connection.practitioner.name[0].given.join(' ');
            }
        }

        return {
            socketId: connection.id,
            userId: connection.userProfile ? connection.userProfile.user_id : null,
            email: connection.userProfile ? connection.userProfile.email : null,
            practitionerReference: connection.practitioner ? `Practitioner/${connection.practitioner.id}` : null,
            name: name
        };
    });

    res.send(connections);
});

module.exports = router;