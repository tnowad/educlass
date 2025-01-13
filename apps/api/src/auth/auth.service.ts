import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';
import { SignInInput } from './dtos/sign-in.input';
import { User } from 'src/users/entities/user.entity';
import { SignUpInput } from './dtos/sign-up.input';
import { LocalProvidersService } from 'src/local-providers/local-providers.service';
import { hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TokensResponse } from './dtos/tokens-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private localProvidersService: LocalProvidersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInInput: SignInInput): Promise<User> {
    const user = await this.userService.findOneByEmail(signInInput.email);
    if (!user) {
      return null;
    }
    if (!user.localProvider) {
      return null;
    }
    const passwordIsValid = bcrypt.compareSync(
      signInInput.password,
      user.localProvider.password,
    );
    if (!passwordIsValid) {
      return null;
    }
    return user;
  }

  async signUp(signUpInput: SignUpInput): Promise<TokensResponse> {
    if (await this.userService.findOneByEmail(signUpInput.email)) {
      return null;
    }

    const user = await this.userService.create({
      name: signUpInput.name,
      email: signUpInput.email,
      emailVerified: false,
    });

    const localProvider = await this.localProvidersService.create({
      password: hashSync(signUpInput.password),
    });

    user.localProvider = localProvider;

    this.userService.save(user);

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }
}
