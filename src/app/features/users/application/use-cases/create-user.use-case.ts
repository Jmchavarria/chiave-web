import { Injectable } from '@angular/core';
import { UserModel } from '../../domain/models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  execute(input: UserModel): Promise<UserModel> {
    return this.repository.save(input);
  }
}
