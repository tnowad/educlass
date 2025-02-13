import { MailConfig } from 'src/mail/config/mail-config.type';
import { AppConfig } from './app-config.type';
import { MinioConfig } from 'src/files/config/minio-config.type';

export type AllConfigType = {
  app: AppConfig;
  mail: MailConfig;
  minio: MinioConfig;
};
