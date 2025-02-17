import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { AudienceEnum, PostStatusEnum } from '../entities/post.entity';
import { CreatePostInput } from './create-post.input';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field(() => PostStatusEnum, { nullable: true })
  @IsEnum(PostStatusEnum)
  @IsOptional()
  status?: PostStatusEnum;

  @Field(() => AudienceEnum, { nullable: true })
  @IsEnum(AudienceEnum)
  @IsOptional()
  audience?: AudienceEnum;
}
