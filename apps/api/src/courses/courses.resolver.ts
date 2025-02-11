import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course } from 'src/courses/entities/course.entity';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => Course)
  async create(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ) {
    return this.coursesService.create(createCourseInput);
  }

  @Query(() => [Course], { name: 'Courses' })
  async findAll() {
    return this.coursesService.findAll();
  }

  @Query(() => Course, { name: 'Course' })
  async findOne(@Args('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Mutation(() => Course)
  async update(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return this.coursesService.update(updateCourseInput.id, updateCourseInput);
  }

  @Mutation(() => Course)
  async remove(@Args('id') id: string) {
    return this.coursesService.remove(id);
  }
}
