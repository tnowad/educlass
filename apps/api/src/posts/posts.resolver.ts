import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PostsConnection, PostsConnectionArgs } from './dto/post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: User,
  ): Promise<Post> {
    return this.postService.create({ ...createPostInput, user });
  }

  @Query(() => PostsConnection, { name: 'posts' })
  async findAllPosts(
    @Args() connectionArgs: PostsConnectionArgs,
  ): Promise<PostsConnection> {
    return this.postService.find(
      connectionArgs.where,
      connectionArgs.orderBy,
      connectionArgs,
    );
  }

  @Query(() => Post)
  async findPostById(@Args('id') id: string): Promise<Post> {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('id') id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() user: User,
  ): Promise<Post> {
    return this.postService.update(id, {
      ...updatePostInput,
      user: user,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.postService.remove(id, user);
  }
}
