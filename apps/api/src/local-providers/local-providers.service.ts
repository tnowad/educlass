import { Injectable } from '@nestjs/common';
import { CreateLocalProviderInput } from './dto/create-local-provider.input';
import { UpdateLocalProviderInput } from './dto/update-local-provider.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalProvider } from './entities/local-provider.entity';

@Injectable()
export class LocalProvidersService {
  constructor(
    @InjectRepository(LocalProvider)
    private localProvidersRepository: Repository<LocalProvider>,
  ) {}
  create(createLocalProviderInput: CreateLocalProviderInput) {
    return this.localProvidersRepository.save(createLocalProviderInput);
  }

  findAll() {
    return this.localProvidersRepository.find();
  }

  findOne(id: string) {
    return this.localProvidersRepository.findOne({ where: { id } });
  }

  update(id: string, updateLocalProviderInput: UpdateLocalProviderInput) {
    return this.localProvidersRepository.update(id, updateLocalProviderInput);
  }

  remove(id: string) {
    return this.localProvidersRepository.delete(id);
  }

  async findLocalProviderByUserId(userId: string): Promise<LocalProvider> {
    return this.localProvidersRepository.findOne({
      where: { user: { id: userId } },
    });
  }
}
