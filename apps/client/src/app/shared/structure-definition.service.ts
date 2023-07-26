import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Bundle, StructureDefinition as STU3StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {FhirService} from './fhir.service';
import {FileService} from './file.service';
import {StructureDefinition as R4StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {StructureDefinition as R5StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r5/fhir';
import {BaseDefinitionResponseModel} from '../../../../../libs/tof-lib/src/lib/base-definition-response-model';
import {ILogicalTypeDefinition} from '../../../../../libs/tof-lib/src/lib/logical-type-definition';
import {IFhirResource} from '@trifolia-fhir/models';

@Injectable()
export class StructureDefinitionService {

  constructor(
    private http: HttpClient,
    private fhirService: FhirService,
    private fileService: FileService) {
  }

  public getBaseStructureDefinitions(type: string) {
    const url = `/api/structureDefinition/base/${type}`;
    return this.http.get<string[]>(url);
  }

  public getSupportedLogicalTypes(search?: string) {
    let url = '/api/structureDefinition/type?';

    if (search) url += `search=${encodeURIComponent(search)}&`;

    return this.http.get<ILogicalTypeDefinition[]>(url);
  }

  public getStructureDefinitions(page?: number, nameText?: string, IDText?: string, urlText?: string, implementationGuideId?: string, titleText?: string, typeText?: string): Observable<IFhirResource[]> {
    let url = '/api/structureDefinition?resourcetype=StructureDefinition&';

    if (page) {
      url += `page=${page.toString()}&`;
    }

    if (nameText) {
      url += `name=${encodeURIComponent(nameText)}&`;
    }

    if(IDText){
      url += `resourceid=${encodeURIComponent(IDText)}&`;
    }

    if (urlText) {
      url += `url=${encodeURIComponent(urlText)}&`;
    }

    if (implementationGuideId) {
      url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
    }

    if (titleText) {
      url += `title=${encodeURIComponent(titleText)}&`;
    }

    if (typeText) {
      url += `type=${encodeURIComponent(typeText)}&`;
    }

    url += '_sort=name';

    return this.http.get<IFhirResource[]>(url);
  }

  public getStructureDefinition(id: string): Observable<IFhirResource> {
    if (id === 'from-file') {
      if (this.fileService.file) {
        return new Observable<IFhirResource>((observer) => {
          const fhirResource =  { resource: this.fileService.file.resource };
          observer.next(<IFhirResource> fhirResource);
        });
      }
    }
    else {
      const url = '/api/structureDefinition/' + encodeURIComponent(id);
      return this.http.get<IFhirResource>(url);
    }
  }

  public getBaseStructureDefinition(baseDefinition: string, type?: string): Observable<BaseDefinitionResponseModel> {
    let url = `/api/structureDefinition/base?url=${encodeURIComponent(baseDefinition)}&`;

    if (type) {
      url += `type=${encodeURIComponent(type)}&`;
    }

    return this.http.get<BaseDefinitionResponseModel>(url);
  }

  public save(structureDefinitionId : string, structureDefinition: IFhirResource): Observable<IFhirResource> {
    let url = '/api/structureDefinition';

    if(structureDefinition.resource.text && structureDefinition.resource.text.div && structureDefinition.resource.text.div.indexOf("<br>") > 0){
      structureDefinition.resource.text.div = structureDefinition.resource.text.div.replace("<br>", "");
    }


    if (structureDefinitionId) {
      url += '/' + encodeURIComponent(structureDefinitionId);
      return this.http.put<IFhirResource>(url, structureDefinition);
    } else {
      return this.http.post<IFhirResource>(url, structureDefinition);
    }
  }

  public delete(id: string) {
    return this.http.delete('/api/structureDefinition/' + encodeURIComponent(id));
  }
}
