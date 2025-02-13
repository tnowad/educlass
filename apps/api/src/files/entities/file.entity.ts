import { ObjectType, Field } from '@nestjs/graphql';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({
  name: 'files',
})
export class File {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'object_name', type: 'varchar', length: 255 })
  objectName: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  mimetype: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field({ nullable: true })
  url: string;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, (user) => user.avatar, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Field(() => Assignment, { nullable: true })
  @ManyToOne(() => Assignment, (assignment) => assignment.attachements)
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;
}
