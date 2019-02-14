import * as express from 'express';
import * as AuthHelper from '../authHelper';
import {ExtendedRequest, IOConnection} from './models';
import * as _ from 'underscore';

export class ManageController {
    public static initRoutes() {
        const router = express.Router();

        router.get('/user/active', AuthHelper.checkJwt, (req: ExtendedRequest, res) => {
            const controller = new ManageController();
            controller.getActiveUsers(req.ioConnections)
                .then((results) => res.send(results))
                .catch((err) => res.status(500).send(err));
        });

        return router;
    }

    public getActiveUsers(ioConnections): Promise<any> {
        return new Promise((resolve) => {
            const connections = _.map(ioConnections, (connection: IOConnection) => {
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

            resolve(connections);
        });
    }
}