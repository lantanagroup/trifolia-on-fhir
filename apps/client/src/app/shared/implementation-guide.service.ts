import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SearchImplementationGuideResponseContainer} from '../../../../../libs/tof-lib/src/lib/searchIGResponse-model';
import {BulkUpdateRequest} from '../../../../../libs/tof-lib/src/lib/bulk-update-request';
import {ConfigService} from './config.service';
import { IConformance, IExample } from '@trifolia-fhir/models';
import { ConformanceService } from './conformance.service';

export class PublishedGuideModel {
  public name: string;
  public url: string;
  public version: string;
  public 'npm-name': string;
}

export class PublishedGuideContainerModel {
  public name: string;
  public canonical: string;
  public category: string;
  public description: string;
  public editions;
  public 'npm-name': string;
}

export class PublishedGuideEditionsModel {
  public url: string;
  public version: string;
}

@Injectable()
export class ImplementationGuideService extends ConformanceService {

  constructor(protected http: HttpClient,
              public configService: ConfigService,
              public router: Router) {
    super(http);
  }

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

  public bulkUpdate(implementationGuideId: string, bulkUpdateRequest: BulkUpdateRequest) {
    const url = `/api/implementationGuide/${implementationGuideId}/bulk-update`;
    return this.http.post(url, bulkUpdateRequest);
  }

  public getProfiles(implementationGuideId: string) {
    return this.http.get<any[]>(`/api/implementationGuide/${encodeURIComponent(implementationGuideId)}/profile`);
  }

  public getExamples(implementationGuideId: string): Observable<IConformance[]|IExample[]> {
    return this.http.get<any>(`/api/implementationGuide/${encodeURIComponent(implementationGuideId)}/example`);
  }

  public getPublished(): Observable<PublishedGuideContainerModel[]> {
    return this.http.get<PublishedGuideContainerModel[]>('/api/implementationGuide/published');
  }

  public getPublishedEditions(name: string): Observable<any[]> {
    return this.http.get<any[]>('/api/implementationGuide/published?name=' + name);
  }

  public getImplementationGuides(page = 1, name?: string, title?: string, id?: string) {
    let url = '/api/implementationGuide?page=' + page + '&';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (title) {
      url += 'title=' + encodeURIComponent(title) + '&';
    }

    if (id) {
      url += '_id=' + encodeURIComponent(id) + '&';
    }

    url += '_sort=name';
    return this.http.get<SearchImplementationGuideResponseContainer>(url);
  }

  public getImplementationGuide(id: string): Observable<IConformance> {
    const url = '/api/implementationGuide/' + encodeURIComponent(id);
    return this.http.get<IConformance>(url);
  }

  public getImplementationGuideWithReferences(id: string): Observable<IConformance> {
    const url = '/api/implementationGuide/' + encodeURIComponent(id) + "/references";
    return this.http.get<IConformance>(url);
  }

  public saveImplementationGuide(implementationGuide: IConformance): Observable<IConformance> {
    return this.http.post<IConformance>('/api/implementationGuide', implementationGuide);
  }

  public updateImplementationGuide(id: string, implementationGuide: IConformance): Observable<IConformance> {
    if (id) {
      return this.http.put<IConformance>(`/api/implementationGuide/${id}`, implementationGuide);
    } else {
     return null;
    }
  }


  public removeImplementationGuide(id: string) {
    return this.http.delete(`/api/implementationGuide/${id}`);
  }

  public copyPermissions(id: string) {
    return this.http.post<number>(`/api/implementationGuide/${id}/copy-permissions`, null);
  }

}
