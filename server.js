const express = require('express');
const compression = require('compression');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('config');
const {ImportController} = require('./server/controllers/import');
const {FhirAPIController} = require('./server/controllers/fhirAPI');
const {ExportController} = require('./server/controllers/export');
const {StructureDefinitionController} = require('./server/controllers/structureDefinition');
const {AuditEventController} = require('./server/controllers/auditEvent');
const {ConfigController} = require('./server/controllers/config');
const {FhirLogic} = require('./server/controllers/fhirLogic');
const {ImplementationGuideLogic} = require('./server/controllers/implementationGuide');
const {ManageController} = require('./server/controllers/manage');
const {ValueSetController} = require('./server/controllers/valueSet');
const {PractitionerController} = require('./server/controllers/practitioner');
const socketIO = require('socket.io');
const FhirHelper = require('./server/fhirHelper');
const _ = require('underscore');
const log4js = require('log4js');
const rp = require('request-promise');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

const fhirStu3 = FhirHelper.getFhirStu3Instance();
const fhirR4 = FhirHelper.getFhirR4Instance();

const app = express();
const fhirConfig = config.get('fhir');
const serverConfig = config.get('server');
const githubConfig = config.get('github');
const authConfig = config.get('auth');

log4js.configure('config/log4js.json');
const log = log4js.getLogger();

// Parsers for POST data
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.raw({ type: ['application/octet-stream', 'application/binary']}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

// Identify the FHIR server to use
app.use((req, res, next) => {
    req.fhirServerBase = fhirConfig.servers[0].uri;
    req.fhirServerVersion = fhirConfig.servers[0].version;

    if (req.headers['fhirserver']) {
        const foundFhirServer = _.find(fhirConfig.servers, (server) => server.id === req.headers['fhirserver']);

        if (foundFhirServer) {
            req.fhirServerBase = foundFhirServer.uri;
            req.fhirServerVersion = foundFhirServer.version;
        }
    }

    switch (req.fhirServerVersion) {
        case 'stu3':
            req.fhir = fhirStu3;
            break;
        case 'r4':
            req.fhir = fhirR4;
            break;
        default:
            throw new Error(`Unsupported FHIR version ${req.fhirServerVersion}`);
    }

    if (!req.fhirServerBase.endsWith('/')) {
        req.fhirServerBase += '/';
    }

    req.getFhirServerUrl = function(resourceType, id, operation, params) {
        return FhirHelper.buildUrl(req.fhirServerBase, resourceType, id, operation, params);
    };

    req.getErrorMessage = function(err) {
        if (err && err.response && err.response.body && err.response.body.resourceType === 'OperationOutcome') {
            const oo = err.response.body;

            if (oo.issue && oo.issue.length === 1 && oo.issue[0].diagnostics) {
                return oo.issue[0].diagnostics;
            } else if (oo.text && oo.text.div) {
                return oo.text.div;
            }
        } else if (err && err.message) {
            return err.message;
        } else if (typeof err === 'string') {
            return err;
        }

        log.error(err);
        return 'Unspecified error';
    };

    next();
});

// Accept and/or parse XML into JSON
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/xml') {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                if (req.body) {
                    req.body = req.fhir.xmlToObj(data);
                }
                next();
            } catch (ex) {
                res.status(400).send('Could not parse body as XML: ' + ex.message);
            }
        });
    } else {
        next();
    }

    const originalSend = res.send;

    res.send = (data) => {
        if (req.headers['accept'] === 'application/xml' && data) {
            data = typeof data === 'string' ? req.fhir.jsonToXml(data) : req.fhir.objToXml(data);
            res.contentType('application/xml');
        }

        originalSend.call(res, data);
    };
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || serverConfig.port || '49366';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => log.info(`API running on localhost:${port}`));

const io = socketIO(server);
const connections = [];

