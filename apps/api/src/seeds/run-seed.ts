import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';
import { UserSeedService } from './user-seed/user-seed.service';

async function runSeed() {
  const app = await NestFactory.create(SeedsModule);

  await app.get(UserSeedService).run();

  await app.close();
}

runSeed();
