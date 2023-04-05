import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IHistory} from '@trifolia-fhir/models';

@Injectable()
export class HistoryService {

  constructor(
    protected http: HttpClient) {
  }

  public getHistory(type: string, id: string, page = 1){
    let url = `/api/history/${type}/${id}?`;
    if(page > 1) {
      url += `page=${page}`;
    }
    url += `_sort=versionId`;
    return this.http.get<IHistory[]>(url).toPromise();
  }

}