io.on('connection', (socket) => {
    log.info(`Client (id: ${socket.client.id}) connected to socket`);

    connections.push({
        id: socket.client.id
    });

    socket.on('disconnect', () => {
        log.info(`Client (id: ${socket.client.id}) disconnected from socket`);

        const foundConnection = _.find(connections, (connection) => connection.id === socket.client.id);

        if (foundConnection) {
            const index = connections.indexOf(foundConnection);
            connections.splice(index, 1);
            log.debug(`Removed connection with id ${socket.client.id} from connections list`);
        } else {
            log.error(`Socket disconnected, but no connection found for id ${socket.client.id}.`);
        }
    });

    socket.on('authenticated', (data) => {
        log.debug(`Client socket (id: ${socket.client.id}) sent authentication information`);

        const foundConnection = _.find(connections, (connection) => connection.id === socket.client.id);

        if (!foundConnection) {
            log.error(`Authentication information sent by a client socket connection, but no connection could be found for socket id ${socket.client.id}`);
            return;
        }

        Object.assign(foundConnection, data);
    });

    socket.on('exporting', (packageId) => {
        log.debug(`Updating socket id to ${socket.client.id} for html exporters with package id ${packageId}`);

        const exporters = _.filter(ExportController.htmlExports, (exporter) => exporter._packageId === packageId);

        log.debug(`Found ${exporters.length} exporters to update socket id for`);

        _.each(exporters, (exporter) => exporter._socketId = socket.client.id);
    });
});

// cache for the codes passed in the authorization header and their associated JWT
const authorizationCodes = {};

app.use((req, res, next) => {
    req.io = io;
    req.ioConnections = connections;

    const header = req.headers['authorization'];

    if (header && header.startsWith('Bearer ')) {
        const bearer = header.substring('Bearer '.length);

        if (authorizationCodes[bearer]) {
            req.user = authorizationCodes[bearer];
            next();
        } else {
            log.trace(`Authorization code not found in cache. Requesting from identity provider. Code: ${bearer}`);

            const options = {
                method: 'GET',
                url: authConfig.userInfoUrl,
                headers: {
                    'Authorization': header
                },
                json: true
            };

            rp(options)
                .then(function (results) {
                    log.info(`Successfully retrieved user info for code ${bearer}`);

                    authorizationCodes[bearer] = results;
                    req.user = authorizationCodes[bearer];
                    next();
                })
                .catch(function(err) {
                    req.userError = err;
                    log.error(`Error retrieving user info for code ${bearer}`);
                    next();
                });
        }
    } else {
        next();
    }
});

// Routes
app.use('/help', express.static(path.join(__dirname, 'wwwroot/help')));
app.use('/api/implementationGuide', ImplementationGuideLogic.initRoutes());
app.use('/api/manage', ManageController.initRoutes());
app.use('/api/config', ConfigController.initRoutes());
app.use('/api/valueSet', ValueSetController.initRoutes());
app.use('/api/practitioner', PractitionerController.initRoutes());
app.use('/api/structureDefinition', StructureDefinitionController.initRoutes());
app.use('/api/export', ExportController.initRoutes());
app.use('/api/fhir', FhirAPIController.initRoutes());
app.use('/api/import', ImportController.initRoutes());
app.use('/api/codeSystem', FhirLogic.initRoutes('CodeSystem'));
app.use('/api/capabilityStatement', FhirLogic.initRoutes('CapabilityStatement'));
app.use('/api/operationDefinition', FhirLogic.initRoutes('OperationDefinition'));
app.use('/api/questionnaire', FhirLogic.initRoutes('Questionnaire'));
app.use('/api/binary', FhirLogic.initRoutes('Binary'));
app.use('/api/auditEvent', AuditEventController.initRoutes('AuditEvent'));

// Host extensions at /stu3/StructureDefinition/XXX and /r4/StructureDefinition/XXX
FhirHelper.hostExtensions(app, fhirStu3, fhirR4);

// Catch all other routes and return the index file
app.use('/assets', express.static(path.join(__dirname, 'wwwroot/assets'), { maxAge: 1000 * 60 * 60 * 24 }));     // 1 day (1 second * 60 seconds * 60 minutes * 24 hours)
app.use(express.static(path.join(__dirname, 'wwwroot')));

