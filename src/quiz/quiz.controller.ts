import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  

  @Post()
  @ApiOperation({ summary: 'Create a quiz for a course' })
  @ApiResponse({ status: 201, description: 'Quiz created successfully' })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get quizzes' })
  @ApiResponse({ status: 200, description: 'Returns quizzes' })
  findAll(@Query('courseId') courseId?: string) {
    return this.quizService.findAll(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz details by ID' })
  @ApiResponse({ status: 200, description: 'Returns quiz details' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz updated successfully' })
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz deleted successfully' })
  remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }
}
