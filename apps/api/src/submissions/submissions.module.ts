import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsResolver } from './submissions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    AssignmentsModule,
    FilesModule,
  ],
  providers: [SubmissionsResolver, SubmissionsService],
})
export class SubmissionsModule {}
