import { AuthSession } from '../models/auth-session.model';
import { RegisterUser } from '../models/register-user.model';

export abstract class AuthRepository {
  abstract login(email: string, password: string): Promise<AuthSession>;

  abstract register(user: RegisterUser): Promise<void>;

  abstract verifyEmail(token: string): Promise<void>;
}
