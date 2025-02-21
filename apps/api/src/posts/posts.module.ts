import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from './posts.service';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';
import { PostsResolver } from './posts.resolver';
import { CourseParticipant } from 'src/course-participants/entities/course-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Course, CourseParticipant])],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
