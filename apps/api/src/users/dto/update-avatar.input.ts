import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UpdateAvatarInput {
  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  avatar: Promise<FileUpload>;
}
