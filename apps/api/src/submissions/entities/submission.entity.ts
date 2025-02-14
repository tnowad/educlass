import { ObjectType, Field } from '@nestjs/graphql';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { File } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({
  name: 'submissions',
})
@ObjectType()
export class Submission {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'text' })
  content: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', name: 'submitted_at', nullable: true })
  submittedAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  score: number;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.submissions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => [File])
  @OneToMany(() => File, (file) => file.assignment)
  attachements: File[];

  @Field(() => Assignment)
  @OneToOne(() => Assignment, (assignment) => assignment.submission)
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;
}
