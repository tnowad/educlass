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
import { Post } from '../entities/post.entity';

@ObjectType({ isAbstract: true })
abstract class PostsEdge implements Edge<Post> {
  @Field(() => Post)
  readonly node: Post;

  @Field()
  readonly cursor: ConnectionCursor;
}

@ObjectType()
export class PostsConnection implements Connection<Post> {
  @Field()
  readonly pageInfo: PageInfo;

  @Field(() => [PostsEdge])
  readonly edges: Array<Edge<Post>>;
}

@InputType()
export class PostWhereInput extends PartialType(
  PickType(Post, ['content'], InputType),
) {
  @Field(() => String, { nullable: true })
  courseId?: string;
}

@ArgsType()
export class PostsConnectionArgs extends ConnectionArgs {
  @Field(() => PostWhereInput, { nullable: true })
  readonly where?: PostWhereInput;

  @Field(() => OrderByInput, { nullable: true })
  readonly orderBy?: OrderByInput;
}
