import { Injectable } from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
  ) {}
  async create(createCourseInput: CreateCourseInput) {
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

    return this.coursesRepository.save(newCourse);
  }

  findAll() {
    return this.coursesRepository.find();
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
}
