import * as express from 'express';
import * as AuthHelper from '../authHelper';
import {ConnectionModel, ExtendedRequest, IOConnection, ServerConfig} from './models';
import * as _ from 'underscore';
import {Server} from 'socket.io';
import {RequestHandler} from 'express';
import * as config from 'config';

const serverConfig = <ServerConfig> config.get('server');

interface ManageRequest extends ExtendedRequest {
    headers: {
        fhirserver: string;
        'admin-code': string
    };
}

export class ManageController {
    private io: Server;
    readonly ioConnections: ConnectionModel[];

    constructor(io: Server, ioConnections: ConnectionModel[]) {
        this.io = io;
        this.ioConnections = ioConnections;
    }

    public static initRoutes() {
        const router = express.Router();

        router.post('/user/active/message', <RequestHandler> AuthHelper.checkJwt, <RequestHandler> (req: ManageRequest, res) => {
            if (req.headers['admin-code'] !== serverConfig.adminCode) {
                return res.status(401).send('You have not authenticated request as an admin');
            }

            const controller = new ManageController(req.io, req.ioConnections);
            controller.sendMessageToActiveUsers(req.body.message)
                .then((results) => res.send(results))
                .catch((err) => res.status(500).send(err));
        });

        router.get('/user/active', <RequestHandler> AuthHelper.checkJwt, <RequestHandler> (req: ManageRequest, res) => {
            if (req.headers['admin-code'] !== serverConfig.adminCode) {
                return res.status(401).send('You have not authenticated request as an admin');
            }

            const controller = new ManageController(req.io, req.ioConnections);
            controller.getActiveUsers()
                .then((results) => res.send(results))
                .catch((err) => res.status(500).send(err));
        });

        return router;
    }

    public getActiveUsers(): Promise<any> {
        return new Promise((resolve) => {
            const connections = _.map(this.ioConnections, (connection: IOConnection) => {
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

    public sendMessageToActiveUsers(message: string): Promise<any> {
        return new Promise((resolve) => {
            this.io.emit('message', message);
            resolve();
        });
    }
}