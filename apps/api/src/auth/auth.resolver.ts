import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInResponse } from './dtos/sign-in-response.dto';
import { SignInInput } from './dtos/sign-in.input';

@Resolver()
export class AuthResolver {
  @Mutation(() => SignInResponse)
  signIn(@Args('signInInput') signInInput: SignInInput): SignInResponse {
    console.log(signInInput);
    return { accessToken: 'access token', refreshToken: 'refresh token' };
  }
}
