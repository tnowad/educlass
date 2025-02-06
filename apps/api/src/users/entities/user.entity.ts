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
  @JoinColumn({
    name: 'localProviderId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_localProvider_user',
  })
  localProvider: LocalProvider;

  @Field(() => File, { nullable: true })
  @OneToOne(() => File, (file) => file.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'avatarId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_avatar_user',
  })
  avatar: File;
}
