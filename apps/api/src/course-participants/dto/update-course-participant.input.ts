import { Field, InputType } from '@nestjs/graphql';
import { CreateCourseParticipantInput } from './create-course-participant.input';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from '../entities/course-participant.entity';

@InputType()
export class UpdateCourseParticipantInput extends PartialType(
  CreateCourseParticipantInput,
) {
  @Field()
  @IsString()
  id: string;

  @Field(() => RoleEnum, { nullable: true })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}
