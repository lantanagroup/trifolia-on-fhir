import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from '../../../node_modules/rxjs';
import * as XLSX from 'xlsx';
import {Bundle, EntryComponent, ValueSet} from '../models/stu3/fhir';
import * as _ from 'underscore';


export class VSACImportCriteria {
    resourceType = 'ValueSet';
    id: string;
    username: string;
    password: string;
}

export interface IExcelConversion {
    success: boolean;
    message?: string;
    bundle?: Bundle;
}

@Injectable()
export class ImportService {

    constructor(private http: HttpClient) {
    }

    public import(contentType: 'json' | 'xml', body: string): Observable<any> {
        const url = '/api/import';
        const headers = new HttpHeaders({ 'Content-Type': contentType === 'json' ? 'application/json' : 'application/xml' });
        return this.http.post(url, body, { headers: headers });
    }

    public importVsac(criteria: VSACImportCriteria): Observable<any> {
        return new Observable<any>((subscriber) => {
            const url = '/api/import/vsac/' + criteria.resourceType + '/' + criteria.id;
            const authorization = btoa(criteria.username + ':' + criteria.password);
            const headers = {
                'vsacAuthorization': 'Basic ' + authorization
            };
            this.http.get(url, { headers: headers })
                .subscribe((results) => {
                    subscriber.next(results);
                }, (err) => {
                    subscriber.error(err);
                });
        });
    }

    public convertExcelToValueSetBundle(data: Uint8Array): IExcelConversion {
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            return { success: false, message: 'The excel workbook must have at least one sheet in it.' };
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const sheetRows = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

        const valueSetBundle = new Bundle();
        valueSetBundle.type = 'transaction';
        valueSetBundle.entry = [];

        for (let i = 1; i < sheetRows.length; i++) {
            const rowNum = i+1;
            const sheetRow = sheetRows[i];
            const valueSetId = sheetRow['A'];
            const valueSetName = sheetRow['B'];
            const valueSetUrl = sheetRow['C'];
            const codeSystem = sheetRow['F'];
            const code = sheetRow['D'];
            const display = sheetRow['E'];
            let foundValueSetEntry = _.find(valueSetBundle.entry, (entry) => (<ValueSet> entry.resource).url === valueSetUrl);

            if (!valueSetUrl) {
                return {success: false, message: `Row ${rowNum} does not specify a value set URL`};
            }

            if (!codeSystem) {
                return { success: false, message: `Row ${rowNum} does not specify a code system URL` };
            }

            if (!code) {
                return { success: false, message: `Row ${rowNum} does not specify a concept code` };
            }

            if (!display) {
                return { success: false, message: `Row ${rowNum} does not specify a concept display` };
            }

            if (!foundValueSetEntry) {
                foundValueSetEntry = <EntryComponent> {
                    resource: <ValueSet> {
                        resourceType: 'ValueSet',
                        url: valueSetUrl,
                        name: valueSetName,
                        compose: {
                            include: []
                        }
                    },
                    request: {
                        method: valueSetId ? 'PUT' : 'POST',
                        url: valueSetId ? `ValueSet/${valueSetId}` : 'ValueSet'
                    }
                };
                valueSetBundle.entry.push(foundValueSetEntry);

                if (valueSetId) {
                    foundValueSetEntry.resource.id = valueSetId;
                }

                if (!valueSetName) {
                    return { success: false, message: `Row ${rowNum} does not specify a value set name` };
                }
            }

            const foundValueSet = <ValueSet> foundValueSetEntry.resource;
            let foundInclude = _.find(foundValueSet.compose.include, (include) => include.system === sheetRow['E']);

            if (!foundInclude) {
                foundInclude = {
                    system: codeSystem,
                    concept: []
                };
                foundValueSet.compose.include.push(foundInclude);
            }

            let foundConcept = _.find(foundInclude.concept, (concept) => concept.code === sheetRow['C']);

            if (!foundConcept) {
                foundConcept = {
                    code: code,
                    display: display
                };
                foundInclude.concept.push(foundConcept);
            }
        }

        return {
            success: true,
            bundle: valueSetBundle
        };
    }
}
