import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { UpdateAssignmentInput } from './dto/update-assignment.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesService } from 'src/courses/courses.service';

@Resolver(() => Assignment)
export class AssignmentsResolver {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Mutation(() => Assignment)
  @UseGuards(GqlAuthGuard)
  createAssignment(
    @Args('createAssignmentInput') createAssignmentInput: CreateAssignmentInput,
  ) {
    return this.assignmentsService.create(createAssignmentInput);
  }

  @Query(() => [Assignment], { name: 'assignments' })
  @UseGuards(GqlAuthGuard)
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Query(() => Assignment, { name: 'assignment' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Mutation(() => Assignment)
  @UseGuards(GqlAuthGuard)
  updateAssignment(
    @Args('updateAssignmentInput') updateAssignmentInput: UpdateAssignmentInput,
  ) {
    return this.assignmentsService.update(
      updateAssignmentInput.id,
      updateAssignmentInput,
    );
  }

  @Mutation(() => Assignment)
  @UseGuards(GqlAuthGuard)
  removeAssignment(@Args('id') id: string) {
    return this.assignmentsService.remove(id);
  }

  @ResolveField(() => Course)
  course(@Parent() assignment: Assignment) {
    return this.coursesService.findOne(assignment.course.id);
  }
}
