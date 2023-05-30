import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActiveUserModel, Paginated} from '@trifolia-fhir/tof-lib';
import { IUser } from '@trifolia-fhir/models';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable()
export class ManageService {
  constructor(private http: HttpClient) {
  }

  async getActiveUsers() {
    return await this.http.get<ActiveUserModel[]>('/api/manage/user/active').toPromise();
  }

  async mergeUsers(sourceUserId: string, targetUserId: string) {
    const url = `/api/manage/user/${encodeURIComponent(sourceUserId)}/$merge/${encodeURIComponent(targetUserId)}`;
    return this.http.post(url, null).toPromise();
  }

  async getUsers(searchName: string, count = 10, page = 1): Promise<Paginated<IUser>>  {
    const url = `/api/manage/user?count=${encodeURIComponent(count)}&page=${encodeURIComponent(page)}&name=${encodeURIComponent(searchName || '')}`;
    return firstValueFrom(this.http.get<Paginated<IUser>>(url));
  }

  async sendMessageToActiveUsers(message: string) {
    const url = '/api/manage/user/active/message';
    await this.http.post(url, {
      message: message
    }).toPromise();
  }
}
