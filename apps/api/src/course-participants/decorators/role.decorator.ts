import { SetMetadata } from '@nestjs/common';
import { CourseRole } from '../dto/role.enum';

export const CourseRoles = (...roles: CourseRole[]) =>
  SetMetadata('roles', roles);
