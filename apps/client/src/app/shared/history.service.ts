import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IHistory} from '@trifolia-fhir/models';
import { Observable } from 'rxjs';
import { Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class HistoryService {

  constructor(
    protected http: HttpClient) {
  }

  public getHistory(type: string, id: string, page = 1): Observable<Paginated<IHistory>> {
    let url = `/api/history/${type}/${id}?`;
    if(page > 1) {
      url += `page=${page}`;
    }
    url += `&_sort=versionId`;
    return this.http.get<Paginated<IHistory>>(url);
  }

}
