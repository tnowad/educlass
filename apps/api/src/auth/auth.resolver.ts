import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SignInInput } from './dtos/sign-in.input';
import { SignUpInput } from './dtos/sign-up.input';
import { AuthService } from './auth.service';
import { TokensResponse } from './dtos/tokens-response.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './graphql-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

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
  async getUserByToken(@Context('req') req: any): Promise<User> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Token không được cung cấp');
    }

    return await this.authService.validateUser(token);
  }
}
