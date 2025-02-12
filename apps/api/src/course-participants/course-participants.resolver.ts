import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseParticipantsService } from './course-participants.service';
import { CreateCourseParticipantInput } from './dto/create-course-participant.input';
import { UpdateCourseParticipantInput } from './dto/update-course-participant.input';

@Resolver('CourseParticipant')
export class CourseParticipantsResolver {
  constructor(
    private readonly courseParticipantsService: CourseParticipantsService,
  ) {}

  @Mutation('createCourseParticipant')
  create(
    @Args('createCourseParticipantInput')
    createCourseParticipantInput: CreateCourseParticipantInput,
  ) {
    return this.courseParticipantsService.create(createCourseParticipantInput);
  }

  @Query('courseParticipants')
  findAll() {
    return this.courseParticipantsService.findAll();
  }

  @Query('courseParticipant')
  findOne(@Args('id') id: string) {
    return this.courseParticipantsService.findOne(id);
  }

  @Mutation('updateCourseParticipant')
  update(
    @Args('updateCourseParticipantInput')
    updateCourseParticipantInput: UpdateCourseParticipantInput,
  ) {
    return this.courseParticipantsService.update(
      updateCourseParticipantInput.id,
      updateCourseParticipantInput,
    );
  }

  @Mutation('removeCourseParticipant')
  remove(@Args('id') id: string) {
    return this.courseParticipantsService.remove(id);
  }
}
