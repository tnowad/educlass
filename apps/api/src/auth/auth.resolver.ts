import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInInput } from './dtos/sign-in.input';
import { SignUpInput } from './dtos/sign-up.input';
import { AuthService } from './auth.service';
import { TokensResponse } from './dtos/tokens-response.dto';
import { RequestResetPasswordResponse } from './dtos/request-reset-password-response.dto';

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

  @Mutation(() => RequestResetPasswordResponse)
  async requestPasswordReset(
    @Args('email') email: string,
  ): Promise<RequestResetPasswordResponse> {
    return await this.authService.requestPasswordReset(email);
  }
}
