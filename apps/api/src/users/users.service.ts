import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LocalProvider } from 'src/local-providers/entities/local-provider.entity';
import { LocalProvidersService } from 'src/local-providers/local-providers.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly localProvidersService: LocalProvidersService,
  ) {}

  create(createUserInput: CreateUserInput) {
    return this.usersRepository.save(createUserInput);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['localProvider'],
    });
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return this.usersRepository.update(id, updateUserInput);
  }

  save(user: User) {
    return this.usersRepository.save(user);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }

  async findLocalProviderByUserId(userId: string): Promise<LocalProvider> {
    return this.localProvidersService.findLocalProviderByUserId(userId);
  }
}
