import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Bundle, ImplementationGuide as STU3ImplementationGuide, OperationOutcome as STU3OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ImplementationGuide as R4ImplementationGuide, OperationOutcome as R4OperationOutcome} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import { getErrorString } from '../../../../../libs/tof-lib/src/lib/helper';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';


export class PublishedGuideModel {
    public name: string;
    public url: string;
    public version: string;
    public 'npm-name': string;
}

@Injectable()
export class ImplementationGuideService {

    constructor(private http: HttpClient,
                public configService: ConfigService,
                public router: Router) { }

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

    public getImplementationGuides(page = 1, name?: string, title?: string) {
        let url = '/api/implementationGuide?page=' + page + '&';

        if (name) {
            url += 'name=' + encodeURIComponent(name) + '&';
        }

        if (title) {
            url += 'title=' + encodeURIComponent(title) + '&';
        }

        url += '_sort=name';
        return this.http.get<Bundle>(url);
    }

    public getImplementationGuide(id: string) {
        return this.http.get<STU3ImplementationGuide | STU3OperationOutcome | R4ImplementationGuide | R4OperationOutcome>(`/api/implementationGuide/${id}`);
    }

    public saveImplementationGuide(implementationGuide: STU3ImplementationGuide | R4ImplementationGuide) {
        if (implementationGuide.id) {
            return this.http.put(`/api/implementationGuide/${implementationGuide.id}`, implementationGuide);
        } else {
            return this.http.post('/api/implementationGuide', implementationGuide);
        }
    }

    public deleteImplementationGuide(ig: STU3ImplementationGuide | R4ImplementationGuide){
      if (!confirm(`Are you sure you want to delete ${ig.name}?`)) {
        return false;
      }

      const name = ig.name;
      const id = ig.id;

      this.removeImplementationGuide(ig.id)
        .subscribe(() => {
          this.configService.project = null;
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.fhirServer}/home`]);
          alert(`IG ${name} with id ${id} has been deleted`);
        }, (err) => {
          console.log('Error while deleting the IG: ' + getErrorString(err));
        });
    }

    public removeImplementationGuide(id: string) {
        return this.http.delete(`/api/implementationGuide/${id}`);
    }

    public copyPermissions(id: string) {
      return this.http.post<number>(`/api/implementationGuide/${id}/copy-permissions`, null);
    }
}
