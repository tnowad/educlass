import { Injectable } from '@nestjs/common';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { UpdateAssignmentInput } from './dto/update-assignment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
  ) {}
  create(createAssignmentInput: CreateAssignmentInput) {
    return this.assignmentsRepository.save(createAssignmentInput);
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
