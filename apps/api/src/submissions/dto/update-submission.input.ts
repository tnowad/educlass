import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { CreateSubmissionInput } from './create-submission.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubmissionInput extends PartialType(CreateSubmissionInput) {
  @Field()
  id: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  removeAttachements: string[];
}
