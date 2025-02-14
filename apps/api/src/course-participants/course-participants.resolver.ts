import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CourseParticipantsService } from './course-participants.service';
import { CourseParticipant } from './entities/course-participant.entity';
import { CreateCourseParticipantInput } from './dto/create-course-participant.input';
import { UpdateCourseParticipantInput } from './dto/update-course-participant.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CourseRolesGuard } from './course-roles.guard';
import { CourseRoles } from './decorators/role.decorator';
import { CourseRole } from './dto/role.enum';

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

  @UseGuards(GqlAuthGuard, CourseRolesGuard)
  @CourseRoles(
    CourseRole.OWNER,
    CourseRole.CO_OWNER,
    CourseRole.PARTICIPANT,
    CourseRole.GUEST,
  )
  @Mutation(() => CourseParticipant)
  async updateCourseParticipant(
    @Args('updateCourseParticipantInput')
    updateCourseParticipantInput: UpdateCourseParticipantInput,
    @Context() context: any,
    @CurrentUser() user: User,
  ): Promise<CourseParticipant> {
    return this.courseParticipantsService.update(
      updateCourseParticipantInput.id,
      updateCourseParticipantInput,
      user.id,
      context.req.courseRole,
    );
  }

  @UseGuards(GqlAuthGuard, CourseRolesGuard)
  @CourseRoles(
    CourseRole.OWNER,
    CourseRole.CO_OWNER,
    CourseRole.PARTICIPANT,
    CourseRole.GUEST,
  )
  @Mutation(() => Boolean)
  async removeCourseParticipant(
    @Args('id') id: string,
    @Context() context: any,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.courseParticipantsService.remove(
      id,
      user.id,
      context.req.courseRole,
    );
  }
}
