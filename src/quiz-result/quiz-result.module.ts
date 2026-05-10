import { Module } from '@nestjs/common';
import { QuizResultService } from './quiz-result.service';
import { QuizResultController } from './quiz-result.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuizResultController],
  providers: [QuizResultService],
})
export class QuizResultModule {}
