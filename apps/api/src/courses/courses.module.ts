import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CoursesResolver, CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
