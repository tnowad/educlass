import { Test, TestingModule } from '@nestjs/testing';
import { LocalProvidersService } from './local-providers.service';

describe('LocalProvidersService', () => {
  let service: LocalProvidersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalProvidersService],
    }).compile();

    service = module.get<LocalProvidersService>(LocalProvidersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
