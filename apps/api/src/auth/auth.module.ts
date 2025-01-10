import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { LocalProvidersModule } from 'src/local-providers/local-providers.module';

@Module({
  imports: [UsersModule, LocalProvidersModule],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
