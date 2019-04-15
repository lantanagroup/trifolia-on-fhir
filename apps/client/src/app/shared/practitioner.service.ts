import {Injectable} from '@angular/core';
import {Practitioner} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class PractitionerService {

    constructor(private http: HttpClient) { }

    public getMe(): Observable<Practitioner> {
        return this.http.get('/api/practitioner/me')
            .map(personObj => new Practitioner(personObj));
    }

    public updateMe(person: Practitioner): Observable<Practitioner> {
        return this.http.post('/api/practitioner/me', person)
            .map(personObj => new Practitioner(personObj));
    }
}
