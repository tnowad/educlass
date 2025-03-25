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
import { ActionResult } from 'src/common/dtos/action.result';
import { VerifyEmailInput } from './dtos/verify-email.input';
import { ResendEmailVerificationInput } from './dtos/resend-email-verification.input';
import { randomInt } from 'crypto';
import { LocalProvider } from 'src/local-providers/entities/local-provider.entity';
import { DataSource } from 'typeorm';
import { RefreshTokenInput } from './dtos/refresh-token.input';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
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

  async signUp(signUpInput: SignUpInput): Promise<ActionResult> {
    return await this.dataSource.transaction(async (manager) => {
      if (
        await manager.findOne(User, { where: { email: signUpInput.email } })
      ) {
        throw new ForbiddenException('Email already exists');
      }

      const user = manager.create(User, {
        name: signUpInput.name,
        email: signUpInput.email,
        emailVerified: false,
      });

      await manager.save(user);

      const localProvider = manager.create(LocalProvider, {
        user,
        password: hashSync(signUpInput.password, 10),
      });

      await manager.save(localProvider);

      return {
        success: true,
        message: 'User created successfully, please verify your email',
      };
    });
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

  async verifyEmail(verifyEmailInput: VerifyEmailInput): Promise<ActionResult> {
    const { email, code } = verifyEmailInput;
    const key = `${email}::verify-email`;

    const [user, storedCode] = await Promise.all([
      this.userService.findOneByEmail(email),
      this.cacheManager.get<string>(key),
    ]);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (!storedCode || code !== storedCode) {
      throw new BadRequestException('Invalid or expired code');
    }

    await this.userService.updateEmailVerified(user.id, true);

    await this.cacheManager.del(key);

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  async resendEmailVerification(
    resendEmailVerificationInput: ResendEmailVerificationInput,
  ): Promise<ActionResult> {
    const { email } = resendEmailVerificationInput;
    const key = `${email}::verify-email`;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const code = randomInt(100000, 999999).toString();
    await this.cacheManager.set(key, code, 5 * 60 * 1000);

    await this.mailService.userSignUp({
      to: user.email,
      data: { hash: code },
    });

    return {
      success: true,
      message: 'Verification email sent',
    };
  }

  async refreshToken(
    refreshTokenInput: RefreshTokenInput,
  ): Promise<TokensResult> {
    const { refreshToken } = refreshTokenInput;
    const payload = this.jwtService.verify<JwtPayload>(refreshToken);
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
      }),
      refreshToken,
    };
  }
}
