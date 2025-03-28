import { Field, ObjectType } from "@nestjs/graphql";
import { Connection, ConnectionCursor, Edge, PageInfo } from "graphql-relay";
import { Course } from "src/courses/entities/course.entity";




@ObjectType({isAbstract: true})
abstract class CoursesEdge implements Edge<Course>{
    @Field(()=> Course)
    readonly node:Course;

    @Field()
    readonly cursor: ConnectionCursor;
}


@ObjectType()
export class CoursesConnection implements Connection<Course>{
    @Field()
    readonly pageInfo: PageInfo;

    @Field(() => [CoursesEdge])
    readonly edges: Edge<Course>[];
}
