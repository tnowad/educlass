import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { CourseParticipant } from 'src/course-participants/entities/course-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseParticipant])],
  providers: [CoursesResolver, CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
