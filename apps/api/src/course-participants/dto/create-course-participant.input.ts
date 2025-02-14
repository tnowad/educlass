import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { CourseRole } from './role.enum';

@InputType()
export class CreateCourseParticipantInput {
  @Field()
  @IsString()
  courseId: string;

  @Field(() => CourseRole, { defaultValue: CourseRole.PARTICIPANT })
  @IsEnum(CourseRole)
  role?: CourseRole = CourseRole.PARTICIPANT;
}
