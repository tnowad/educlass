import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { LocalProvider } from 'src/local-providers/entities/local-provider.entity';
import { LocalProvidersService } from 'src/local-providers/local-providers.service';
import { UpdateAvatarInput } from './dto/update-avatar.input';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly localProvidersService: LocalProvidersService,
    private readonly filesServices: FilesService,
  ) {}

  create(createUserInput: CreateUserInput) {
    return this.usersRepository.save(createUserInput);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
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

  async updateAvatar(id: string, updateAvatarInput: UpdateAvatarInput) {
    const user = await this.findOne(id);
    const file = await this.filesServices.uploadFile(updateAvatarInput.avatar);

    user.avatar = file;

    await this.usersRepository.save(user);

    return user;
  }

  async findLocalProviderByUserId(userId: string): Promise<LocalProvider> {
    return this.localProvidersService.findLocalProviderByUserId(userId);
  }

  async updateEmailVerified(userId: string, verified: boolean) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
        select: ['emailVerified'],
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.emailVerified) {
        throw new BadRequestException('Email already verified');
      }

      await manager.update(User, { id: userId }, { emailVerified: verified });
    });
  }
}
