import * as config from 'config';
import * as express from 'express';
import * as FhirHelper from '../fhirHelper';
import * as rp from 'request-promise';
import * as _ from 'underscore';
import {AuthConfig, ExtendedRequest, Fhir, FhirConfig, GithubConfig, ServerConfig} from './models';
import {BaseController} from './controller';
import * as modulePackage from '../../package.json';

const serverConfig = <ServerConfig> config.get('server');
const fhirConfig = <FhirConfig> config.get('fhir');
const authConfig = <AuthConfig> config.get('auth');
const githubConfig = <GithubConfig> config.get('github');

export class ConfigController extends BaseController {
    /**
     * For caching the metadata about the FHIR servers to respond more quickly
     */
    private static serverMetadata = {};
    private baseUrl: string;

    constructor(baseUrl: string) {
        super();

        this.baseUrl = baseUrl;
    }

    public static initRoutes() {
        const router = express.Router();

        router.get('/', <RequestHandler> (req: ExtendedRequest, res) => {
            const controller = new ConfigController(req.fhirServerBase);
            controller.getConfig()
                .then((results) => res.send(results))
                .catch((err) => ConfigController.handleError(err, null, res));
        });

        router.get('/fhir', <RequestHandler> (req: ExtendedRequest, res) => {
            const controller = new ConfigController(req.fhirServerBase);
            controller.getFhirCapabilities()
                .then((results) => res.send(results))
                .catch((err) => ConfigController.handleError(err, null, res));
        });

        return router;
    }

    public getConfig() {
        return new Promise((resolve, reject) => {
            const retConfig = {
                version: modulePackage.version,
                supportUrl: serverConfig.supportUrl,
                fhirServers: _.map(fhirConfig.servers, (server) => ({ id: server.id, name: server.name, short: server.short })),
                auth: {
                    clientId: authConfig.clientId,
                    scope: authConfig.scope,
                    domain: authConfig.domain
                },
                github: {
                    clientId: githubConfig.clientId
                },
                nonEditableResources: fhirConfig.nonEditableResources
            };

            resolve(retConfig);
        });
    }

    public getFhirCapabilities(): Promise<Fhir.CapabilityStatement> {
        if (ConfigController.serverMetadata[this.baseUrl]) {
            return Promise.resolve(ConfigController.serverMetadata[this.baseUrl]);
        }

        return new Promise((resolve, reject) => {
            const url = FhirHelper.buildUrl(this.baseUrl, 'metadata');
            const options = {
                url: url,
                method: 'GET',
                json: true
            };

            rp(options)
                .then((results) => {
                    ConfigController.serverMetadata[this.baseUrl] = results;
                    resolve(results);
                })
                .catch((err) => reject(err));
        });
    }
}