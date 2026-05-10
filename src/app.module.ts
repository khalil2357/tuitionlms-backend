import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { ProgressModule } from './progress/progress.module';
import { QuizModule } from './quiz/quiz.module';
import { QuizResultModule } from './quiz-result/quiz-result.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CertificateModule } from './certificate/certificate.module';
import { InstructorModule } from './instructor/instructor.module';


@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CoursesModule, LessonsModule, EnrollmentsModule, MailModule, AdminModule, ProgressModule, QuizModule, QuizResultModule, ReviewsModule, CertificateModule, InstructorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
