import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LocalProvider } from 'src/local-providers/entities/local-provider.entity';
import { UpdateAvatarInput } from './dto/update-avatar.input';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.usersService.remove(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateAvatar(
    @Args('updateAvatarInput') updateAvatarInput: UpdateAvatarInput,
    @CurrentUser() user: User,
  ) {
    return this.usersService.updateAvatar(user.id, updateAvatarInput);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return this.usersService.findOne(user.id);
  }

  @ResolveField(() => LocalProvider, { nullable: true })
  async localProvider(@Parent() user: User): Promise<LocalProvider> {
    return this.usersService.findLocalProviderByUserId(user.id);
  }
}
