import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoleEnum {
  OWNER = 'OWNER',
  PARTICIPANT = 'PARTICIPANT',
}

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
});

@ObjectType()
@Entity({ name: 'course_participants' })
export class CourseParticipant {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Field()
  @Column({ name: 'course_id', type: 'varchar', length: 255 })
  courseId: string;

  @Field(() => RoleEnum)
  @Column({ name: 'role', type: 'enum', enum: RoleEnum })
  role: RoleEnum;

  @Field()
  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
