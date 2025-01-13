import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInInput } from './dtos/sign-in.input';
import { SignUpInput } from './dtos/sign-up.input';
import { AuthService } from './auth.service';
import { TokensResponse } from './dtos/tokens-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => TokensResponse)
  signIn(@Args('signInInput') signInInput: SignInInput): TokensResponse {
    console.log(signInInput);
    return { accessToken: 'access token', refreshToken: 'refresh token' };
  }

  @Mutation(() => TokensResponse)
  async signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<TokensResponse> {
    return await this.authService.signUp(signUpInput);
  }
}
