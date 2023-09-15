import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, firstValueFrom} from 'rxjs';
import * as XLSX from 'xlsx';
import {Bundle, EntryComponent, ValueSet} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { IProjectResource } from '@trifolia-fhir/models';

export class VSACImportCriteria {
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

  public async checkResourcesStatus(resourceReferences: {resourceType: string, id: string, isExample: boolean}[], implementationGuideId?: string) {
    let url = '/api/import/resourcesStatus';
    if (implementationGuideId) {
      url += `?implementationguideid=${implementationGuideId}`;
    }
    return firstValueFrom(this.http.post<{ [resourceReference: string]: {resource?: IProjectResource, action: 'update'|'add'|'unknown'} }>(url, resourceReferences));
  }

  public importVsac(criteria: VSACImportCriteria): Observable<any> {
    return new Observable<any>((subscriber) => {
      const url = `/api/import/vsac/${encodeURIComponent(criteria.id)}`;
      const authorization = btoa((criteria.username || '') + ':' + criteria.password);
      const headers = {
        'vsacAuthorization': 'Basic ' + authorization
      };
      this.http.get(url, {headers: headers})
        .subscribe({
          next: (results) => {
            subscriber.next(results);
          }, 
          error: (err) => {
            subscriber.error(err);
          }
        });
      });
  }

  public convertExcelToValueSetBundle(data: Uint8Array): IExcelConversion {
    const workbook = XLSX.read(data, {type: 'array'});

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {success: false, message: 'The excel workbook must have at least one sheet in it.'};
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const sheetRows = XLSX.utils.sheet_to_json(worksheet, {header: 'A'});
    if (sheetRows.length === 0) {
      return {success: false, message: 'The excel sheet must have at least one row in it.'};
    }

    const valueSetBundle = new Bundle();
    valueSetBundle.type = 'transaction';
    valueSetBundle.entry = [];

    for (let i = 1; i < sheetRows.length; i++) {
      const rowNum = i + 1;
      const sheetRow = sheetRows[i];
      const valueSetId = sheetRow['A'];
      const valueSetName = sheetRow['B'];
      const valueSetUrl = sheetRow['C'];
      const codeSystem = sheetRow['F'];
      const code = sheetRow['D'];
      const display = sheetRow['E'];
      let foundValueSetEntry = (valueSetBundle.entry || []).find((entry) => (<ValueSet>entry.resource).url === valueSetUrl);

      if (!valueSetUrl) {
        return {success: false, message: `Row ${rowNum} does not specify a value set URL.`};
      }

      if (!codeSystem) {
        return {success: false, message: `Row ${rowNum} does not specify a code system URL.`};
      }

      if (!code) {
        return {success: false, message: `Row ${rowNum} does not specify a concept code.`};
      }

      if (!display) {
        return {success: false, message: `Row ${rowNum} does not specify a concept display.`};
      }

      if (!foundValueSetEntry) {
        foundValueSetEntry = <EntryComponent>{
          resource: <ValueSet>{
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
          return {success: false, message: `Row ${rowNum} does not specify a value set name.`};
        }
      }

      const foundValueSet = <ValueSet>foundValueSetEntry.resource;
      let foundInclude = (foundValueSet.compose.include || []).find((include) => include.system === codeSystem);

      if (!foundInclude) {
        foundInclude = {
          system: codeSystem,
          concept: []
        };
        foundValueSet.compose.include.push(foundInclude);
      }

      let foundConcept = (foundInclude.concept || []).find((concept) => concept.code === code);

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
