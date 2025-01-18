import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RequestResetPasswordResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
