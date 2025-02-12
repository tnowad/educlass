import { Field, InputType } from '@nestjs/graphql';
import { CreateCourseParticipantInput } from './create-course-participant.input';
import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

@InputType()
export class UpdateCourseParticipantInput extends PartialType(
  CreateCourseParticipantInput,
) {
  @Field()
  @IsString()
  id: string;
}
