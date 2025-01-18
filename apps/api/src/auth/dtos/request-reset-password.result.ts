import { ObjectType } from '@nestjs/graphql';
import { ActionResult } from 'src/common/dtos/action.result';

@ObjectType()
export class RequestResetPasswordResult extends ActionResult {}
