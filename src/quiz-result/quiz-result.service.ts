import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import { UpdateQuizResultDto } from './dto/update-quiz-result.dto';

@Injectable()
export class QuizResultService {
  constructor(private prisma: PrismaService) {}

	private assertObjectId(id: string, resourceName: string) {
		if (!id) {
			throw new BadRequestException(`${resourceName} id is required`);
		}
	}

  async create(createQuizResultDto: CreateQuizResultDto) {
    const studentId = createQuizResultDto.studentId;

    if (!studentId) {
      throw new BadRequestException('studentId is required');
    }

    this.assertObjectId(studentId, 'student');
    this.assertObjectId(createQuizResultDto.quizId, 'quiz');

    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true },
    });

    if (!student) {
      throw new NotFoundException('User not found');
    }

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: createQuizResultDto.quizId },
      select: { id: true },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const existingResult = await this.prisma.quizResult.findFirst({
      where: {
        studentId,
        quizId: createQuizResultDto.quizId,
      },
    });

    if (existingResult) {
      throw new BadRequestException('Quiz result already exists for this student');
    }

    return this.prisma.quizResult.create({
      data: {
        studentId,
        quizId: createQuizResultDto.quizId,
        score: createQuizResultDto.score,
        percentage: createQuizResultDto.percentage,
        passed: createQuizResultDto.passed,
        timeSpent: createQuizResultDto.timeSpent,
        answers: createQuizResultDto.answers,
      },
      include: {
        student: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        quiz: {
          select: { id: true, title: true, courseId: true },
        },
      },
    });
  }

  async findAll(studentId?: string, quizId?: string) {
    if (studentId) this.assertObjectId(studentId, 'student');
    if (quizId) this.assertObjectId(quizId, 'quiz');

    return this.prisma.quizResult.findMany({
      where: {
        ...(studentId ? { studentId } : {}),
        ...(quizId ? { quizId } : {}),
      },
      include: {
        student: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        quiz: {
          include: {
            course: {
              select: { id: true, title: true, slug: true },
            },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  async myResults(studentId: string) {
    this.assertObjectId(studentId, 'student');
    return this.findAll(studentId);
  }

  async findOne(id: string) {
    this.assertObjectId(id, 'quiz result');

    const result = await this.prisma.quizResult.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        quiz: {
          include: {
            course: {
              select: { id: true, title: true, slug: true },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Quiz result not found');
    }

    return result;
  }

  async update(id: string, updateQuizResultDto: UpdateQuizResultDto) {
    this.assertObjectId(id, 'quiz result');

    const result = await this.prisma.quizResult.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Quiz result not found');
    }

    return this.prisma.quizResult.update({
      where: { id },
      data: {
        score: updateQuizResultDto.score,
        percentage: updateQuizResultDto.percentage,
        passed: updateQuizResultDto.passed,
        timeSpent: updateQuizResultDto.timeSpent,
        answers: updateQuizResultDto.answers,
      },
      include: {
        student: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        quiz: {
          select: { id: true, title: true, courseId: true },
        },
      },
    });
  }

  async remove(id: string) {
    this.assertObjectId(id, 'quiz result');

    const result = await this.prisma.quizResult.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Quiz result not found');
    }

    return this.prisma.quizResult.delete({
      where: { id },
    });
  }
}
