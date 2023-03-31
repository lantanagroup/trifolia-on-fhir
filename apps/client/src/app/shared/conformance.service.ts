import { Injectable } from '@angular/core';
import { Bundle, CodeSystem, OperationOutcome } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICodeSystem } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { IConformance, IProject } from '@trifolia-fhir/models';

@Injectable()
export class ConformanceService {

    constructor(
        protected http: HttpClient) {
    }


    getEmpty(): Observable<IConformance> {
        const url = '/api/conformance/empty'
        return this.http.get<IConformance>(url);
    }
}
