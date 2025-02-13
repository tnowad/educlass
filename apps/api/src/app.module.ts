import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalProvidersModule } from './local-providers/local-providers.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from './mailer/mailer.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CoursesModule } from './courses/courses.module';
import { NestMinioModule } from 'nestjs-minio';
import { FilesModule } from './files/files.module';
import { AssignmentsModule } from './assignments/assignments.module';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail-config';
import minioConfig from './files/config/minio-config';
import { AllConfigType } from './config/app.type';
import databaseConfig from './common/config/database-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mailConfig, minioConfig, databaseConfig],
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
      max: 10,
    }),
    NestMinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        isGlobal: true,
        endPoint: configService.get('minio').endPoint,
        port: configService.get('minio').port,
        useSSL: configService.get('minio').secure,
        accessKey: configService.get('minio').accessKey,
        secretKey: configService.get('minio').secretKey,
      }),
    }),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        type: 'postgres',
        host: configService.get('database').host,
        port: configService.get('database').port,
        username: configService.get('database').username,
        password: configService.get('database').password,
        database: configService.get('database').database,
        synchronize: configService.get('database').synchronize,
        logging: configService.get('database').logging,
        entities: ['dist/**/*.entity{.ts,.js}'],
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    UsersModule,
    AuthModule,
    LocalProvidersModule,
    MailerModule,
    MailModule,
    CoursesModule,
    FilesModule,
    AssignmentsModule,
  ],
})
export class AppModule {}
