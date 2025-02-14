import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubmissionsService } from './submissions.service';
import { Submission } from './entities/submission.entity';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Mutation(() => Submission)
  createSubmission(
    @Args('createSubmissionInput') createSubmissionInput: CreateSubmissionInput,
  ) {
    return this.submissionsService.create(createSubmissionInput);
  }

  @Query(() => [Submission], { name: 'submissions' })
  findAll() {
    return this.submissionsService.findAll();
  }

  @Query(() => Submission, { name: 'submission' })
  findOne(@Args('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Mutation(() => Submission)
  updateSubmission(
    @Args('updateSubmissionInput') updateSubmissionInput: UpdateSubmissionInput,
  ) {
    return this.submissionsService.update(
      updateSubmissionInput.id,
      updateSubmissionInput,
    );
  }

  @Mutation(() => Submission)
  removeSubmission(@Args('id') id: string) {
    return this.submissionsService.remove(id);
  }
}
