import { Module } from '@nestjs/common';
import { UserFactory } from './user.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LocalProvider } from 'src/local-providers/entities/local-provider.entity';
import { UserSeedService } from './user-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalProvider])],
  providers: [UserFactory, UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
