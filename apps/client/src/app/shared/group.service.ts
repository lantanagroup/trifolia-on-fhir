import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Bundle, Group} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';

@Injectable()
export class GroupService {

  constructor(private http: HttpClient) {
  }

  public createManagingGroup(group: Group) {
    return this.http.post<Group>('/api/group/managing', group);
  }

  public updateManagingGroup(group: Group) {
    return this.http.put<Group>('/api/group/managing/' + group.id, group);
  }

  public deleteManagingGroup(group: Group) {
    return this.http.delete('/api/group/managing/' + group.id);
  }

  public deleteMembershipGroup(group: Group) {
    return this.http.delete('/api/group/membership' + group.id);
  }

  public getMembership(name?: string, id?: string): Observable<Bundle> {
    let url = '/api/group/membership?';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (id) {
      url += '_id=' + encodeURIComponent(id) + '&';
    }

    return this.http.get<Bundle>(url);
  }

  public getManaging(): Observable<Bundle> {
    return this.http.get<Bundle>('/api/group/managing');
  }

  public save(group: Group): Observable<Group> {
    if (group.id) {
      const url = '/api/group/' + encodeURIComponent(group.id);
      return this.http.put<Group>(url, group);
    } else {
      return this.http.post<Group>('/api/group', group);
    }
  }

  public search() {
    return this.http.get<Group[]>('/api/group');
  }

  public get(id: string) {
    const url = '/api/group/' + encodeURIComponent(id);
    return this.http.get<Group>(url);
  }

  public delete(id: string) {
    const url = '/api/group/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
