import { CreateLocalProviderInput } from './create-local-provider.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLocalProviderInput extends PartialType(
  CreateLocalProviderInput,
) {
  @Field()
  id: string;
}
