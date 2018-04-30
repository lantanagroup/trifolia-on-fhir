const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('config');
const implementationGuideController = require('./controllers/implementationGuide');
const configController = require('./controllers/config');
const personController = require('./controllers/person');
const structureDefinitionController = require('./controllers/structureDefinition');
const {resolve} = require('url');
var _ = require('underscore');

const app = express();
const fhirConfig = config.get('fhir');

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
        let path = req.fhirServerBase;

        if (resourceType) {
            path = resolve(path, resourceType);

            if (!path.endsWith('/')) path += '/';

            if (id) {
                path = resolve(path, id);

                if (!path.endsWith('/')) path += '/';
            }
        }

        if (operation) {
            path = resolve(path, operation);
        }

        if (params) {
            const paramArray = _.map(Object.keys(params), (key) => {
                return key + '=' + params[key];
            });

            if (paramArray.length > 0) {
                path += '?' + paramArray.join('&');
            }
        }

        return path;
    };

    next();
});

// Point static path to dist
app.use(express.static(path.join(__dirname, 'wwwroot')));

// Routes
app.use('/api/implementationGuide', implementationGuideController);
app.use('/api/config', configController);
app.use('/api/person', personController);
app.use('/api/structureDefinition', structureDefinitionController);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '49366';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));