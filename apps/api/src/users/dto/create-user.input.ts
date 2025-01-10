import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsBoolean, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;
}
