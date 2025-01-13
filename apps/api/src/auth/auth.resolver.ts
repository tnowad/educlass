import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignInResponse } from './dtos/sign-in-response.dto';
import { SignInInput } from './dtos/sign-in.input';
import { User } from 'src/users/entities/user.entity';
import { SignUpInput } from './dtos/sign-up.input';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignInResponse)
  signIn(@Args('signInInput') signInInput: SignInInput): SignInResponse {
    console.log(signInInput);
    return { accessToken: 'access token', refreshToken: 'refresh token' };
  }

  @Mutation(() => User)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<User> {
    return await this.authService.signUp(signUpInput);
  }
}
