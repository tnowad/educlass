import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course } from 'src/courses/entities/course.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard)
  async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.userId;
    console.log('userId', userId);
    return this.coursesService.create({ ...createCourseInput, userId });
  }

  @Query(() => [Course], { name: 'Courses' })
  @UseGuards(GqlAuthGuard)
  async findAll() {
    return this.coursesService.findAll();
  }

  @Query(() => Course, { name: 'Course' })
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard)
  async updateCourse(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return this.coursesService.update(updateCourseInput.id, updateCourseInput);
  }

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard)
  async removeCourse(@Args('id') id: string) {
    return this.coursesService.remove(id);
  }
}
