import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ResendEmailVerificationInput {
  @Field()
  @IsEmail()
  email: string;
}
