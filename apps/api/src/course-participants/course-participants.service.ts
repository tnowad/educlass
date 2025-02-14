import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseParticipant } from './entities/course-participant.entity';
import { CreateCourseParticipantInput } from './dto/create-course-participant.input';
import { UpdateCourseParticipantInput } from './dto/update-course-participant.input';
import { CourseRole } from './dto/role.enum';

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

  async findByUserAndCourse(
    userId: string,
    courseId: string,
  ): Promise<CourseParticipant> {
    return this.courseParticipantsRepository.findOne({
      where: { userId, courseId },
    });
  }

  async update(
    id: string,
    updateCourseParticipantInput: UpdateCourseParticipantInput,
    userId: string,
    userRole: CourseRole,
  ): Promise<CourseParticipant> {
    const courseParticipant = await this.courseParticipantsRepository.findOne({
      where: { id },
    });

    if (!courseParticipant) {
      throw new NotFoundException(`CourseParticipant with ID ${id} not found`);
    }

    if (userRole === CourseRole.PARTICIPANT || userRole === CourseRole.GUEST) {
      if (userId !== courseParticipant.userId) {
        throw new ForbiddenException('You can only update your own role');
      }
    }

    Object.assign(courseParticipant, updateCourseParticipantInput);
    return this.courseParticipantsRepository.save(courseParticipant);
  }

  async remove(
    id: string,
    userId: string,
    userRole: CourseRole,
  ): Promise<boolean> {
    const courseParticipant = await this.courseParticipantsRepository.findOne({
      where: { id },
    });

    if (!courseParticipant) {
      throw new NotFoundException(`CourseParticipant with ID ${id} not found`);
    }

    if (courseParticipant.role === CourseRole.OWNER) {
      throw new ForbiddenException(`Cannot remove the course owner`);
    }

    if (userRole === CourseRole.PARTICIPANT || userRole === CourseRole.GUEST) {
      if (userId !== courseParticipant.userId) {
        throw new ForbiddenException('You can only remove yourself');
      }
    }

    if (
      userRole === CourseRole.CO_OWNER &&
      (courseParticipant.role as CourseRole) === CourseRole.OWNER
    ) {
      throw new ForbiddenException('Co-Owner cannot remove the course owner');
    }

    const result = await this.courseParticipantsRepository.delete(id);
    return result.affected > 0;
  }
}
