import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';

async function runSeed() {
  const app = await NestFactory.create(SeedsModule);

  await app.close();
}

runSeed();
