import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { IUser } from '@trifolia-fhir/models';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

    constructor(public http: HttpClient) { }

    public getUsers(): void {
        this.http.get('/api/users')
            .subscribe(data => {
            },
            error => {
                console.error(error);
            });
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
