import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResetPasswordResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
