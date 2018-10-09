const Q = require('q');
const xlsx = require('xlsx');
const ResourceImporter = require('./resourceImporter');
const log4js = require('log4js');
const _ = require('underscore');

const log = log4js.getLogger();

const VALUESET_NAME_COLUMN = 'Name';
const VALUESET_URL_COLUMN = 'URL';
const VALUESET_ID_COLUMN = 'ID';
const CONCEPT_VALUESET_URL_COLUMN = 'ValueSet URL';
const CONCEPT_CODE_COLUMN = 'Code';
const CONCEPT_DISPLAY_COLUMN = 'Display';
const CONCEPT_CODESYSTEM_URL_COLUMN = 'Code System URL';

function ExcelValueSetImporter(fhirServerBase) {
    this.resourceImporter = new ResourceImporter(fhirServerBase);
}

function assertColumn(row, sheetName, columnName) {
    if (!row.hasOwnProperty(columnName)) {
        throw new Error(`Each row in the "${sheetName}" sheet must have a "${columnName}" column.`);
    }
}

ExcelValueSetImporter.prototype.import = function(excelData) {
    const deferred = Q.defer();
    const workbook = xlsx.read(new Uint8Array(excelData), { type: 'array' });

    log.debug('Beginning import of excel value set');

    if (!workbook.Sheets['Valuesets'] || !workbook.Sheets['Concepts']) {
        return Q.reject('The workbook must contain two sheets named "Valuesets" and "Concepts" (case-sensitive)');
    }

    const valueSetsData = xlsx.utils.sheet_to_json(workbook.Sheets['Valuesets']);
    const conceptsData = xlsx.utils.sheet_to_json(workbook.Sheets['Concepts']);
    const valueSets = [];

    try {
        _.each(valueSetsData, (valueSetData) => {
            assertColumn(valueSetData, 'Valuesets', VALUESET_NAME_COLUMN);
            assertColumn(valueSetData, 'Valuesets', VALUESET_URL_COLUMN);

            const valueSet = {
                resourceType: 'ValueSet',
                url: valueSetData[VALUESET_URL_COLUMN],
                name: valueSetData[VALUESET_NAME_COLUMN],
                compose: {
                    include: []
                }
            };

            if (valueSetData.hasOwnProperty('ID')) {
                valueSet.id = valueSetData[VALUESET_ID_COLUMN];
            }

            valueSets.push(valueSet);
        });

        _.each(conceptsData, (conceptData, index) => {
            assertColumn(conceptData, 'Concepts', CONCEPT_CODE_COLUMN);
            assertColumn(conceptData, 'Concepts', CONCEPT_CODESYSTEM_URL_COLUMN);
            assertColumn(conceptData, 'Concepts', CONCEPT_VALUESET_URL_COLUMN);

            const foundValueSet = _.find(valueSets, (valueSet) => valueSet.url === conceptData[CONCEPT_VALUESET_URL_COLUMN]);

            if (!foundValueSet) {
                throw new Error(`Row ${index} on the Concepts sheet specifies a value set url that is not listed in the Valuesets sheet.`);
            }

            let foundInclude = _.find(foundValueSet.compose.include, (include) => include.system === conceptData[CONCEPT_CODESYSTEM_URL_COLUMN]);

            if (!foundInclude) {
                foundInclude = {
                    system: conceptData[CONCEPT_CODESYSTEM_URL_COLUMN],
                    concept: []
                };
                foundValueSet.compose.include.push(foundInclude);
            }

            const newConcept = {
                code: conceptData[CONCEPT_CODE_COLUMN],
                display: conceptData[CONCEPT_DISPLAY_COLUMN]
            };
            foundInclude.concept.push(newConcept);
        });

        log.debug('Done building value sets from excel file');

        // TODO
        log.debug('Importing value sets into FHIR server');

        log.debug('Done importing value sets into FHIR server');

        deferred.resolve(valueSets);
    } catch (ex) {
        return deferred.reject(ex.message);
    }

    return deferred.promise;
}

module.exports = ExcelValueSetImporter;