import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { UpdateAssignmentInput } from './dto/update-assignment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { DataSource, Repository } from 'typeorm';
import { CoursesService } from 'src/courses/courses.service';
import { FilesService } from 'src/files/files.service';
import { File } from 'src/files/entities/file.entity';

@Injectable()
export class AssignmentsService {
  private readonly logger: Logger = new Logger(AssignmentsService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Assignment)
    private readonly assignmentsRepository: Repository<Assignment>,
    private readonly coursesService: CoursesService,
    private readonly filesService: FilesService,
  ) {}

  async create(createAssignmentInput: CreateAssignmentInput) {
    this.logger.debug(
      `Creating assignment with input: ${JSON.stringify(createAssignmentInput)}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let uploadedFiles: File[] = [];

    try {
      const { courseId } = createAssignmentInput;
      const course = await this.coursesService.findOne(courseId);
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      // TODO: Check current user has permission to create assignment

      const assignment = queryRunner.manager.create(Assignment, {
        title: createAssignmentInput.title,
        description: createAssignmentInput.description,
        startDate: createAssignmentInput.startDate,
        dueDate: createAssignmentInput.dueDate,
        course,
      });

      if (createAssignmentInput.attachements) {
        const attachements = await this.filesService.uploadFiles(
          createAssignmentInput.attachements,
        );
        uploadedFiles = attachements;
        assignment.attachements = attachements;
      }

      this.logger.debug(`Saving assignment: ${JSON.stringify(assignment)}`);
      const savedAssignment = await queryRunner.manager.save(
        Assignment,
        assignment,
      );

      await queryRunner.commitTransaction();
      return savedAssignment;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (uploadedFiles.length > 0) {
        this.logger.error(
          `Rolling back uploaded files: ${JSON.stringify(uploadedFiles)}`,
        );
        await this.filesService.deleteFiles(uploadedFiles);
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.assignmentsRepository.find({
      relations: ['course', 'attachements'],
    });
  }

  findOne(id: string) {
    return this.assignmentsRepository.findOne({ where: { id } });
  }

  update(id: string, updateAssignmentInput: UpdateAssignmentInput) {
    return this.assignmentsRepository.update(id, {
      title: updateAssignmentInput.title,
      description: updateAssignmentInput.description,
      startDate: updateAssignmentInput.startDate,
      dueDate: updateAssignmentInput.dueDate,
    });
  }

  remove(id: string) {
    return this.assignmentsRepository.delete(id);
  }
}
