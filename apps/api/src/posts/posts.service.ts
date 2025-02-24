import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { CourseParticipantsService } from 'src/course-participants/course-participants.service';
import { CoursesService } from 'src/courses/courses.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly coursesService: CoursesService,

    private readonly courseParticipantsService: CourseParticipantsService,
  ) {}

  async create(
    createPostInput: CreatePostInput & { user: User },
  ): Promise<Post> {
    const { user, courseId, ...rest } = createPostInput;

    if (!user) {
      throw new NotFoundException(`User with ${user.id} not found`);
    }
    const owner =
      await this.courseParticipantsService.findOwnerByCourseIdAndUserId(
        courseId,
        user.id,
      );

    if (!owner) {
      throw new NotFoundException(`User not owner the course`);
    }

    const course = await this.coursesService.findOne(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ${courseId} not found`);
    }

    const post = this.postRepository.create({ ...rest, author: user, course });
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['author', 'course'] });
  }

  async findOne(id: string): Promise<Post> {
    const post = this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ${id} not found`);
    }
    return post;
  }

  async update(
    id: string,
    updatePostInput: UpdatePostInput & { user: User },
  ): Promise<Post> {
    const { user, courseId, ...rest } = updatePostInput;

    const owner =
      await this.courseParticipantsService.findOwnerByCourseIdAndUserId(
        courseId,
        user.id,
      );

    if (!owner) {
      throw new NotFoundException(`User not exist in a course`);
    }

    const post = await this.findOne(id);
    Object.assign(post, rest);
    return this.postRepository.save(post);
  }

  async remove(id: string, user: User): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const isOwner =
      await this.courseParticipantsService.findOwnerByCourseIdAndUserId(
        post.course.id,
        user.id,
      );

    if (!isOwner) {
      throw new NotFoundException(`User not exist in a course`);
    }

    const result = await this.postRepository.delete(id);
    return result.affected > 0;
  }
}
