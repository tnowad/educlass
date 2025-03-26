import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Course } from 'src/courses/entities/course.entity';

export enum PostStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

registerEnumType(PostStatusEnum, {
  name: 'post_status_enum',
  description: 'Status of a post',
});

export enum AudienceEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
  RESTRICTED = 'restricted',
}

registerEnumType(AudienceEnum, {
  name: 'audience_enum',
  description: 'Audience visibility of a post',
});

@ObjectType()
@Entity({ name: 'posts' })
export class Post {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.posts, { onDelete: 'CASCADE' })
  course: Course;

  @Field()
  @Column({ type: 'text' })
  content: string;

  @Field(() => PostStatusEnum)
  @Column({ type: 'enum', enum: PostStatusEnum, default: PostStatusEnum.DRAFT })
  status: PostStatusEnum;

  @Field(() => AudienceEnum)
  @Column({ type: 'enum', enum: AudienceEnum, default: AudienceEnum.PUBLIC })
  audience: AudienceEnum;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
