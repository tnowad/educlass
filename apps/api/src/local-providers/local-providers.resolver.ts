import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LocalProvidersService } from './local-providers.service';
import { LocalProvider } from './entities/local-provider.entity';
import { CreateLocalProviderInput } from './dto/create-local-provider.input';
import { UpdateLocalProviderInput } from './dto/update-local-provider.input';

@Resolver(() => LocalProvider)
export class LocalProvidersResolver {
  constructor(private readonly localProvidersService: LocalProvidersService) {}

  @Mutation(() => LocalProvider)
  createLocalProvider(
    @Args('createLocalProviderInput')
    createLocalProviderInput: CreateLocalProviderInput,
  ) {
    return this.localProvidersService.create(createLocalProviderInput);
  }

  @Query(() => [LocalProvider], { name: 'localProviders' })
  findAll() {
    return this.localProvidersService.findAll();
  }

  @Query(() => LocalProvider, { name: 'localProvider' })
  findOne(@Args('id') id: string) {
    return this.localProvidersService.findOne(id);
  }

  @Mutation(() => LocalProvider)
  updateLocalProvider(
    @Args('updateLocalProviderInput')
    updateLocalProviderInput: UpdateLocalProviderInput,
  ) {
    return this.localProvidersService.update(
      updateLocalProviderInput.id,
      updateLocalProviderInput,
    );
  }

  @Mutation(() => LocalProvider)
  removeLocalProvider(@Args('id') id: string) {
    return this.localProvidersService.remove(id);
  }
}