// app.use('/api-docs', express.static(path.join(__dirname, 'swagger-ui'), { maxAge: 1000 * 60 * 60 * 24 }));
app.use('/api-docs', swaggerUi.serve, function(req, res, next) {
    const options = {
        swaggerUrl: '/swagger.yaml',
        swaggerOptions: {
            oauth: {
                clientId: authConfig.clientId
            },
            oauth2RedirectUrl: req.protocol + '://' + req.get('host') + '/api-docs/oauth2-redirect.html'
        }
    };
    swaggerUi.setup(null, options)(req, res, next);
});

app.get('/swagger.yaml', function(req, res) {
    let spec = fs.readFileSync(path.join(__dirname, 'swagger.yaml')).toString();
    const definitionsSpec = fs.readFileSync(path.join(__dirname, 'swagger-definitions.yaml')).toString();

    spec = spec
        .replace('##swagger-definitions.yaml##', definitionsSpec)
        .replace('##host##', req.get('host') || 'trifolia-fhir-dev.lantanagroup.com')
        .replace('##scheme##', req.protocol);

    res.contentType('text/yaml');
    res.send(spec);
});

/**
 * Handles an authentication redirect from GitHub. The user is initially redirected to GitHub, the user
 * authenticates with GitHub, they are redirected from GitHub back to ToF to this operation, where the
 * authentication token is redirected to the correct HTML page in ToF so that the browser can keep trackc of it.
 * @param req
 * @param req.query
 * @param req.query.code The authenticated token representing the user's GitHub session
 * @param res
 */
function handleAuthentication(req, res) {
    const code = req.query.code;
    const clientId = githubConfig.clientId;
    const secret = githubConfig.secret;

    if (!code) {
        log.error('No code specified for GitHub callback');
        return res.send('No code specified in GitHub callback');
    }

    log.debug(`Github callback initiated with code ${code}. Requesting token from GitHub with client id ${clientId}.`);

    const url = 'https://github.com/login/oauth/access_token?client_id=' + encodeURIComponent(clientId) + '&client_secret=' + encodeURIComponent(secret) + '&code=' + encodeURIComponent(code);
    let templateContent = fs.readFileSync('src/assets/github-callback.html').toString();

    // The web-packed scripts are in scripts.bundle.js in a production envrionment, and in scripts.js in a dev/local environment
    if (fs.existsSync('wwwroot/scripts.bundle.js')) {
        templateContent = templateContent.replace('%SCRIPTS_JS%', '../scripts.bundle.js');
    } else {
        templateContent = templateContent.replace('%SCRIPTS_JS%', '../scripts.js');
    }

    res.contentType('text/html');

    rp({
        url: url,
        method: 'POST',
        json: true,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then((data) => {
            log.debug(`Token received from GitHub, sending to client: ${data['access_token']}`);

            templateContent = templateContent.replace('%ACCESS_TOKEN%', data['access_token']);
            res.send(templateContent);
        })
        .catch((err) => {
            log.error(`Error received from GitHub when requesting token: ${err}`);

            templateContent = templateContent.replace('%ACCESS_TOKEN%', '');
            res.send(templateContent);
        });
}

app.get('/github/callback', handleAuthentication);

app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/igs/')) {
        res.status(404).send('The specified page could not be found');
    } else if (req.originalUrl.startsWith('/api/')) {
        res.status(404).send('The specified API method could not be found');
    } else {
        let content = fs.readFileSync(path.join(__dirname, 'wwwroot/index.html')).toString();

        if (serverConfig.googleAnalyticsCode) {
            const googleScripts = `<script async src="https://www.googletagmanager.com/gtag/js?id=${serverConfig.googleAnalyticsCode}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${serverConfig.googleAnalyticsCode}');
</script>
`;
            content = content.replace('  <!-- Google Analytics Tracking Scripts -->', googleScripts);
        }

        res.contentType('text/html').send(content);
    }
});

// Pre-load all necessary extensions for Trifolia-on-FHIR on the server
//FhirHelper.loadExtensions();