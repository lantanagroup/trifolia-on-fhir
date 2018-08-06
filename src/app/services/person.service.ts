import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Person } from '../models/stu3/fhir';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PersonService {

    constructor(private http: HttpClient) { }

    public getMe(shouldCreate: boolean = false): Observable<Person> {
        return this.http.get('/api/person/me?shouldCreate=' + shouldCreate)
            .map(personObj => new Person(personObj));
    }

    public updateMe(person: Person): Observable<Response> {
        return this.http.put('/api/person/me', person);
    }
}
