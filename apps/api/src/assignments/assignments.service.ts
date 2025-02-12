import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { UpdateAssignmentInput } from './dto/update-assignment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { DataSource, Repository } from 'typeorm';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Assignment)
    private readonly assignmentsRepository: Repository<Assignment>,
    private readonly coursesService: CoursesService,
  ) {}
  async create(createAssignmentInput: CreateAssignmentInput) {
    return this.dataSource.transaction(async (manager) => {
      const { courseId } = createAssignmentInput;
      const course = await this.coursesService.findOne(courseId);
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      // TODO: Check current user has permission to create assignment

      const assignment = manager.create(Assignment, createAssignmentInput);
      assignment.course = course;

      return manager.save(Assignment, assignment);
    });
  }

  findAll() {
    return this.assignmentsRepository.find();
  }

  findOne(id: string) {
    return this.assignmentsRepository.findOne({ where: { id } });
  }

  update(id: string, updateAssignmentInput: UpdateAssignmentInput) {
    return this.assignmentsRepository.update(id, updateAssignmentInput);
  }

  remove(id: string) {
    return this.assignmentsRepository.delete(id);
  }
}
