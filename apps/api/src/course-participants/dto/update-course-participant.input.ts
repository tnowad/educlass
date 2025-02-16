import { Field, InputType } from '@nestjs/graphql';
import { CreateCourseParticipantInput } from './create-course-participant.input';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseRole } from './role.enum';

@InputType()
export class UpdateCourseParticipantInput extends PartialType(
  CreateCourseParticipantInput,
) {
  @Field()
  @IsString()
  id: string;

  @Field(() => CourseRole, { nullable: true })
  @IsOptional()
  @IsEnum(CourseRole)
  role?: CourseRole;
}
