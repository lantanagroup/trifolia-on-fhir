const express = require('express');
const router = express.Router();
const checkJwt = require('../authHelper').checkJwt;
const tmp = require('tmp');
const path = require('path');
const fs = require('fs-extra');
const zipdir = require('zip-dir');
const log4js = require('log4js');
const BundleExporter = require('../export/bundle');
const HtmlExporter = require('../export/html');

const htmlExports = [];
const log = log4js.getLogger();

function exportBundle(req, res) {
    const exporter = new BundleExporter(req.fhirServerBase, req.headers['fhirserver'], req.fhir, req.params.implementationGuideId);
    exporter.export(req.query._format)
        .then((response) => {
            let fileExt = '.json';

            if (req.query._format && req.query._format === 'application/xml') {
                fileExt = '.xml';
            }

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=ig-bundle' + fileExt);      // TODO: Determine file name
            res.send(response);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

function exportHtml(req, res) {
    const exporter = new HtmlExporter(req.fhirServerBase, req.headers['fhirserver'], req.fhir, req.io, req.query.socketId, req.params.implementationGuideId);
    const format = req.query._format;
    const executeIgPublisher = req.query.hasOwnProperty('executeIgPublisher') && req.query.executeIgPublisher.toLowerCase() === 'true';
    const useTerminologyServer = !req.query.hasOwnProperty('useTerminologyServer') || req.query.useTerminologyServer.toLowerCase() === 'true';
    const useLatest = req.query.hasOwnProperty('useLatest') && req.query.useLatest.toLowerCase() === 'true';
    const downloadOutput = !req.query.hasOwnProperty('downloadOutput') || req.query.downloadOutput.toLowerCase() === 'true';

    htmlExports.push(exporter);

    exporter.export(format, executeIgPublisher, useTerminologyServer, useLatest, downloadOutput)
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            log.error(err);
            res.status(500).send('An error occurred while exporting HTML: ' + err);
        })
        .finally(() => {
            const index = htmlExports.indexOf(exporter);
            htmlExports.splice(index);
        });
}

router.post('/:implementationGuideId', checkJwt, (req, res) => {
    try {
        switch (req.query.exportFormat) {
            case '1':
                return exportBundle(req, res);
            case '2':
                return exportHtml(req, res);
        }
    } catch (ex) {
        log.error(ex);
        return res.status(500).send('A fatal error occurred while exporting');
    }
});

/**
 * @param req
 * @param req.params
 * @param req.params.packageId
 */
router.get('/:packageId', checkJwt, (req, res) => {
    const rootPath = path.join(tmp.tmpdir, req.params.packageId);

    zipdir(rootPath, (err, buffer) => {
        if (err) {
            log.error(err);
            fs.emptyDir(rootPath);             // Asynchronously removes the temporary folder
            return res.status(500).send('An error occurred while ziping the package');
        }

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=ig-package.zip');      // TODO: Determine file name
        res.send(buffer);

        fs.emptyDirSync(rootPath);
        fs.rmdirSync(rootPath);
    });
});

module.exports = router;
module.exports.htmlExports = htmlExports;