import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { IUser } from '@trifolia-fhir/models';
import { Observable } from 'rxjs';
import { Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class UserService {

    constructor(public http: HttpClient) { }

    public getUsers(name?: string, email?: string, id?: string): Observable<Paginated<IUser>> {

      let url = '/api/users?';

      if (name) {
        url += 'name=' + encodeURIComponent(name) + '&';
      }

      if (email) {
        url += 'email=' + encodeURIComponent(email);
      }

      if (id) {
        url += '_id=' + encodeURIComponent(id);
      }

      return this.http.get<Paginated<IUser>>(url);

    }


    public getMe(): Observable<IUser> {
        return this.http.get<IUser>('/api/users/me');
    }


    public create(user: IUser): Observable<IUser> {
        return this.http.post<IUser>('/api/users', user);
    }

    public update(user: IUser): Observable<IUser> {
        return this.http.put<IUser>(`/api/users/${user.id}`, user);
    }
}
