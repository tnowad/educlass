import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInResponse } from './dtos/sign-in-response.dto';
import { SignInInput } from './dtos/sign-in.input';
import { User } from 'src/users/entities/user.entity';
import { SignUpInput } from './dtos/sign-up.input';

@Resolver()
export class AuthResolver {
  @Mutation(() => SignInResponse)
  signIn(@Args('signInInput') signInInput: SignInInput): SignInResponse {
    console.log(signInInput);
    return { accessToken: 'access token', refreshToken: 'refresh token' };
  }

  @Mutation(() => User)
  signUp(@Args('signUpInput') signUpInput: SignUpInput): User {
    console.log(signUpInput);
    return {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'John Doe',
      email: 'john@doe.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
      localProvider: null,
    };
  }
}
