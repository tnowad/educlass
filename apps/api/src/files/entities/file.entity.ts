import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({
  name: 'files',
})
export class File {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  filename: string;

  @Field({ nullable: true })
  mimetype: string;

  @Field()
  objectName: string;

  @Field({ nullable: true })
  url: string;
}
