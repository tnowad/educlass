import { Module } from '@nestjs/common';
import { CourseParticipantsService } from './course-participants.service';
import { CourseParticipantsResolver } from './course-participants.resolver';

@Module({
  providers: [CourseParticipantsResolver, CourseParticipantsService],
})
export class CourseParticipantsModule {}
