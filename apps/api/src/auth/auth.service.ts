import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInInput } from './dtos/sign-in.input';
import { SignUpInput } from './dtos/sign-up.input';
import { LocalProvidersService } from 'src/local-providers/local-providers.service';
import { hashSync, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TokensResponse } from './dtos/tokens-response.dto';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './dtos/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private localProvidersService: LocalProvidersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(signInInput: SignInInput): Promise<TokensResponse> {
    const user = await this.userService.findOneByEmail(signInInput.email);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (!user.localProvider) {
      throw new ForbiddenException('Sign with local provider not found');
    }
    const passwordIsValid = compareSync(
      signInInput.password,
      user.localProvider.password,
    );
    if (!passwordIsValid) {
      throw new ForbiddenException('Invalid password');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async signUp(signUpInput: SignUpInput): Promise<TokensResponse> {
    if (await this.userService.findOneByEmail(signUpInput.email)) {
      throw new ForbiddenException('Email already exists');
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

    await this.mailService.userSignUp({
      to: user.email,
      data: {
        hash: user.email,
      },
    });

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async validateUser(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
