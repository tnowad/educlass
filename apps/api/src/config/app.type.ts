import { MailConfig } from 'src/mail/config/mail-config.type';
import { AppConfig } from './app-config.type';
import { MinioConfig } from 'src/files/config/minio-config.type';
import { DatabaseConfig } from 'src/common/config/database-config.type';

export type AllConfigType = {
  app: AppConfig;
  mail: MailConfig;
  minio: MinioConfig;
  database: DatabaseConfig;
};
