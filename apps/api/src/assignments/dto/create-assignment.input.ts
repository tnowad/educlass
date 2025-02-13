import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class CreateAssignmentInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsDate()
  startDate: Date;

  @Field()
  @IsDate()
  dueDate: Date;

  @Field()
  @IsString()
  courseId: string;

  @IsOptional()
  @Field(() => [GraphQLUpload], { nullable: true })
  attachements: Promise<FileUpload>[];
}
