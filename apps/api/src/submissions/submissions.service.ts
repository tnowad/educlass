import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { DataSource, Repository } from 'typeorm';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { FilesService } from 'src/files/files.service';
import { pick } from 'lodash';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
    private readonly assignmentsService: AssignmentsService,
    private readonly filesService: FilesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createSubmissionInput: CreateSubmissionInput) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let uploadedFileIds: string[] = [];

    try {
      const { assignmentId, attachements, score, ...rest } =
        createSubmissionInput;

      const assignment = await this.assignmentsService.findOne(assignmentId);
      if (!assignment) {
        throw new NotFoundException(`Assignment not found`);
      }

      // TODO: Check if current user is teacher of the course

      const allowedFields: (keyof Submission)[] = ['content'];
      const submissionData = {
        ...pick(rest, allowedFields),
        score: 0,
        .../*isTeacher*/ (true ? { score } : {}),
        assignment,
      };

      const submission = queryRunner.manager.create(Submission, submissionData);

      if (attachements) {
        const files = await this.filesService.uploadFiles(attachements);
        uploadedFileIds = files.map((file) => file.id);
        submission.attachements = files;
      }

      const savedSubmission = await queryRunner.manager.save(submission);
      await queryRunner.commitTransaction();
      return savedSubmission;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (uploadedFileIds.length > 0) {
        await this.filesService.deleteFiles(uploadedFileIds);
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.submissionsRepository.find({
      relations: ['attachements', 'assignments'],
    });
  }

  findOne(id: string) {
    return this.submissionsRepository.findOne({
      where: { id },
      relations: ['attachements', 'assignments'],
    });
  }

  async update(id: string, updateSubmissionInput: UpdateSubmissionInput) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let uploadedFileIds: string[] = [];

    try {
      const { attachements, removeAttachements, ...rest } =
        updateSubmissionInput;
      const submission = await queryRunner.manager.findOne(Submission, {
        where: { id },
        relations: ['attachements'],
      });
      if (!submission) {
        throw new NotFoundException(`Submission with ID ${id} not found`);
      }

      const allowedFields: (keyof Submission)[] = ['content', 'score'];
      const updatedSubmission = this.submissionsRepository.merge(
        submission,
        pick(rest, allowedFields),
      );

      if (removeAttachements?.length) {
        updatedSubmission.attachements = updatedSubmission.attachements.filter(
          (file) => !removeAttachements.includes(file.id),
        );
      }

      if (attachements?.length) {
        const newFiles = await this.filesService.uploadFiles(attachements);
        uploadedFileIds = newFiles.map((file) => file.id);
        updatedSubmission.attachements = [
          ...updatedSubmission.attachements,
          ...newFiles,
        ];
      }

      const savedSubmission = await queryRunner.manager.save(updatedSubmission);
      await queryRunner.commitTransaction();

      if (removeAttachements?.length) {
        await this.filesService.deleteFiles(removeAttachements);
      }

      return savedSubmission;
    } catch (error) {
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
    return this.submissionsRepository.delete(id);
  }
}
