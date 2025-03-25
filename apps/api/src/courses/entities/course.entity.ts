import { Field, ObjectType } from '@nestjs/graphql';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { File } from 'src/files/entities/file.entity';
import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'courses' })
export class Course {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  section?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  room?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  subject?: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Field()
  @Column({ name: 'invite_link', type: 'varchar', length: 255 })
  inviteLink: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => [Assignment], { nullable: true })
  @OneToMany(() => Assignment, (assignment) => assignment.course)
  assignments: Assignment[];

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.course, { cascade: true })
  posts: Post[];

  @Field(() => File, { nullable: true })
  @OneToOne(() => File, { nullable: true, cascade: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cover_id' })
  cover?: File;
}
