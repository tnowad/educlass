import { Module } from '@nestjs/common';
import { CourseParticipantsService } from './course-participants.service';
import { CourseParticipantsResolver } from './course-participants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseParticipant } from './entities/course-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseParticipant])],
  providers: [CourseParticipantsResolver, CourseParticipantsService],
  exports: [CourseParticipantsService],
})
export class CourseParticipantsModule {}
