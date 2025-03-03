import { Field, InputType } from '@nestjs/graphql';
import { IsString, Matches } from 'class-validator';

@InputType()
export class VerifyEmailInput {
  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
  code: string;
}
