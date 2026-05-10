import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService, UpdateProgressDto } from './progress.service';

@ApiTags('Progress')
@Controller('progress')
export class ProgressController {
	constructor(private readonly progressService: ProgressService) {}

	@Patch('course/:courseId')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create or update the logged-in user course progress' })
	@ApiResponse({ status: 200, description: 'Progress updated successfully' })
	upsert(
		@Req() req: any,
		@Param('courseId') courseId: string,
		@Body() payload: UpdateProgressDto,
	) {
		return this.progressService.upsert(req.user.id, courseId, payload);
	}

	@Get('my-progress')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get all progress records for the current user' })
	@ApiResponse({ status: 200, description: 'Returns user progress records' })
	myProgress(@Req() req: any) {
		return this.progressService.myProgress(req.user.id);
	}

	@Get('course/:courseId')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get all progress records for a course' })
	@ApiResponse({ status: 200, description: 'Returns course progress records' })
	courseProgress(@Param('courseId') courseId: string) {
		return this.progressService.courseProgress(courseId);
	}

	@Get(':courseId')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get the current user progress for a course' })
	@ApiResponse({ status: 200, description: 'Returns one progress record' })
	one(@Req() req: any, @Param('courseId') courseId: string) {
		return this.progressService.one(req.user.id, courseId);
	}

	@Delete(':courseId')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete the current user progress for a course' })
	@ApiResponse({ status: 200, description: 'Progress deleted successfully' })
	remove(@Req() req: any, @Param('courseId') courseId: string) {
		return this.progressService.remove(req.user.id, courseId);
	}
}
