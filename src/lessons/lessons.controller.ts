import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create.dto';
import { UpdateLessonDto } from './dto/update.dto';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
	constructor(private readonly lessonsService: LessonsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create a lesson' })
	@ApiResponse({ status: 201, description: 'Lesson created successfully' })
	create(@Req() req: any, @Body() createLessonDto: CreateLessonDto) {
		return this.lessonsService.create(req.user.id, createLessonDto);
	}

	@Get('course/:courseId')
	@ApiOperation({ summary: 'Get all lessons for a course' })
	@ApiResponse({ status: 200, description: 'Returns course lessons' })
	findAllByCourse(@Param('courseId') courseId: string) {
		return this.lessonsService.findAllByCourse(courseId);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get lesson details by ID' })
	@ApiResponse({ status: 200, description: 'Returns lesson details' })
	@ApiResponse({ status: 404, description: 'Lesson not found' })
	findOne(@Param('id') id: string) {
		return this.lessonsService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update a lesson' })
	@ApiResponse({ status: 200, description: 'Lesson updated successfully' })
	update(@Param('id') id: string, @Req() req: any, @Body() updateLessonDto: UpdateLessonDto) {
		return this.lessonsService.update(id, req.user.id, updateLessonDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete a lesson' })
	@ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
	remove(@Param('id') id: string, @Req() req: any) {
		return this.lessonsService.remove(id, req.user.id);
	}
}
