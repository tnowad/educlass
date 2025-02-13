import { registerAs } from '@nestjs/config';

import { IsString, IsInt, Min, Max, IsBoolean, IsUrl } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { MinioConfig } from './minio-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsUrl({ require_tld: false })
  MINIO_ENDPOINT: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  MINIO_PORT: number;

  @IsBoolean()
  MINIO_SECURE: boolean;

  @IsString()
  MINIO_ACCESS_KEY: string;

  @IsString()
  MINIO_SECRET_KEY: string;
}

export default registerAs<MinioConfig>('minio', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    endPoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT, 10) : 9000,
    secure: process.env.MINIO_SECURE === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  };
});
