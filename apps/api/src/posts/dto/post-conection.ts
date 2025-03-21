import { ObjectType, Field } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostEdge {
  @Field(() => String)
  cursor: string;

  @Field(() => Post)
  node: Post;
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  endCursor?: string;
}

@ObjectType()
export class PostConnection {
  @Field(() => [PostEdge])
  edges: PostEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
