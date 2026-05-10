import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class InstructorService {
  constructor(private prisma: PrismaService) {}

  private validateObjectId(id: string) {
    if (!id.match(/^[0-9a-f]{24}$/i)) {
      throw new BadRequestException('Invalid ID format');
    }
  }

  /**
   * COURSES
   */
  async listOwnCourses(instructorId: string) {
    this.validateObjectId(instructorId);
    return await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        category: true,
        lessons: true,
        enrollments: { select: { id: true } },
        reviews: { select: { id: true } },
      },
    });
  }

  async createCourse(instructorId: string, createCourseDto: CreateCourseDto) {
    this.validateObjectId(instructorId);
    this.validateObjectId(createCourseDto.categoryId);

    return await this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        shortDescription: createCourseDto.shortDescription || createCourseDto.description,
        slug: createCourseDto.slug || createCourseDto.title.toLowerCase().replace(/\s+/g, '-'),
        categoryId: createCourseDto.categoryId,
        instructorId,
        price: createCourseDto.price || 0,
        discountPrice: createCourseDto.discountPrice,
        currency: createCourseDto.currency || 'USD',
        level: createCourseDto.level || 'BEGINNER',
        language: createCourseDto.language || 'English',
        thumbnail: createCourseDto.thumbnail,
        isPublished: false,
        status: 'DRAFT',
      },
      include: { category: true },
    });
  }

  async updateOwnCourse(instructorId: string, courseId: string, updateCourseDto: UpdateCourseDto) {
    this.validateObjectId(instructorId);
    this.validateObjectId(courseId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    return await this.prisma.course.update({
      where: { id: courseId },
      data: updateCourseDto,
      include: { category: true },
    });
  }

  async deleteOwnCourse(instructorId: string, courseId: string) {
    this.validateObjectId(instructorId);
    this.validateObjectId(courseId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    return await this.prisma.course.delete({
      where: { id: courseId },
    });
  }

  /**
   * LESSONS
   */
  async createLesson(instructorId: string, courseId: string, createLessonDto: CreateLessonDto) {
    this.validateObjectId(instructorId);
    this.validateObjectId(courseId);
    this.validateObjectId(createLessonDto.sectionId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only create lessons in your own courses');
    }

    return await this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        description: createLessonDto.description,
        content: createLessonDto.content,
        videoUrl: createLessonDto.videoUrl,
        duration: createLessonDto.duration || 0,
        order: createLessonDto.order,
        courseId,
        sectionId: createLessonDto.sectionId,
        isPreview: false,
      },
    });
  }

  async updateLesson(instructorId: string, lessonId: string, updateLessonDto: UpdateLessonDto) {
    this.validateObjectId(instructorId);
    this.validateObjectId(lessonId);

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      throw new BadRequestException('Lesson not found');
    }

    if (lesson.course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only update your own lessons');
    }

    return await this.prisma.lesson.update({
      where: { id: lessonId },
      data: updateLessonDto,
    });
  }

  async deleteLesson(instructorId: string, lessonId: string) {
    this.validateObjectId(instructorId);
    this.validateObjectId(lessonId);

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      throw new BadRequestException('Lesson not found');
    }

    if (lesson.course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only delete your own lessons');
    }

    return await this.prisma.lesson.delete({
      where: { id: lessonId },
    });
  }

  /**
   * QUIZZES
   */
  async createQuiz(instructorId: string, courseId: string, createQuizDto: CreateQuizDto) {
    this.validateObjectId(instructorId);
    this.validateObjectId(courseId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only create quizzes for your own courses');
    }

    return await this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        description: createQuizDto.description,
        courseId,
        passingScore: createQuizDto.passingScore || 70,
        timeLimit: createQuizDto.timeLimit || null,
        shuffleQuestions: createQuizDto.shuffleQuestions || false,
        showCorrectAnswers: createQuizDto.showCorrectAnswers || true,
        isPublished: createQuizDto.published || false,
      },
    });
  }

  async updateQuiz(instructorId: string, quizId: string, updateQuizDto: UpdateQuizDto) {
    this.validateObjectId(instructorId);
    this.validateObjectId(quizId);

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { course: true },
    });

    if (!quiz) {
      throw new BadRequestException('Quiz not found');
    }

    if (quiz.course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only update your own quizzes');
    }

    const updateData: any = { ...updateQuizDto };
    if (updateData.published !== undefined) {
      updateData.isPublished = updateData.published;
      delete updateData.published;
    }

    return await this.prisma.quiz.update({
      where: { id: quizId },
      data: updateData,
    });
  }

  async deleteQuiz(instructorId: string, quizId: string) {
    this.validateObjectId(instructorId);
    this.validateObjectId(quizId);

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { course: true },
    });

    if (!quiz) {
      throw new BadRequestException('Quiz not found');
    }

    if (quiz.course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only delete your own quizzes');
    }

    return await this.prisma.quiz.delete({
      where: { id: quizId },
    });
  }

  /**
   * STUDENTS
   */
  async getEnrolledStudents(instructorId: string, courseId: string) {
    this.validateObjectId(instructorId);
    this.validateObjectId(courseId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You can only view students in your own courses');
    }

    return await this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        course: { select: { title: true } },
      },
    });
  }

  /**
   * ANALYTICS
   */
  async getAnalytics(instructorId: string) {
    this.validateObjectId(instructorId);

    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        enrollments: true,
        reviews: true,
        quizzes: {
          include: { results: true },
        },
      },
    });

    const totalCourses = courses.length;
    let totalStudents = 0;
    let totalEnrollments = 0;
    let totalRevenue = 0;
    let totalReviews = 0;
    let averageRating = 0;
    let avgEnrollmentPerCourse = 0;
    let avgRevenuePerCourse = 0;
    let publishedCourses = 0;
    let draftCourses = 0;

    const courseStats: any[] = [];

    for (const course of courses) {
      const enrollmentCount = course.enrollments.length;
      const courseRevenue = (course.price || 0) * enrollmentCount;
      const courseReviews = course.reviews.length;

      totalEnrollments += enrollmentCount;
      totalRevenue += courseRevenue;
      totalReviews += courseReviews;

      if (course.isPublished) {
        publishedCourses++;
      } else {
        draftCourses++;
      }

      courseStats.push({
        courseId: course.id,
        title: course.title,
        enrollments: enrollmentCount,
        revenue: courseRevenue,
        reviews: courseReviews,
        avgRating: course.rating || 0,
        price: course.price || 0,
        isPublished: course.isPublished,
      });
    }

    if (courses.length > 0) {
      totalStudents = new Set(courses.flatMap(c => c.enrollments.map(e => e.studentId))).size;
      avgEnrollmentPerCourse = totalEnrollments / totalCourses;
      avgRevenuePerCourse = totalRevenue / totalCourses;
      averageRating = courses.reduce((sum, c) => sum + (c.rating || 0), 0) / totalCourses;
    }

    return {
      summary: {
        totalCourses,
        publishedCourses,
        draftCourses,
        totalStudents,
        totalEnrollments,
        totalRevenue,
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(2)),
        avgEnrollmentPerCourse: parseFloat(avgEnrollmentPerCourse.toFixed(2)),
        avgRevenuePerCourse: parseFloat(avgRevenuePerCourse.toFixed(2)),
      },
      courseStats,
    };
  }
}
