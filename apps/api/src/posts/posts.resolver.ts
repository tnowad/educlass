import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from './posts.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: User,
  ): Promise<Post> {
    return this.postService.create({ ...createPostInput, authorId: user.id });
  }

  @Query(() => [Post])
  findAllPosts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Query(() => Post)
  findPostById(@Args('id') id: string): Promise<Post> {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('id') id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ): Promise<Post> {
    return this.postService.update(id, updatePostInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePost(@Args('id') id: string): Promise<boolean> {
    return this.postService.remove(id);
  }
}
