import { Injectable } from '@nestjs/common';
import { UserFactory } from './user.factory';

@Injectable()
export class UserSeedService {
  constructor(private readonly userFactory: UserFactory) {}

  async run() {
    const user = await this.userFactory.createRandomUser()();
    console.log('User created:', user);
  }
}
