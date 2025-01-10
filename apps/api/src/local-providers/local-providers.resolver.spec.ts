import { Test, TestingModule } from '@nestjs/testing';
import { LocalProvidersResolver } from './local-providers.resolver';
import { LocalProvidersService } from './local-providers.service';

describe('LocalProvidersResolver', () => {
  let resolver: LocalProvidersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalProvidersResolver, LocalProvidersService],
    }).compile();

    resolver = module.get<LocalProvidersResolver>(LocalProvidersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
