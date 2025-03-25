import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { pick } from 'lodash';

import { Assignment } from './entities/assignment.entity';
import { CoursesService } from 'src/courses/courses.service';
import { FilesService } from 'src/files/files.service';

import { CreateAssignmentInput } from './dto/create-assignment.input';
import { UpdateAssignmentInput } from './dto/update-assignment.input';

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Assignment)
    private readonly assignmentsRepository: Repository<Assignment>,
    private readonly coursesService: CoursesService,
    private readonly filesService: FilesService,
  ) {}

  async create(input: CreateAssignmentInput) {
    this.logger.log(`Starting assignment creation: ${JSON.stringify(input)}`);

    const { courseId, attachements } = input;
    const course = await this.coursesService.findOne(courseId);
    if (!course) {
      this.logger.warn(`Course with ID ${courseId} not found`);
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.debug('Database transaction started for assignment creation');

    try {
      const assignment = queryRunner.manager.create(Assignment, {
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        dueDate: input.dueDate,
        course,
      });

      if (attachements?.length) {
        this.logger.debug(`Uploading ${attachements.length} attachments`);
        const { result } = await this.filesService.uploadFiles(attachements);
        assignment.attachements = result;
      }

      const savedAssignment = await queryRunner.manager.save(
        Assignment,
        assignment,
      );
      await queryRunner.commitTransaction();
      this.logger.log(
        `Assignment created successfully with ID: ${savedAssignment.id}`,
      );

      return savedAssignment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error creating assignment: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create assignment');
    } finally {
      await queryRunner.release();
      this.logger.debug('Database connection released');
    }
  }

  async update(id: string, input: UpdateAssignmentInput) {
    this.logger.log(`Starting assignment update: ${id}`);

    const { attachements, removeAttachements, ...rest } = input;
    const allowedFields: (keyof Assignment)[] = [
      'title',
      'description',
      'startDate',
      'dueDate',
    ];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.debug('Database transaction started for assignment update');

    try {
      const assignment = await queryRunner.manager.findOne(Assignment, {
        where: { id },
        relations: ['attachements'],
      });

      if (!assignment) {
        this.logger.warn(`Assignment with ID ${id} not found`);
        throw new NotFoundException(`Assignment with ID ${id} not found`);
      }

      Object.assign(assignment, pick(rest, allowedFields));

      if (removeAttachements?.length) {
        this.logger.debug(`Removing ${removeAttachements.length} attachments`);
        assignment.attachements = assignment.attachements.filter(
          (file) => !removeAttachements.includes(file.id),
        );
      }

      if (attachements?.length) {
        this.logger.debug(`Uploading ${attachements.length} new attachments`);
        const uploadedFiles = await this.filesService.uploadFiles(attachements);
        assignment.attachements = [
          ...assignment.attachements,
          ...uploadedFiles.result,
        ];
      }

      await queryRunner.manager.save(Assignment, assignment);
      await queryRunner.commitTransaction();
      this.logger.log(`Assignment updated successfully: ${id}`);

      if (removeAttachements?.length) {
        this.logger.debug(`Deleting removed attachments from storage`);
        await this.filesService.deleteFiles(removeAttachements);
      }

      return assignment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error updating assignment ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update assignment');
    } finally {
      await queryRunner.release();
      this.logger.debug('Database connection released');
    }
  }

  async remove(id: string) {
    this.logger.log(`Starting assignment deletion: ${id}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.debug('Database transaction started for assignment deletion');

    try {
      const assignment = await queryRunner.manager.findOne(Assignment, {
        where: { id },
        relations: ['attachements'],
      });

      if (!assignment) {
        this.logger.warn(`Assignment with ID ${id} not found`);
        throw new NotFoundException(`Assignment with ID ${id} not found`);
      }

      if (assignment.attachements?.length) {
        this.logger.debug(
          `Deleting ${assignment.attachements.length} attachments`,
        );
        await this.filesService.deleteFiles(
          assignment.attachements.map((file) => file.id),
        );
      }

      await queryRunner.manager.delete(Assignment, id);
      await queryRunner.commitTransaction();
      this.logger.log(`Assignment deleted successfully: ${id}`);

      return { message: 'Assignment deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error deleting assignment ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete assignment');
    } finally {
      await queryRunner.release();
      this.logger.debug('Database connection released');
    }
  }

  async findAll() {
    this.logger.log('Fetching all assignments');
    return this.assignmentsRepository.find({
      relations: ['course', 'attachements'],
    });
  }

  async findOne(id: string) {
    this.logger.log(`Fetching assignment with ID: ${id}`);
    return this.assignmentsRepository.findOne({
      where: { id },
      relations: ['attachements'],
    });
  }
}
