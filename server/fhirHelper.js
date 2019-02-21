const _ = require('underscore');
const config = require('config');
const fhirConfig = config.get('fhir');
const fs = require('fs');
const rp = require('request-promise');
const Fhir = require('fhir').Fhir;
const FhirVersions = require('fhir').Versions;
const ParseConformance = require('fhir').ParseConformance;
const ValueSets = require('../src/assets/stu3/valuesets');
const ProfileTypes = require('../src/assets/stu3/profiles-types');
const ProfileResources = require('../src/assets/stu3/profiles-resources');
const log4js = require('log4js');
const log = log4js.getLogger();
const Q = require('q');
const path = require('path');

function joinUrl() {
    let url = '';

    for (let i = 0; i < arguments.length; i++) {
        const argument = arguments[i].toString();

        if (url && !url.endsWith('/')) {
            url += '/';
        }

        url += argument.startsWith('/') ? argument.substring(1) : argument;
    }

    return url;
}

function buildUrl(base, resourceType, id, operation, params) {
    let path = base;

    if (!path) {
        return;
    }

    if (resourceType) {
        path = joinUrl(path, resourceType);

        if (id) {
            path = joinUrl(path, id);
        }
    }

    if (operation) {
        path = joinUrl(path, operation);
    }

    if (params) {
        const paramArray = _.map(Object.keys(params), (key) => {
            let value = encodeURIComponent(params[key]);
            return key + '=' + value;
        });

        if (paramArray.length > 0) {
            path += '?' + paramArray.join('&');
        }
    }

    return path;
}

function parseUrl(url, base) {
    const parseUrlRegex = /(Account|ActivityDefinition|AdverseEvent|AllergyIntolerance|Appointment|AppointmentResponse|AuditEvent|Basic|Binary|BodySite|Bundle|CapabilityStatement|CarePlan|CareTeam|ChargeItem|Claim|ClaimResponse|ClinicalImpression|CodeSystem|Communication|CommunicationRequest|CompartmentDefinition|Composition|ConceptMap|Condition|Consent|Contract|Coverage|DataElement|DetectedIssue|Device|DeviceComponent|DeviceMetric|DeviceRequest|DeviceUseStatement|DiagnosticReport|DocumentManifest|DocumentReference|EligibilityRequest|EligibilityResponse|Encounter|Endpoint|EnrollmentRequest|EnrollmentResponse|EpisodeOfCare|ExpansionProfile|ExplanationOfBenefit|FamilyMemberHistory|Flag|Goal|GraphDefinition|Group|GuidanceResponse|HealthcareService|ImagingManifest|ImagingStudy|Immunization|ImmunizationRecommendation|ImplementationGuide|Library|Linkage|List|Location|Measure|MeasureReport|Media|MedicationAdministration|MedicationDispense|MedicationRequest|MedicationStatement|Medication|MessageDefinition|MessageHeader|NamingSystem|NutritionOrder|Observation|OperationDefinition|OperationOutcome|Organization|Patient|PaymentNotice|PaymentReconciliation|Person|PlanDefinition|PractitionerRole|Practitioner|ProcedureRequest|Procedure|ProcessRequest|ProcessResponse|Provenance|QuestionnaireResponse|Questionnaire|ReferralRequest|RelatedPerson|RequestGroup|ResearchStudy|ResearchSubject|RiskAssessment|Schedule|SearchParameter|Sequence|ServiceDefinition|Slot|Specimen|StructureDefinition|StructureMap|Subscription|Substance|SupplyDelivery|SupplyRequest|Task|TestReport|TestScript|ValueSet|VisionPrescription)(\/([A-Za-z0-9\-\.]+))?(\/_history\/([A-Za-z0-9\-\.]{1,64}))?/g;

    if (base && base.lastIndexOf('/') === base.length-1) {
        base = base.substring(0, base.length - 1);
    }

    const next = url.replace(base, '');
    const match = parseUrlRegex.exec(next);

    if (match) {
        return {
            resourceType: match[1],
            id: match[3],
            historyId: match[5]
        };
    }
}

function getFhirStu3Instance() {
    // TODO: Determine which FHIR version to load
    const parser = new ParseConformance(false, FhirVersions.STU3);
    parser.parseBundle(ValueSets);
    parser.parseBundle(ProfileTypes);
    parser.parseBundle(ProfileResources);
    const fhir = new Fhir(parser);
    return fhir;
}

function getFhirR4Instance() {
    const fhir = new Fhir();
    // TODO: Consider loading specific base resources for FHIR R4...
    return fhir;
}

function getExtensionsPath(fhirServer) {
    switch (fhirServer.version) {
        case 'stu3':
            return './src/assets/stu3/extensions';
        case 'r4':
            return './src/assets/r4/extensions';
        default:
            throw new Error(`Unexpected FHIR server version "${fhirServer.version} for server ${fhirServer.id}`);
    }
}

