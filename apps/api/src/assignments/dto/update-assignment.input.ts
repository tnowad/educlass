import { CreateAssignmentInput } from './create-assignment.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAssignmentInput extends PartialType(CreateAssignmentInput) {
  @Field()
  id: string;
}
