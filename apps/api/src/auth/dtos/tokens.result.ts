import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokensResult {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
