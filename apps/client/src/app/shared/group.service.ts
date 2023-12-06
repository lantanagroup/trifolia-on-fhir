import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {IGroup} from '@trifolia-fhir/models';

@Injectable()
export class GroupService {

  constructor(private http: HttpClient) {
  }

  public createManagingGroup(group: IGroup) {
    return this.http.post<IGroup>('/api/groups/managing', group);
  }

  public updateManagingGroup(group: IGroup) {
    return this.http.put<IGroup>('/api/groups/managing/' + group.id, group);
  }

  public deleteManagingGroup(group: IGroup) {
    return this.http.delete('/api/groups/managing/' + group.id);
  }

  public deleteMembershipGroup(group: IGroup) {
    return this.http.delete('/api/groups/membership' + group.id);
  }


  public getGroupInfo(groupIds: string[]): Observable<IGroup[]> {
    let url = '/api/groups/info?';

    if (groupIds) {
      url += '_id=' + encodeURIComponent(groupIds.join(',')) + '&';
      return this.http.get<IGroup[]>(url);
    }

    return of([]);
  }

  public getMembership(name?: string, id?: string): Observable<IGroup[]> {
    let url = '/api/groups/membership?';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (id) {
      url += '_id=' + encodeURIComponent(id) + '&';
    }

    return this.http.get<IGroup[]>(url);
  }

  public getManaging(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>('/api/groups/managing');
  }

  public save(group: IGroup): Observable<IGroup> {
    if (group.id) {
      const url = '/api/groups/' + encodeURIComponent(group.id);
      return this.http.put<IGroup>(url, group);
    } else {
      return this.http.post<IGroup>('/api/group', group);
    }
  }

  public search() {
    return this.http.get<IGroup[]>('/api/group');
  }

  public get(id: string) {
    const url = '/api/groups/' + encodeURIComponent(id);
    return this.http.get<IGroup>(url);
  }

  public delete(id: string) {
    const url = '/api/groups/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
