import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { LocalProvidersModule } from 'src/local-providers/local-providers.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [UsersModule, LocalProvidersModule, MailModule],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
