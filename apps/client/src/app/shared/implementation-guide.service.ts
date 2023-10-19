import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SearchImplementationGuideResponseContainer} from '../../../../../libs/tof-lib/src/lib/searchIGResponse-model';
import {BulkUpdateRequest} from '../../../../../libs/tof-lib/src/lib/bulk-update-request';
import {ConfigService} from './config.service';
import {IFhirResource, INonFhirResource} from '@trifolia-fhir/models';
import {FhirResourceService} from './fhir-resource.service';

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
export class ImplementationGuideService extends FhirResourceService {

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
    const url = `/api/implementationGuides/${implementationGuideId}/bulk-update`;
    return this.http.post(url, bulkUpdateRequest);
  }

  public getProfiles(implementationGuideId: string) {
    return this.http.get<any[]>(`/api/implementationGuides/${encodeURIComponent(implementationGuideId)}/profile`);
  }

  public getExamples(implementationGuideId: string): Observable<IFhirResource[]|INonFhirResource[]> {
    return this.http.get<any>(`/api/implementationGuides/${encodeURIComponent(implementationGuideId)}/example`);
  }

  public getPublished(): Observable<PublishedGuideContainerModel[]> {
    return this.http.get<PublishedGuideContainerModel[]>('/api/implementationGuides/published');
  }

  public getPublishedEditions(name: string): Observable<any[]> {
    return this.http.get<any[]>('/api/implementationGuides/published?name=' + name);
  }

  public getEditions(name: string): Observable<any> {
    return this.http.get<any[]>(`/api/implementationGuides/published-editions?name=${encodeURIComponent(name)}`);
  }

  public getImplementationGuides(page = 1, name?: string, title?: string, id?: string) {
    let url = '/api/implementationGuides?page=' + page + '&';

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

  public getImplementationGuide(id: string): Observable<IFhirResource> {
    const url = '/api/implementationGuides/' + encodeURIComponent(id);
    return this.http.get<IFhirResource>(url);
  }

  public getImplementationGuideWithReferences(id: string): Observable<IFhirResource> {
    const url = '/api/implementationGuides/' + encodeURIComponent(id) + "/references";
    return this.http.get<IFhirResource>(url);
  }

  public saveImplementationGuide(implementationGuideId: string, implementationGuide: IFhirResource): Observable<IFhirResource> {
    let url = '/api/implementationGuides';
    if (implementationGuideId) {
      url += '/' + encodeURIComponent(implementationGuideId);
      return this.http.put<IFhirResource>(url, implementationGuide);
    } else {
      return this.http.post<IFhirResource>(url, implementationGuide);
    }
  }

  public updateImplementationGuide(id: string, implementationGuide: IFhirResource): Observable<IFhirResource> {
    if (id) {
      return this.http.put<IFhirResource>(`/api/implementationGuides/${id}`, implementationGuide);
    } else {
     return null;
    }
  }


  public removeImplementationGuide(id: string) {
    return this.http.delete(`/api/implementationGuides/${id}`);
  }

  public copyPermissions(id: string) {
    return this.http.post<number>(`/api/implementationGuides/${id}/copy-permissions`, null);
  }

}
