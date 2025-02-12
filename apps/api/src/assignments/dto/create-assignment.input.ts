import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';

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
}
