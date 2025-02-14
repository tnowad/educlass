import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CourseRole } from './dto/role.enum';
import { CourseParticipantsService } from './course-participants.service';

@Injectable()
export class CourseRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly courseParticipantsService: CourseParticipantsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<CourseRole[]>(
      'course_roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const currentUser = req.user;

    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }

    const courseId = gqlContext.getArgs().courseId || gqlContext.getArgs().id;
    if (!courseId) {
      throw new ForbiddenException('Missing course information');
    }

    const participant =
      await this.courseParticipantsService.findByUserAndCourse(
        currentUser.id,
        courseId,
      );

    if (!participant) {
      throw new ForbiddenException('You are not a participant in this course');
    }

    req.courseRole = participant.role;

    if (!requiredRoles.includes(participant.role)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
