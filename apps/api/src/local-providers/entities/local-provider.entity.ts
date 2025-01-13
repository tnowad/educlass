import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'local_providers' })
export class LocalProvider {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.localProvider, {
    onDelete: 'CASCADE',
  })
  user: User;
}
