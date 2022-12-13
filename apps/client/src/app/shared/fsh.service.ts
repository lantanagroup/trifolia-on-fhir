import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDomainResource } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { FromFSHModel, ToFSHModel } from '../../../../../libs/tof-lib/src/lib/fsh';

@Injectable({
  providedIn: 'root'
})
export class FshService {

  constructor(private http: HttpClient) { }

  public async convertToFSH(resource: IDomainResource) {
    const fsh = await this.http.post<ToFSHModel>('/api/fsh/$to-fsh', resource).toPromise();
    return fsh;
  }

  public async convertFromFSH(fsh: string) {
    return await this.http.post<FromFSHModel>('/api/fsh/$from-fsh', fsh).toPromise();
  }
}
