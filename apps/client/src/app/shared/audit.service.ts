import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAudit } from '@trifolia-fhir/models';
import { Paginated } from '@trifolia-fhir/tof-lib';
import { Observable } from 'rxjs';

@Injectable()
export class AuditService {

  private apiBase = '/api/audits';

  constructor(protected http: HttpClient) {}

  public search(page: number = 1, itemsPerPage: number = 10, sort: string = '-timestamp', filters: {[key: string]: string} = {}): Observable<Paginated<IAudit>> {    
    let url = this.apiBase + `?page=${encodeURIComponent(page)}&itemsPerPage=${encodeURIComponent(itemsPerPage)}&_sort=${encodeURIComponent(sort)}&filters=${encodeURIComponent(JSON.stringify(filters))}`;
    return this.http.get<Paginated<IAudit>>(url);
  }

  public save(audit: IAudit): Observable<IAudit> {
    if (audit.id) {
      const url = `${this.apiBase}/${encodeURIComponent(audit.id)}`;
      return this.http.put<IAudit>(url, audit);
    }

    return this.http.post<IAudit>(this.apiBase, audit);
  }

}
