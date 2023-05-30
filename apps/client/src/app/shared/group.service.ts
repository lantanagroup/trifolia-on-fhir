import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Bundle, Group} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';
import {IGroup} from '@trifolia-fhir/models';

@Injectable()
export class GroupService {

  constructor(private http: HttpClient) {
  }

  public createManagingGroup(group: IGroup) {
    return this.http.post<IGroup>('/api/group/managing', group);
  }

  public updateManagingGroup(group: IGroup) {
    return this.http.put<IGroup>('/api/group/managing/' + group.id, group);
  }

  public deleteManagingGroup(group: IGroup) {
    return this.http.delete('/api/group/managing/' + group.id);
  }

  public deleteMembershipGroup(group: IGroup) {
    return this.http.delete('/api/group/membership' + group.id);
  }


  public getMembership(name?: string, id?: string): Observable<IGroup[]> {
    let url = '/api/group/membership?';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (id) {
      url += '_id=' + encodeURIComponent(id) + '&';
    }

    return this.http.get<IGroup[]>(url);
  }

  public getManaging(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>('/api/group/managing');
  }

  public save(group: IGroup): Observable<IGroup> {
    if (group.id) {
      const url = '/api/group/' + encodeURIComponent(group.id);
      return this.http.put<IGroup>(url, group);
    } else {
      return this.http.post<IGroup>('/api/group', group);
    }
  }

  public search() {
    return this.http.get<IGroup[]>('/api/group');
  }

  public get(id: string) {
    const url = '/api/group/' + encodeURIComponent(id);
    return this.http.get<IGroup>(url);
  }

  public delete(id: string) {
    const url = '/api/group/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