function loadExtensions() {
    _.each(fhirConfig.servers, (fhirServer) => {
        const getPromises = [];
        const extensionsPath = getExtensionsPath(fhirServer);
        const extensionFileNames = fs.readdirSync(extensionsPath);
        const extensions = _.map(extensionFileNames, (extensionFileName) => {
            const filePath = extensionsPath + '/' + extensionFileName;
            return require(filePath);
        });

        _.each(extensions, (extension) => {
            const retrieveOptions = {
                url: buildUrl(fhirServer.uri, 'StructureDefinition', extension.id),
                method: 'GET',
                json: true
            };

            rp(retrieveOptions)
                .then((retrieveResults) => {
                    if (retrieveResults) {
                        log.info(`Extension ${extension.url} already exists on server ${fhirServer.id}`);

                        if (retrieveResults.url !== extension.url) {
                            throw new Error(`Extension ${extension.id} already exists on server, but has url ${retrieveResults.url} instead of ${extension.url}`);
                        }

                        return;
                    }
                })
                .catch((err) => {
                    if (err && err.response) {
                        const statusCode = err.response.statusCode;

                        if (statusCode === 410 || statusCode === 404) {
                            const createOptions = {
                                url: buildUrl(fhirServer.uri, 'StructureDefinition', extension.id),
                                method: 'PUT',
                                json: true,
                                body: extension
                            };
                            rp(createOptions)
                                .then((createResults) => {
                                    log.info(`Successfully loaded extension ${extension.url} on FHIR server ${fhirServer.id}`);
                                })
                                .catch((err) => {
                                    log.error(`Error creating extension ${extension.url} on FHIR server ${fhirServer.id}: ${err}`);
                                })
                        }
                    } else {
                        log.error('Error ensuring extension exists on FHIR server: ' + err);
                    }
                });
        });
    });
}

function hostExtensions(app, fhirStu3, fhirR4) {
    const stu3ExtensionFiles = fs.readdirSync(path.join(__dirname, '../wwwroot/assets/stu3/extensions'));
    const r4ExtensionFiles = fs.readdirSync(path.join(__dirname, '../wwwroot/assets/r4/extensions'));

    function hostExtension(fhirVersion, extension) {
        const route = `/${fhirVersion}/${extension.resourceType}/${extension.id}`;
        app.get(route, (req, res) => {
            if (req.accepts('xml') && !req.accepts('json')) {
                const xml = fhirStu3.objToXml(extension);
                res.contentType('application/xml').send(xml);
            } else {
                res.send(extension);
            }
        });
    }

    _.each(stu3ExtensionFiles, (extensionFileName) => {
        const fullFileName = path.join(__dirname, '../wwwroot/assets/stu3/extensions', extensionFileName);
        const extension = JSON.parse(fs.readFileSync(fullFileName).toString());
        hostExtension('stu3', extension);
    });

    _.each(r4ExtensionFiles, (extensionFileName) => {
        const fullFileName = path.join(__dirname, '../wwwroot/assets/r4/extensions', extensionFileName);
        const extension = JSON.parse(fs.readFileSync(fullFileName).toString());
        hostExtension('r4', extension);
    });
}

function getErrorString(err, body, defaultMessage) {
    if (err && err.error) {
        if (typeof err.error === 'string') {
            return err.error;
        } else if (typeof err.error === 'object') {
            if (err.error.resourceType === 'OperationOutcome') {
                if (err.error.issue && err.error.issue.length > 0 && err.error.issue[0].diagnostics) {
                    return err.error.issue[0].diagnostics;
                }
            } else if (err.name === 'RequestError') {
                return err.error.message;
            }
        }
    } else if (err && err.message) {
        return err.message;
    } else if (err && err.data) {
        return err.data;
    } else if (typeof err === 'string') {
        return err;
    } else if (body && body.resourceType === 'OperationOutcome') {
        if (body.issue && body.issue.length > 0 && body.issue[0].diagnostics) {
            return body.issue[0].diagnostics;
        }
    }

    return defaultMessage || 'An unknown error occurred';
}

function handleError(err, log, body, res, defaultMessage = 'An unknown error occurred') {
    const msg = getErrorString(err, body, defaultMessage);

    if (log) {
        log.error(msg);
    }

    if (res) {
        res.status(500).send(msg);
    }
}

module.exports = {
    buildUrl: buildUrl,
    parseUrl: parseUrl,
    getFhirStu3Instance: getFhirStu3Instance,
    getFhirR4Instance: getFhirR4Instance,
    loadExtensions: loadExtensions,
    joinUrl: joinUrl,
    hostExtensions: hostExtensions,
    getErrorString: getErrorString,
    handleError: handleError
};