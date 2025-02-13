import { ObjectType, Field } from '@nestjs/graphql';
import { Course } from 'src/courses/entities/course.entity';
import { File } from 'src/files/entities/file.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({
  name: 'assignments',
})
export class Assignment {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', name: 'start_date', nullable: true })
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', name: 'due_date', nullable: true })
  dueDate: Date;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => Course)
  @ManyToOne(() => Course, (course) => course.assignments)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Field(() => [File])
  @OneToMany(() => File, (file) => file.assignment)
  attachements: File[];
}
