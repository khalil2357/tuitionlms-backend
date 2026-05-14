import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

	private assertObjectId(id: string, resourceName: string) {
		if (!id) {
			throw new BadRequestException(`${resourceName} id is required`);
		}
	}

  async create(createQuizDto: CreateQuizDto) {
    this.assertObjectId(createQuizDto.courseId, 'course');

    const course = await this.prisma.course.findUnique({
      where: { id: createQuizDto.courseId },
      select: { id: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        description: createQuizDto.description,
        courseId: createQuizDto.courseId,
        passingScore: createQuizDto.passingScore ?? 70,
        timeLimit: createQuizDto.timeLimit,
        shuffleQuestions: createQuizDto.shuffleQuestions ?? false,
        showCorrectAnswers: createQuizDto.showCorrectAnswers ?? true,
        isPublished: createQuizDto.isPublished ?? false,
      },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        questions: true,
      },
    });
  }

  async findAll(courseId?: string) {
    if (courseId) {
      this.assertObjectId(courseId, 'course');
    }

    return this.prisma.quiz.findMany({
      where: courseId ? { courseId } : undefined,
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        _count: {
          select: { questions: true, results: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    this.assertObjectId(id, 'quiz');

    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, name: true, email: true },
            },
            category: true,
          },
        },
        questions: {
          include: {
            options: true,
          },
          orderBy: { order: 'asc' },
        },
        results: {
          include: {
            student: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { completedAt: 'desc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    this.assertObjectId(id, 'quiz');

    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return this.prisma.quiz.update({
      where: { id },
      data: {
        ...updateQuizDto,
      },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        questions: true,
      },
    });
  }

  async remove(id: string) {
    this.assertObjectId(id, 'quiz');

    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return this.prisma.quiz.delete({
      where: { id },
    });
  }
}
