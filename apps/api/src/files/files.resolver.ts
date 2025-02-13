import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { File } from './entities/file.entity';
import { UploadFileInput } from './dtos/upload-file.input';

@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => File)
  uploadFile(@Args('uploadFileInput') uploadFileInput: UploadFileInput) {
    return this.filesService.uploadFile(uploadFileInput.file);
  }
}
