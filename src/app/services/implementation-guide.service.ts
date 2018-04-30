import { Injectable } from '@angular/core';
import { ImplementationGuideListItemModel } from '../models/implementation-guide-list-item-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

    public getImplementationGuides(query: string): Observable<ImplementationGuideListItemModel[]> {
        return this.http.get('/api/implementationGuide');
            //.catch(this._serverError);

    }
}
