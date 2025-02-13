import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { CreateAssignmentInput } from './create-assignment.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAssignmentInput extends PartialType(CreateAssignmentInput) {
  @Field()
  id: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  removeAttachements: string[];
}
