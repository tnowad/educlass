import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { File } from './entities/file.entity';
import { UploadFileInput } from './dtos/upload-file.input';

@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => File)
  async uploadFile(@Args('uploadFileInput') uploadFileInput: UploadFileInput) {
    const file = await uploadFileInput.file;
    if (!file) {
      throw new Error('File not provided');
    }
    return this.filesService.uploadFile(file);
  }
}
