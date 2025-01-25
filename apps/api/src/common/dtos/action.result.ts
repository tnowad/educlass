import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActionResult {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  message: string;
}
