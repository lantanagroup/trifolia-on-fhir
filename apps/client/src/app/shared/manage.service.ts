import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActiveUserModel} from '../../../../../libs/tof-lib/src/lib/active-user-model';
import {UserModel} from '../../../../../libs/tof-lib/src/lib/user-model';

@Injectable()
export class ManageService {
  constructor(private http: HttpClient) {
  }

  async getActiveUsers() {
    return await this.http.get<ActiveUserModel[]>('/api/manage/user/active').toPromise();
  }

  async getUsers(count = 10, page = 1) {
    const url = `/api/manage/user?count=${encodeURIComponent(count)}&page=${encodeURIComponent(page)}`;
    return await this.http.get<{ total: number, users: UserModel[] }>(url).toPromise();
  }

  async sendMessageToActiveUsers(message: string) {
    const url = '/api/manage/user/active/message';
    await this.http.post(url, {
      message: message
    }).toPromise();
  }
}
