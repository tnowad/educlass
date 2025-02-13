import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { UpdateAssignmentInput } from './dto/update-assignment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { DataSource, Repository } from 'typeorm';
import { CoursesService } from 'src/courses/courses.service';
import { FilesService } from 'src/files/files.service';
import { pick } from 'lodash';

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

    let uploadedFileIds: string[] = [];

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
        uploadedFileIds = attachements.map((attachement) => attachement.id);
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

      if (uploadedFileIds.length > 0) {
        this.logger.error(
          `Rolling back uploaded files: ${JSON.stringify(uploadedFileIds)}`,
        );
        await this.filesService.deleteFiles(uploadedFileIds);
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

  async update(id: string, updateAssignmentInput: UpdateAssignmentInput) {
    const { attachements, removeAttachements, ...rest } = updateAssignmentInput;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let uploadedFileIds: string[] = [];

    try {
      const assignment = await queryRunner.manager.findOne(
        this.assignmentsRepository.target,
        {
          where: { id },
          relations: ['attachements'],
        },
      );

      if (!assignment) {
        throw new NotFoundException(`Assignment with ID ${id} not found`);
      }

      const allowedFields: (keyof Assignment)[] = [
        'title',
        'description',
        'startDate',
        'dueDate',
      ];

      const updatedAssignment = this.assignmentsRepository.merge(
        assignment,
        pick(rest, allowedFields),
      );

      if (removeAttachements?.length) {
        updatedAssignment.attachements = updatedAssignment.attachements.filter(
          (attachement) => !removeAttachements.includes(attachement.id),
        );
      }

      if (attachements?.length) {
        const newAttachements =
          await this.filesService.uploadFiles(attachements);
        uploadedFileIds = newAttachements.map((attachement) => attachement.id);
        updatedAssignment.attachements = [
          ...updatedAssignment.attachements,
          ...newAttachements,
        ];
      }

      await queryRunner.manager.save(updatedAssignment);
      await queryRunner.commitTransaction();

      if (removeAttachements?.length) {
        await this.filesService.deleteFiles(removeAttachements);
      }

      return updatedAssignment;
    } catch (error) {
      this.logger.error(`Error updating assignment: ${error.message}`);
      await queryRunner.rollbackTransaction();

      if (uploadedFileIds.length) {
        await this.filesService.deleteFiles(uploadedFileIds);
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: string) {
    return this.assignmentsRepository.delete(id);
  }
}
