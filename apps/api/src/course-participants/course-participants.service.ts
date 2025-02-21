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

  async findOwnerByCourseIdAndUserId(
    courseId: string,
    userId: string,
  ): Promise<CourseParticipant | null> {
    const owner = await this.courseParticipantsRepository.findOne({
      where: {
        courseId,
        userId,
        role: CourseRole.OWNER,
      },
    });

    return owner;
  }

  async getUserRoleInCourse(
    userId: string,
    courseId: string,
  ): Promise<CourseRole | null> {
    const participant = await this.courseParticipantsRepository.findOne({
      where: { userId, courseId },
    });
    console.log('participant', participant);
    return participant ? participant.role : null;
  }

  async update(
    id: string,
    updateCourseParticipantInput: UpdateCourseParticipantInput,
    userId: string,
  ): Promise<CourseParticipant> {
    const courseParticipant = await this.findOne(id);
    console.log(courseParticipant);

    if (!courseParticipant) {
      throw new NotFoundException(`CourseParticipant with ID ${id} not found`);
    }

    const userRole = await this.getUserRoleInCourse(
      userId,
      courseParticipant.courseId,
    );
    console.log(userId);

    if (!userRole) {
      throw new ForbiddenException('You are not part of this course');
    }

    if (userRole === CourseRole.PARTICIPANT) {
      throw new ForbiddenException('Participants cannot update roles');
    }

    if (userRole === CourseRole.CO_OWNER) {
      if (courseParticipant.role !== CourseRole.PARTICIPANT) {
        throw new ForbiddenException('Co-Owners can only update Participants');
      }
    }

    Object.assign(courseParticipant, updateCourseParticipantInput);
    return this.courseParticipantsRepository.save(courseParticipant);
  }
  async remove(id: string, userId: string): Promise<boolean> {
    const courseParticipant = await this.findOne(id);

    if (!courseParticipant) {
      throw new NotFoundException(`CourseParticipant with ID ${id} not found`);
    }

    const userRole = await this.getUserRoleInCourse(
      userId,
      courseParticipant.courseId,
    );

    if (!userRole) {
      throw new ForbiddenException('You are not part of this course');
    }

    if (courseParticipant.role === CourseRole.OWNER) {
      throw new ForbiddenException('Cannot remove the course owner');
    }

    if (
      userRole === CourseRole.PARTICIPANT &&
      userId !== courseParticipant.userId
    ) {
      throw new ForbiddenException('You can only remove yourself');
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
