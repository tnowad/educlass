import { Module } from '@nestjs/common';
import { LocalProvidersService } from './local-providers.service';
import { LocalProvidersResolver } from './local-providers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalProvider } from './entities/local-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocalProvider])],
  providers: [LocalProvidersResolver, LocalProvidersService],
})
export class LocalProvidersModule {}
