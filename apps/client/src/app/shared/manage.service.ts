import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActiveUserModel} from '../../../../../libs/tof-lib/src/lib/active-user-model';
import {GetUsersModel} from '../../../../../libs/tof-lib/src/lib/get-users-model';

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

  async getUsers(searchName: string, count = 10, page = 1) {
    const url = `/api/manage/user?count=${encodeURIComponent(count)}&page=${encodeURIComponent(page)}&name=${encodeURIComponent(searchName || '')}`;
    return await this.http.get<GetUsersModel>(url).toPromise();
  }

  async sendMessageToActiveUsers(message: string) {
    const url = '/api/manage/user/active/message';
    await this.http.post(url, {
      message: message
    }).toPromise();
  }
}
