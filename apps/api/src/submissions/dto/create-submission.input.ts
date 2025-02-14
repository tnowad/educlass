import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class CreateSubmissionInput {
  @Field()
  @IsString()
  content: string;

  @Field()
  @IsString()
  assignmentId: string;

  @Field()
  @IsNumber()
  @IsOptional()
  score?: number;

  @IsOptional()
  @Field(() => [GraphQLUpload], { nullable: true })
  attachements: Promise<FileUpload>[];
}
