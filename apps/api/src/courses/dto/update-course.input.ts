import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCourseInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  section?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  room?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  subject?: string;
}
