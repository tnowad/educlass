import { Injectable } from '@nestjs/common';
import { CreateCourseParticipantInput } from './dto/create-course-participant.input';
import { UpdateCourseParticipantInput } from './dto/update-course-participant.input';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseParticipant } from './entities/course-participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseParticipantsService {
  constructor(
    @InjectRepository(CourseParticipant)
    private courseParticipantsRepository: Repository<CourseParticipant>,
  ) {}
  create(createCourseParticipantInput: CreateCourseParticipantInput) {
    return this.courseParticipantsRepository.save(createCourseParticipantInput);
  }

  findAll() {
    return this.courseParticipantsRepository.find();
  }

  findOne(id: string) {
    return this.courseParticipantsRepository.findOne({ where: { id } });
  }

  update(
    id: string,
    updateCourseParticipantInput: UpdateCourseParticipantInput,
  ) {
    return this.courseParticipantsRepository.update(
      id,
      updateCourseParticipantInput,
    );
  }

  remove(id: string) {
    return this.courseParticipantsRepository.delete({ id });
  }
}
