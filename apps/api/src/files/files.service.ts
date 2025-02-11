import { Injectable } from '@nestjs/common';
import { InjectMinio } from 'nestjs-minio';
import { Client } from 'minio';
import { FileUpload } from 'graphql-upload-ts';
import { File } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectMinio() private readonly minioClient: Client,
    @InjectRepository(File) private readonly filesRepository: Repository<File>,
  ) {}

  async uploadFile(file: Promise<FileUpload>): Promise<File> {
    const { createReadStream, filename, mimetype } = await file;
    const stream = createReadStream();
    const objectName = `${Date.now()}-${filename}`;
    await this.minioClient.putObject(
      'educlass',
      objectName,
      stream,
      undefined,
      {
        'Content-Type': mimetype,
      },
    );
    const newFile = await this.filesRepository.save({
      filename,
      mimetype,
      objectName,
      url: await this.getFileUrl(objectName),
    });

    return newFile;
  }

  async getFileUrl(objectName: string): Promise<string> {
    return this.minioClient.presignedGetObject(
      'educlass',
      objectName,
      24 * 60 * 60,
    );
  }
}
