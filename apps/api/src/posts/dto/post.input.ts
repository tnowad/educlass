import { Field, ObjectType } from '@nestjs/graphql';
import { Connection, ConnectionCursor, Edge } from 'graphql-relay';
import { PageInfo } from 'nestjs-graphql-relay';
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
