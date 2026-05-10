import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InstructorService } from './instructor.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Controller('instructor')
@ApiTags('Instructor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InstructorController {
  constructor(private instructorService: InstructorService) {}

  /**
   * COURSES
   */
  @Get('courses')
  @ApiOperation({ summary: 'List instructor own courses' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  async listOwnCourses(@Req() req: any) {
    return await this.instructorService.listOwnCourses(req.user.sub);
  }

  @Post('courses')
  @ApiOperation({ summary: 'Create new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  async createCourse(@Req() req: any, @Body() createCourseDto: CreateCourseDto) {
    return await this.instructorService.createCourse(req.user.sub, createCourseDto);
  }

  @Patch('courses/:courseId')
  @ApiOperation({ summary: 'Update own course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  async updateOwnCourse(
    @Req() req: any,
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.instructorService.updateOwnCourse(req.user.sub, courseId, updateCourseDto);
  }

  @Delete('courses/:courseId')
  @ApiOperation({ summary: 'Delete own course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  async deleteOwnCourse(@Req() req: any, @Param('courseId') courseId: string) {
    return await this.instructorService.deleteOwnCourse(req.user.sub, courseId);
  }

  /**
   * LESSONS
   */
  @Post('courses/:courseId/lessons')
  @ApiOperation({ summary: 'Create lesson in own course' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  async createLesson(
    @Req() req: any,
    @Param('courseId') courseId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return await this.instructorService.createLesson(req.user.sub, courseId, createLessonDto);
  }

  @Patch('lessons/:lessonId')
  @ApiOperation({ summary: 'Update own lesson' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  async updateLesson(
    @Req() req: any,
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return await this.instructorService.updateLesson(req.user.sub, lessonId, updateLessonDto);
  }

  @Delete('lessons/:lessonId')
  @ApiOperation({ summary: 'Delete own lesson' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  async deleteLesson(@Req() req: any, @Param('lessonId') lessonId: string) {
    return await this.instructorService.deleteLesson(req.user.sub, lessonId);
  }

  /**
   * QUIZZES
   */
  @Post('courses/:courseId/quizzes')
  @ApiOperation({ summary: 'Create quiz for own course' })
  @ApiResponse({ status: 201, description: 'Quiz created successfully' })
  async createQuiz(
    @Req() req: any,
    @Param('courseId') courseId: string,
    @Body() createQuizDto: CreateQuizDto,
  ) {
    return await this.instructorService.createQuiz(req.user.sub, courseId, createQuizDto);
  }

  @Patch('quizzes/:quizId')
  @ApiOperation({ summary: 'Update own quiz' })
  @ApiResponse({ status: 200, description: 'Quiz updated successfully' })
  async updateQuiz(
    @Req() req: any,
    @Param('quizId') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return await this.instructorService.updateQuiz(req.user.sub, quizId, updateQuizDto);
  }

  @Delete('quizzes/:quizId')
  @ApiOperation({ summary: 'Delete own quiz' })
  @ApiResponse({ status: 200, description: 'Quiz deleted successfully' })
  async deleteQuiz(@Req() req: any, @Param('quizId') quizId: string) {
    return await this.instructorService.deleteQuiz(req.user.sub, quizId);
  }

  /**
   * STUDENTS
   */
  @Get('courses/:courseId/students')
  @ApiOperation({ summary: 'View enrolled students in own course' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  async getEnrolledStudents(@Req() req: any, @Param('courseId') courseId: string) {
    return await this.instructorService.getEnrolledStudents(req.user.sub, courseId);
  }

  /**
   * ANALYTICS
   */
  @Get('analytics')
  @ApiOperation({ summary: 'Get own course analytics and revenue' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getAnalytics(@Req() req: any) {
    return await this.instructorService.getAnalytics(req.user.sub);
  }
}
