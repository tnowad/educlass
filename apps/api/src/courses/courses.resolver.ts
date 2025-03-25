import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course } from 'src/courses/entities/course.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CoursesConnection, CoursesConnectionArgs } from './dto/course.input';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard)
  async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
    @CurrentUser() user: User,
  ) {
    console.log('user', user);
    return this.coursesService.create({
      ...createCourseInput,
      userId: user.id,
    });
  }

  @Query(() => CoursesConnection, { name: 'courses' })
  @UseGuards(GqlAuthGuard)
  async findAll(
    @Args() connectionArgs: CoursesConnectionArgs,
  ): Promise<CoursesConnection> {
    return this.coursesService.find(
      connectionArgs.where,
      connectionArgs.orderBy,
      connectionArgs,
    );
  }

  @Query(() => Course, { name: 'course' })
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
