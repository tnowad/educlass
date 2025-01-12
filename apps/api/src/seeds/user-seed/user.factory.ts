import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { LocalProvider } from 'src/local-providers/entities/local-provider.entity';
import { hashSync } from 'bcryptjs';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(LocalProvider)
    private readonly localProviderRepository: Repository<LocalProvider>,
  ) {}

  createRandomUser() {
    return () => {
      const user = this.usersRepository.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: faker.datatype.boolean(),
      });

      const localProvider = this.localProviderRepository.create({
        password: hashSync(faker.internet.password(), 10),
      });

      user.localProvider = localProvider;

      return this.usersRepository.save(user);
    };
  }
}
