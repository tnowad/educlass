import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCourseParticipantInput {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsString()
  courseId: string;
}
