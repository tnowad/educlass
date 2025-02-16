import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseRole } from '../dto/role.enum';

registerEnumType(CourseRole, {
  name: 'CourseRole',
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

  @Field(() => CourseRole)
  @Column({ name: 'role', type: 'enum', enum: CourseRole })
  role: CourseRole;

  @Field()
  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
