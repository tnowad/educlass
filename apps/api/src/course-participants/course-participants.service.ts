import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseParticipant } from './entities/course-participant.entity';
import { CreateCourseParticipantInput } from './dto/create-course-participant.input';
import { UpdateCourseParticipantInput } from './dto/update-course-participant.input';

@Injectable()
export class CourseParticipantsService {
  constructor(
    @InjectRepository(CourseParticipant)
    private readonly courseParticipantsRepository: Repository<CourseParticipant>,
  ) {}

  async create(
    createCourseParticipantInput: CreateCourseParticipantInput & {
      userId: string;
    },
  ): Promise<CourseParticipant> {
    const { userId, courseId } = createCourseParticipantInput;

    const existingParticipant = await this.courseParticipantsRepository.findOne(
      {
        where: { userId, courseId },
      },
    );

    if (existingParticipant) {
      throw new ConflictException('User is already enrolled in this course');
    }

    const courseParticipant = this.courseParticipantsRepository.create({
      ...createCourseParticipantInput,
      userId,
    });

    return this.courseParticipantsRepository.save(courseParticipant);
  }

  async findAll(): Promise<CourseParticipant[]> {
    return this.courseParticipantsRepository.find();
  }

  async findOne(id: string): Promise<CourseParticipant> {
    const courseParticipant = await this.courseParticipantsRepository.findOne({
      where: { id },
    });
    if (!courseParticipant) {
      throw new NotFoundException(`CourseParticipant with ID ${id} not found`);
    }
    return courseParticipant;
  }

  async update(
    id: string,
    updateCourseParticipantInput: UpdateCourseParticipantInput,
  ): Promise<CourseParticipant> {
    const courseParticipant = await this.findOne(id);
    Object.assign(courseParticipant, updateCourseParticipantInput);
    return this.courseParticipantsRepository.save(courseParticipant);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.courseParticipantsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CourseParticipant with ID ${id} not found`);
    }
    return true;
  }
}
