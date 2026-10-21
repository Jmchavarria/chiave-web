import { UserModel } from '../../../users/domain/models/user.model';
import { AuthSession } from '../models/auth-session.model';

export interface loginResponse {
  authSession: {
    accessToken: string;
    refreshToken: string;
  };
  user: UserModel;
}
export abstract class AuthRepository {
  abstract login(email: string, password: string): Promise<loginResponse>;
  abstract verifyEmail(userId: number, token: string): Promise<void>;
}
