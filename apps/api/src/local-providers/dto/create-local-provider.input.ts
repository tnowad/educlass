import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateLocalProviderInput {
  @Field()
  @IsString()
  password: string;
}
