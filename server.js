const express = require('express');
const compression = require('compression');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('config');
const implementationGuideController = require('./controllers/implementationGuide');
const configController = require('./controllers/config');
const practitionerController = require('./controllers/practitioner');
const structureDefinitionController = require('./controllers/structureDefinition');
const auditEventController = require('./controllers/auditEvent');
const fhirController = require('./controllers/fhir');
const exportController = require('./controllers/export');
const binaryController = require('./controllers/binary');
const capabilityStatementController = require('./controllers/capabilityStatement');
const operationDefinitionController = require('./controllers/operationDefinition');
const valueSetController = require('./controllers/valueSet');
const codeSystemController = require('./controllers/codeSystem');
const questionnaireController = require('./controllers/questionnaire');
const importController = require('./controllers/import');
const fhirOperationsController = require('./controllers/fhirOperations');
const socketIO = require('socket.io');
const FhirHelper = require('./fhirHelper');
const _ = require('underscore');
const fhir = FhirHelper.getFhirInstance();
const log4js = require('log4js');

const app = express();
const fhirConfig = config.get('fhir');
const serverConfig = config.get('server');


log4js.configure('config/log4js.json');
const log = log4js.getLogger();

// Parsers for POST data
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

// Identify the FHIR server to use
app.use((req, res, next) => {
    req.fhirServerBase = fhirConfig.servers[0].uri;
    req.fhir = fhir;

    if (req.headers['fhirserver']) {
        const foundFhirServer = _.find(fhirConfig.servers, (server) => server.id === req.headers['fhirserver']);

        if (foundFhirServer) {
            req.fhirServerBase = foundFhirServer.uri;
        }
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

// Parse XML into JSON
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/xml') {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            req.body = fhir.xmlToObj(data);
            next();
        });
    } else {
        next();
    }
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

io.on('connection', (socket) => {
    log.info('User connected to socket');
    socket.on('disconnect', () => {
        log.info('User disconnected from socket');
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/help', express.static(path.join(__dirname, 'wwwroot/help')));
app.use('/api/implementationGuide', implementationGuideController);
app.use('/api/config', configController);
app.use('/api/practitioner', practitionerController);
app.use('/api/structureDefinition', structureDefinitionController);
app.use('/api/auditEvent', auditEventController);
app.use('/api/export', exportController);
app.use('/api/binary', binaryController);
app.use('/api/capabilityStatement', capabilityStatementController);
app.use('/api/operationDefinition', operationDefinitionController);
app.use('/api/valueSet', valueSetController);
app.use('/api/questionnaire', questionnaireController);
app.use('/api/codeSystem', codeSystemController);
app.use('/api/fhirOps', fhirOperationsController);
app.use('/api/fhir', fhirController);
app.use('/api/import', importController);

// Catch all other routes and return the index file
app.use('/assets', express.static(path.join(__dirname, 'wwwroot/assets'), { maxAge: 1000 * 60 * 60 * 24 }));     // 1 day (1 second * 60 seconds * 60 minutes * 24 hours)
app.use(express.static(path.join(__dirname, 'wwwroot')));

app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/igs/')) {
        res.status(404).send('The specified page could not be found');
    } else {
        res.sendFile(path.join(__dirname, 'wwwroot/index.html'));
    }
});

// Pre-load all necessary extensions for Trifolia-on-FHIR on the server
FhirHelper.loadExtensions();