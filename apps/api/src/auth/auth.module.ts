import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { LocalProvidersModule } from 'src/local-providers/local-providers.module';
import { MailModule } from 'src/mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    LocalProvidersModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
