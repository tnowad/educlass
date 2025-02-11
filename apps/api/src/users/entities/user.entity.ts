import { ObjectType, Field } from '@nestjs/graphql';
import { File } from 'src/files/entities/file.entity';
import { LocalProvider } from 'src/local-providers/entities/local-provider.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({
  name: 'users',
})
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index({ unique: true })
  email: string;

  @Field()
  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => LocalProvider, { nullable: true })
  @OneToOne(() => LocalProvider, (provider) => provider.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'local_provider_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_local_provider_user',
  })
  localProvider: LocalProvider;

  @Field(() => File, { nullable: true })
  @OneToOne(() => File, (file) => file.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'avatar_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_avatar_user',
  })
  avatar: File;
}
