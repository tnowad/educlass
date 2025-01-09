import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  create(createUserInput: CreateUserInput) {
    console.log(createUserInput);
    throw new Error('Method not implemented.');
  }

  findAll() {
    throw new Error('Method not implemented.');
  }

  findOne(id: number) {
    console.log(id);
    throw new Error('Method not implemented.');
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    console.log(id, updateUserInput);
    throw new Error('Method not implemented.');
  }

  remove(id: number) {
    console.log(id);
    throw new Error('Method not implemented.');
  }
}
