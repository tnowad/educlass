import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInInput } from './dtos/sign-in.input';
import { SignUpInput } from './dtos/sign-up.input';
import { AuthService } from './auth.service';
import { TokensResult } from './dtos/tokens.result';
import { RequestResetPasswordResult } from './dtos/request-reset-password.result';
import { ResetPasswordInput } from './dtos/reset-password.input';
import { ResetPasswordResult } from './dtos/reset-password.result';
import { RequestResetPasswordInput } from './dtos/request-reset-password.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => TokensResult)
  signIn(@Args('signInInput') signInInput: SignInInput): Promise<TokensResult> {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => TokensResult)
  async signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<TokensResult> {
    return await this.authService.signUp(signUpInput);
  }

  @Mutation(() => RequestResetPasswordResult)
  async requestPasswordReset(
    @Args('requestResetPasswordInput')
    requestResetPasswordInput: RequestResetPasswordInput,
  ): Promise<RequestResetPasswordResult> {
    return await this.authService.requestPasswordReset(
      requestResetPasswordInput,
    );
  }

  @Mutation(() => ResetPasswordResult)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ): Promise<ResetPasswordResult> {
    return await this.authService.resetPassword(resetPasswordInput);
  }
}
