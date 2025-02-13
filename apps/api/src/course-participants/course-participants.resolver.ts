import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseParticipantsService } from './course-participants.service';
import { CourseParticipant } from './entities/course-participant.entity';
import { CreateCourseParticipantInput } from './dto/create-course-participant.input';
import { UpdateCourseParticipantInput } from './dto/update-course-participant.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => CourseParticipant)
export class CourseParticipantsResolver {
  constructor(
    private readonly courseParticipantsService: CourseParticipantsService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CourseParticipant)
  async createCourseParticipant(
    @Args('createCourseParticipantInput')
    createCourseParticipantInput: CreateCourseParticipantInput,
    @CurrentUser() user: User,
  ): Promise<CourseParticipant> {
    return this.courseParticipantsService.create({
      ...createCourseParticipantInput,
      userId: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [CourseParticipant])
  async courseParticipants(): Promise<CourseParticipant[]> {
    return this.courseParticipantsService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CourseParticipant, { nullable: true })
  async courseParticipant(@Args('id') id: string): Promise<CourseParticipant> {
    return this.courseParticipantsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CourseParticipant)
  async updateCourseParticipant(
    @Args('updateCourseParticipantInput')
    updateCourseParticipantInput: UpdateCourseParticipantInput,
  ): Promise<CourseParticipant> {
    return this.courseParticipantsService.update(
      updateCourseParticipantInput.id,
      updateCourseParticipantInput,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeCourseParticipant(@Args('id') id: string): Promise<boolean> {
    return this.courseParticipantsService.remove(id);
  }
}
