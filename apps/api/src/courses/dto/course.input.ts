import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Connection, ConnectionCursor, Edge } from 'graphql-relay';
import { ConnectionArgs, OrderByInput, PageInfo } from 'nestjs-graphql-relay';
import { Course } from '../entities/course.entity';

@ObjectType({ isAbstract: true })
abstract class CoursesEdge implements Edge<Course> {
  @Field(() => Course)
  readonly node: Course;

  @Field()
  readonly cursor: ConnectionCursor;
}

@ObjectType()
export class CoursesConnection implements Connection<Course> {
  @Field()
  readonly pageInfo: PageInfo;

  @Field(() => [CoursesEdge])
  readonly edges: Array<Edge<Course>>;
}

@InputType()
export class CourseWhereInput extends PartialType(
  PickType(Course, ['name'], InputType),
) {
  @Field(() => String, { nullable: true })
  userId?: string;
}

@ArgsType()
export class CoursesConnectionArgs extends ConnectionArgs {
  @Field(() => CourseWhereInput, { nullable: true })
  readonly where?: CourseWhereInput;

  @Field(() => OrderByInput, { nullable: true })
  readonly orderBy?: OrderByInput;
}
