const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('config');
const implementationGuideController = require('./controllers/implementationGuide');
const configController = require('./controllers/config');
const personController = require('./controllers/person');
const structureDefinitionController = require('./controllers/structureDefinition');
const auditEventController = require('./controllers/auditEvent');
const fhirController = require('./controllers/fhir');
const exportController = require('./controllers/export');
const binaryController = require('./controllers/binary');
const capabilityStatementController = require('./controllers/capabilityStatement');
const operationDefinitionController = require('./controllers/operationDefinition');
const valueSetController = require('./controllers/valueSet');
const codeSystemController = require('./controllers/codeSystem');
const importController = require('./controllers/import');
const socketIO = require('socket.io');
const FhirHelper = require('./fhirHelper');
const _ = require('underscore');
const Fhir = require('fhir');

const app = express();
const fhirConfig = config.get('fhir');
const serverConfig = config.get('server');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Identify the FHIR server to use
app.use((req, res, next) => {
    req.fhirServerBase = fhirConfig.servers[0].uri;

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

    next();
});

// Parse XML into JSON
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/xml') {
        const fhir = new Fhir();
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
server.listen(port, () => console.log(`API running on localhost:${port}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('User connected to socket');
    socket.on('disconnect', () => {
        console.log('User disconnected from socket');
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
app.use('/api/person', personController);
app.use('/api/structureDefinition', structureDefinitionController);
app.use('/api/auditEvent', auditEventController);
app.use('/api/export', exportController);
app.use('/api/binary', binaryController);
app.use('/api/capabilityStatement', capabilityStatementController);
app.use('/api/operationDefinition', operationDefinitionController);
app.use('/api/valueSet', valueSetController);
app.use('/api/codeSystem', codeSystemController);
app.use('/api/fhir', fhirController);
app.use('/api/import', importController);

// Catch all other routes and return the index file
app.use(express.static(path.join(__dirname, 'wwwroot')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot/index.html'));
});