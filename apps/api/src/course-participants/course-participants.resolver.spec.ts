import { Test, TestingModule } from '@nestjs/testing';
import { CourseParticipantsResolver } from './course-participants.resolver';
import { CourseParticipantsService } from './course-participants.service';

describe('CourseParticipantsResolver', () => {
  let resolver: CourseParticipantsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseParticipantsResolver, CourseParticipantsService],
    }).compile();

    resolver = module.get<CourseParticipantsResolver>(
      CourseParticipantsResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
