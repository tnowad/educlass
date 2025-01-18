import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInInput } from './dtos/sign-in.input';
import { SignUpInput } from './dtos/sign-up.input';
import { LocalProvidersService } from 'src/local-providers/local-providers.service';
import { hashSync, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TokensResponse } from './dtos/tokens-response.dto';
import { MailService } from 'src/mail/mail.service';
import { RequestResetPasswordResponse } from './dtos/request-reset-password-response.dto';
import { createHash, randomBytes } from 'crypto';

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

  async requestPasswordReset(
    email: string,
  ): Promise<RequestResetPasswordResponse> {
    // TODO: Implement CAPTCHA and rate limit
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedToken = createHash('sha256')
      .update(randomBytes(32))
      .digest('hex');

    // TODO: Store hashedToken in Redis with expiration time of 15 minutes
    await this.mailService.userResetPassword({
      to: user.email,
      data: {
        hash: hashedToken,
      },
    });

    return {
      success: true,
      message: 'Reset password email sent',
    };
  }
}
