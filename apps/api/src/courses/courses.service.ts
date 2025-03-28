import { Injectable } from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CourseParticipant } from 'src/course-participants/entities/course-participant.entity';
import { CourseRole } from 'src/course-participants/dto/role.enum';
import { CoursesConnection } from './dto/course.input';
import { ConnectionArgs, findAndPaginate } from 'nestjs-graphql-relay';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
    @InjectRepository(CourseParticipant)
    private readonly courseParticipantsRepository: Repository<CourseParticipant>,
  ) { }
  async create(createCourseInput: CreateCourseInput & { userId: string }) {
    const code = crypto
      .randomBytes(5)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 7);
    const inviteLink = `localhost:3000/classroom/${code}`;

    const newCourse = this.coursesRepository.create({
      name: createCourseInput.name,
      section: createCourseInput.section ?? null,
      room: createCourseInput.room ?? null,
      subject: createCourseInput.subject ?? null,
      code,
      inviteLink,
    });

    const savedCourse = await this.coursesRepository.save(newCourse);
    console.log('userId', createCourseInput.userId);

    const courseParticipant = this.courseParticipantsRepository.create({
      userId: createCourseInput.userId,
      courseId: savedCourse.id,
      role: CourseRole.OWNER,
    });

    await this.courseParticipantsRepository.save(courseParticipant);

    return savedCourse;
  }

  findAll() {
    return this.coursesRepository.find();
  }

  async find(
    where: FindManyOptions<Course>['where'],
    order: FindManyOptions<Course>['order'],
    connectionArgs: ConnectionArgs,
  ): Promise<CoursesConnection> {
    return findAndPaginate(
      { where, order },
      connectionArgs,
      this.coursesRepository,
    );
  }

  findOne(id: string) {
    return this.coursesRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCourseInput: UpdateCourseInput) {
    if (!id) {
      throw new Error('ID is required for updating a course.');
    }

    const filteredInput = Object.fromEntries(
      Object.entries(updateCourseInput).filter(
        ([key]) => key !== 'id' && key !== 'code' && key !== 'inviteLink',
      ),
    );

    await this.coursesRepository.update(id, filteredInput);

    return this.coursesRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const course = await this.coursesRepository.findOne({ where: { id } });

    if (!course) {
      throw new Error('Course not found');
    }

    await this.coursesRepository.delete(id);

    return course;
  }


  async findCoursesByUserId(
    userId: string,
    first = 10,
    after?: string,
  ): Promise<CoursesConnection> {
    const participants = await this.courseParticipantsRepository.find({
      where: { userId },
    });

    if (participants.length === 0) {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    const courseIds = participants.map((p) => p.courseId);

    const query = this.coursesRepository
      .createQueryBuilder('course')
      .where({ id: In(courseIds) })
      .orderBy('course.createdAt', 'DESC')
      .take(first + 1);

    if (after) {
      query.andWhere('course.createdAt < :after', {
        after: new Date(after)
      });
    }

    const courses = await query.getMany();
    const hasNextPage = courses.length > first;
    const edges = courses.slice(0, first).map((course) => ({
      cursor: course.createdAt.toISOString(),
      node: course,
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: false, 
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
    };
  }
}
