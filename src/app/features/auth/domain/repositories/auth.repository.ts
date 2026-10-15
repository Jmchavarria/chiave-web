import { AuthSession } from '../models/auth-session.model';
export abstract class AuthRepository {
  abstract login(email: string, password: string): Promise<AuthSession>;
  abstract verifyEmail(token: string): Promise<void>;
}
