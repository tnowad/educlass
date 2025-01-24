import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInInput } from './dtos/sign-in.input';
import { SignUpInput } from './dtos/sign-up.input';
import { AuthService } from './auth.service';
import { TokensResponse } from './dtos/tokens-response.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './graphql-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from './decorators/user.decorator';
import { UsersService } from 'src/users/users.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => TokensResponse)
  signIn(
    @Args('signInInput') signInInput: SignInInput,
  ): Promise<TokensResponse> {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => TokensResponse)
  async signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<TokensResponse> {
    return await this.authService.signUp(signUpInput);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async getCurrentUser(@CurrentUser() user: User): Promise<User> {
    return this.usersService.findOne(user.id);
  }
}
