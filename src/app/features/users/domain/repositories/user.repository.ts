import { UserModel } from '../models/user.model';

export abstract class UserRepository {
  abstract save(input: UserModel): Promise<UserModel>;
}
