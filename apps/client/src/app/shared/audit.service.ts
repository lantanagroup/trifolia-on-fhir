import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAudit } from '@trifolia-fhir/models';
import { Paginated } from '@trifolia-fhir/tof-lib';
import { Observable } from 'rxjs';

@Injectable()
export class AuditService {

  constructor(protected http: HttpClient) {}

  public search(page: number = 1, sort: string = '-timestamp'): Observable<Paginated<IAudit>> {
    let url = '/api/audits?page=' + encodeURIComponent(page) + '&' + '_sort=' + encodeURIComponent(sort) + '&';

    return this.http.get<Paginated<IAudit>>(url);
}

}
