import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectMinio } from 'nestjs-minio';
import { Client } from 'minio';
import { FileUpload } from 'graphql-upload-ts';
import { File } from './entities/file.entity';
import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @InjectMinio() private readonly minioClient: Client,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async uploadFile(file: Promise<FileUpload>): Promise<File> {
    this.logger.log('Starting single file upload');

    const { createReadStream, filename, mimetype } = await file;
    const objectName = `${uuidv4()}-${filename.replace(/\s+/g, '_')}`;
    this.logger.debug(`Generated object name: ${objectName}`);

    const stream = createReadStream();
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.debug('Database transaction started');

    try {
      await this.minioClient.putObject(
        'educlass',
        objectName,
        stream,
        undefined,
        { 'Content-Type': mimetype },
      );
      this.logger.log(`Uploaded file to MinIO: ${objectName}`);

      const fileUrl = await this.getFileUrl(objectName);
      const newFile = queryRunner.manager.create(File, {
        objectName,
        filename,
        mimetype,
        url: fileUrl,
      });

      await queryRunner.manager.save(File, newFile);
      await queryRunner.commitTransaction();
      this.logger.log(`File successfully saved in DB: ${objectName}`);

      return newFile;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Upload failed: ${error.message}`, error.stack);

      try {
        await this.minioClient.removeObject('educlass', objectName);
        this.logger.warn(`Rolled back file upload: ${objectName}`);
      } catch (cleanupError) {
        this.logger.error(
          `Failed to clean up MinIO file: ${cleanupError.message}`,
        );
      }

      throw new InternalServerErrorException('File upload failed');
    } finally {
      await queryRunner.release();
      this.logger.debug('Database connection released');
    }
  }

  async uploadFiles(files: Promise<FileUpload>[]): Promise<{
    result: File[];
    failed: string[];
  }> {
    this.logger.log(`Starting batch file upload: ${files.length} files`);

    const results = await Promise.allSettled(
      files.map(async (file) => {
        const resolvedFile = await file;
        const { createReadStream, filename, mimetype } = resolvedFile;
        const objectName = `${uuidv4()}-${filename.replace(/\s+/g, '_')}`;
        this.logger.debug(`Generated object name: ${objectName}`);

        const stream = createReadStream();
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        this.logger.debug('Database transaction started');

        try {
          await this.minioClient.putObject(
            'educlass',
            objectName,
            stream,
            undefined,
            { 'Content-Type': mimetype },
          );
          this.logger.log(`Uploaded file to MinIO: ${objectName}`);

          const fileUrl = await this.getFileUrl(objectName);
          const newFile = await queryRunner.manager.save(File, {
            filename,
            mimetype,
            objectName,
            url: fileUrl,
          });

          await queryRunner.commitTransaction();
          this.logger.log(`File successfully saved in DB: ${objectName}`);
          return { status: 'success', file: newFile };
        } catch (error) {
          await queryRunner.rollbackTransaction();
          stream.destroy();
          this.logger.error(`File upload failed: ${filename}`, error.stack);

          try {
            await this.minioClient.removeObject('educlass', objectName);
            this.logger.warn(`Rolled back file upload: ${objectName}`);
          } catch (cleanupError) {
            this.logger.error(
              `Failed to clean up orphaned file: ${objectName}`,
              cleanupError,
            );
          }

          return { status: 'failed', filename };
        } finally {
          await queryRunner.release();
        }
      }),
    );

    const success = results
      .filter((r) => r.status === 'fulfilled' && r.value.status === 'success')
      .map(
        (r) =>
          (r as PromiseFulfilledResult<{ status: 'success'; file: File }>).value
            .file,
      );

    const failed = results
      .filter((r) => r.status === 'fulfilled' && r.value.status === 'failed')
      .map(
        (r) =>
          (r as PromiseFulfilledResult<{ status: 'failed'; filename: string }>)
            .value.filename,
      );

    this.logger.log(
      `Batch upload completed: ${success.length} success, ${failed.length} failed`,
    );

    return { result: success, failed };
  }

  async getFileUrl(objectName: string): Promise<string> {
    this.logger.debug(`Fetching file URL: ${objectName}`);

    const cacheKey = `file-url:${objectName}`;
    const cachedUrl = await this.cacheManager.get<string>(cacheKey);

    if (cachedUrl) {
      this.logger.debug(`Cache hit for ${objectName}`);
      return cachedUrl;
    }

    try {
      const url = await this.minioClient.presignedGetObject(
        'educlass',
        objectName,
      );
      await this.cacheManager.set(cacheKey, url, 10 * 60 * 1000);
      this.logger.debug(`Generated and cached URL for ${objectName}`);
      return url;
    } catch (error) {
      this.logger.error(
        `Failed to generate URL for ${objectName}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to generate file URL');
    }
  }

  async deleteFiles(uploadedFileIds: string[]) {
    this.logger.log(`Starting file deletion: ${uploadedFileIds.length} files`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.debug('Database transaction started');

    try {
      const files = await queryRunner.manager.findBy(
        File,
        uploadedFileIds.map((id) => ({ id })),
      );

      for (const file of files) {
        try {
          await this.minioClient.removeObject('educlass', file.objectName);
          await this.cacheManager.del(`file-url:${file.objectName}`);
          this.logger.log(`Deleted file from MinIO: ${file.objectName}`);
        } catch (error) {
          this.logger.error(
            `Failed to delete file ${file.objectName}`,
            error.stack,
          );
          throw new Error(
            `Failed to delete file ${file.objectName}: ${error.message}`,
          );
        }
      }

      await queryRunner.manager.delete(File, uploadedFileIds);
      await queryRunner.commitTransaction();
      this.logger.log(`Deleted files from DB: ${uploadedFileIds.length} files`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to delete files', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
      this.logger.debug('Database connection released');
    }
  }
}
