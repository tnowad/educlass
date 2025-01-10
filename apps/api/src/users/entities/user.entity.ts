import { ObjectType, Field } from '@nestjs/graphql';
import { LocalProvider } from 'src/local-providers/entities/local-provider.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => LocalProvider, { nullable: true })
  @OneToOne(() => LocalProvider, (provider) => provider.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  localProvider: LocalProvider;
}
