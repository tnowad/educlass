import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { CourseParticipant } from 'src/course-participants/entities/course-participant.entity';
import { CourseRole } from 'src/course-participants/dto/role.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(CourseParticipant)
    private readonly courseParticipantRepository: Repository<CourseParticipant>,
  ) {}

  async create(
    createPostInput: CreatePostInput & { authorId: string },
  ): Promise<Post> {
    const { authorId, courseId, ...rest } = createPostInput;

    const author = await this.userRepository.findOne({
      where: {
        id: authorId,
      },
    });

    if (!author) {
      throw new NotFoundException(`User with ${authorId} not found`);
    }
    const courseParticipant = await this.courseParticipantRepository.findOne({
      where: {
        userId: authorId,
      },
    });

    if (!courseParticipant) {
      throw new NotFoundException(`User not exist in a course`);
    }

    if (courseParticipant.role !== CourseRole.OWNER) {
      throw new ForbiddenException('Only owners can create posts');
    }

    const course = await this.courseRepository.findOne({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ${courseId} not found`);
    }

    const post = this.postRepository.create({ ...rest, author, course });
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
    updatePostInput: UpdatePostInput & { authorId: string },
  ): Promise<Post> {
    const { authorId, ...rest } = updatePostInput;

    const courseParticipant = await this.courseParticipantRepository.findOne({
      where: {
        userId: authorId,
      },
    });

    if (!courseParticipant) {
      throw new NotFoundException(`User not exist in a course`);
    }

    if (courseParticipant.role !== CourseRole.OWNER) {
      throw new ForbiddenException('Only owners can update posts');
    }

    const post = await this.findOne(id);
    Object.assign(post, rest);
    return this.postRepository.save(post);
  }

  async remove(id: string, authorId: string): Promise<boolean> {
    const courseParticipant = await this.courseParticipantRepository.findOne({
      where: {
        userId: authorId,
      },
    });

    if (!courseParticipant) {
      throw new NotFoundException(`User not exist in a course`);
    }

    if (courseParticipant.role !== CourseRole.OWNER) {
      throw new ForbiddenException('Only owners can remove posts');
    }

    const result = await this.postRepository.delete(id);
    return result.affected > 0;
  }
}
