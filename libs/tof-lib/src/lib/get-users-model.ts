import {UserModel} from './user-model';

export class GetUsersModel {
  total: number;
  hasMore: boolean;
  users: UserModel[];
}
