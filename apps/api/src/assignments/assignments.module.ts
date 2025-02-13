import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsResolver } from './assignments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { CoursesModule } from 'src/courses/courses.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment]), CoursesModule, FilesModule],
  providers: [AssignmentsResolver, AssignmentsService],
})
export class AssignmentsModule {}
