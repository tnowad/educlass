import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInInput } from './dtos/sign-in.input';
import { SignUpInput } from './dtos/sign-up.input';
import { LocalProvidersService } from 'src/local-providers/local-providers.service';
import { hashSync, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TokensResult } from './dtos/tokens.result';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './dtos/jwt-payload';
import { RequestResetPasswordResult } from './dtos/request-reset-password.result';
import { randomUUID } from 'crypto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ResetPasswordInput } from './dtos/reset-password.input';
import { ResetPasswordResult } from './dtos/reset-password.result';
import { RequestResetPasswordInput } from './dtos/request-reset-password.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private localProvidersService: LocalProvidersService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signIn(signInInput: SignInInput): Promise<TokensResult> {
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

  async signUp(signUpInput: SignUpInput): Promise<TokensResult> {
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

  async requestPasswordReset(
    requestResetPasswordInput: RequestResetPasswordInput,
  ): Promise<RequestResetPasswordResult> {
    const { email } = requestResetPasswordInput;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = randomUUID();

    // TODO: Change the expiration time lower than 60 seconds
    await this.cacheManager.set(token, user.id, 60);

    await this.mailService.userResetPassword({
      to: user.email,
      data: {
        hash: token,
      },
    });

    return {
      success: true,
      message: 'Reset password email sent',
    };
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<ResetPasswordResult> {
    const { token, password } = resetPasswordInput;
    const userId = await this.cacheManager.get<string | null>(token);

    if (!userId) {
      throw new BadRequestException('Invalid token');
    }

    const localProvider =
      await this.localProvidersService.findLocalProviderByUserId(userId);

    if (!localProvider) {
      throw new BadRequestException('Local provider not found');
    }

    localProvider.password = hashSync(password);

    await this.localProvidersService.save(localProvider);

    return {
      message: 'Password reset successfully',
      success: true,
    };
  }
}
