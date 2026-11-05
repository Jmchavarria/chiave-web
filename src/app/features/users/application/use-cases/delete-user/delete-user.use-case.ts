import { Injectable } from '@angular/core';
import { UserRepository } from '../../../domain/repositories/user.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  execute(password: string): Promise<void> {
    return this.repository.delete(password);
  }
}
