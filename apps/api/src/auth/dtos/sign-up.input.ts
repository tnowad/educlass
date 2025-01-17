import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  password: string;
}
