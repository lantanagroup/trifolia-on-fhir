import {Injectable} from '@angular/core';
import {ImplementationGuideListItemModel} from '../models/implementation-guide-list-item-model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ImplementationGuide as STU3ImplementationGuide, OperationOutcome as STU3OperationOutcome} from '../models/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide, OperationOutcome as R4OperationOutcome} from '../models/r4/fhir';

export class PublishedGuideModel {
    public name: string;
    public url: string;
    public version: string;
}

@Injectable()
export class ImplementationGuideService {

    constructor(private http: HttpClient) { }

    /*
    private _serverError(err: any) {
        console.log('sever error:', err);  // debug
        if (err instanceof Response) {
            return Observable.throw(err.json().error || 'backend server error');
            // if you're using lite-server, use the following line
            // instead of the line above:
            //return Observable.throw(err.text() || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }
    */

    public getPublished(): Observable<PublishedGuideModel[]> {
        return this.http.get<PublishedGuideModel[]>('/api/implementationGuide/published');
    }

    public getImplementationGuides(query?: string): Observable<ImplementationGuideListItemModel[]> {
        return this.http.get<ImplementationGuideListItemModel[]>('/api/implementationGuide');
            //.catch(this._serverError);

    }

    public getImplementationGuide(id: string) {
        return this.http.get<STU3ImplementationGuide | STU3OperationOutcome | R4ImplementationGuide | R4OperationOutcome>('/api/implementationGuide/' + id);
    }

    public saveImplementationGuide(implementationGuide: STU3ImplementationGuide | R4ImplementationGuide) {
        if (implementationGuide.id) {
            return this.http.put('/api/implementationGuide/' + implementationGuide.id, implementationGuide);
        } else {
            return this.http.post('/api/implementationGuide', implementationGuide);
        }
    }

    public removeImplementationGuide(id: string) {
        return this.http.delete('/api/implementationGuide/' + id);
    }
}
