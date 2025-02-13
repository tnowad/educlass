import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { RoleEnum } from '../entities/course-participant.entity';

@InputType()
export class CreateCourseParticipantInput {
  @Field()
  @IsString()
  courseId: string;

  @Field(() => RoleEnum, { defaultValue: RoleEnum.PARTICIPANT })
  @IsEnum(RoleEnum)
  role?: RoleEnum = RoleEnum.PARTICIPANT;
}
