import {Injectable} from '@angular/core';
import {Practitioner} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class PractitionerService {

    constructor(private http: HttpClient) { }

    public getMe(): Observable<Practitioner> {
        return this.http.get('/api/practitioner/me')
          .pipe(map(personObj => new Practitioner(personObj)));
    }

    public updateMe(person: Practitioner): Observable<Practitioner> {
        return this.http.post('/api/practitioner/me', person)
          .pipe(map(personObj => new Practitioner(personObj)));
    }
}
