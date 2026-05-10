import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuizResultService } from './quiz-result.service';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import { UpdateQuizResultDto } from './dto/update-quiz-result.dto';

@ApiTags('Quiz Results')
@Controller('quiz-result')
export class QuizResultController {
  constructor(private readonly quizResultService: QuizResultService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a quiz result' })
  @ApiResponse({ status: 201, description: 'Quiz result created successfully' })
  create(@Req() req: any, @Body() createQuizResultDto: CreateQuizResultDto) {
    createQuizResultDto.studentId = req.user.id;
    return this.quizResultService.create(createQuizResultDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get quiz results' })
  @ApiResponse({ status: 200, description: 'Returns quiz results' })
  findAll(@Query('studentId') studentId?: string, @Query('quizId') quizId?: string) {
    return this.quizResultService.findAll(studentId, quizId);
  }

  @Get('my-results')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user quiz results' })
  @ApiResponse({ status: 200, description: 'Returns current user quiz results' })
  myResults(@Req() req: any) {
    return this.quizResultService.myResults(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get quiz result details by ID' })
  @ApiResponse({ status: 200, description: 'Returns quiz result details' })
  @ApiResponse({ status: 404, description: 'Quiz result not found' })
  findOne(@Param('id') id: string) {
    return this.quizResultService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a quiz result' })
  @ApiResponse({ status: 200, description: 'Quiz result updated successfully' })
  update(@Param('id') id: string, @Body() updateQuizResultDto: UpdateQuizResultDto) {
    return this.quizResultService.update(id, updateQuizResultDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a quiz result' })
  @ApiResponse({ status: 200, description: 'Quiz result deleted successfully' })
  remove(@Param('id') id: string) {
    return this.quizResultService.remove(id);
  }
}
