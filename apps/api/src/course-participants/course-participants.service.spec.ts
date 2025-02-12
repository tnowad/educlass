import { Test, TestingModule } from '@nestjs/testing';
import { CourseParticipantsService } from './course-participants.service';

describe('CourseParticipantsService', () => {
  let service: CourseParticipantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseParticipantsService],
    }).compile();

    service = module.get<CourseParticipantsService>(CourseParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
