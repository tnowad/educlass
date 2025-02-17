import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AudienceEnum, PostStatusEnum } from '../entities/post.entity';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  courseId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => PostStatusEnum, { nullable: true })
  @IsEnum(PostStatusEnum)
  @IsOptional()
  status?: PostStatusEnum;

  @Field(() => AudienceEnum, { nullable: true })
  @IsEnum(AudienceEnum)
  @IsOptional()
  audience?: AudienceEnum;
}
