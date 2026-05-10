import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';
import { EnrollDto, UpdateEnrollmentProgressDto, UpdateEnrollmentStatusDto } from './dto/enroll.dto';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
	constructor(private readonly enrollmentsService: EnrollmentsService) {}

	@Post('enroll')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Enroll the logged-in student in a course' })
	@ApiResponse({ status: 201, description: 'Enrolled successfully' })
	enroll(@Req() req: any, @Body() enrollDto: EnrollDto) {
		return this.enrollmentsService.enroll(req.user.id, enrollDto);
	}

	@Get('my-enrollments')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get current user enrollments' })
	@ApiResponse({ status: 200, description: 'Returns user enrollments' })
	myEnrollments(@Req() req: any) {
		return this.enrollmentsService.myEnrollments(req.user.id);
	}

	@Get('course/:courseId')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get enrollments for a course' })
	@ApiResponse({ status: 200, description: 'Returns course enrollments' })
	courseEnrollments(@Param('courseId') courseId: string) {
		return this.enrollmentsService.courseEnrollments(courseId);
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get enrollment details' })
	@ApiResponse({ status: 200, description: 'Returns enrollment details' })
	findOne(@Param('id') id: string) {
		return this.enrollmentsService.findOne(id);
	}

	@Patch(':id/status')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update enrollment status' })
	@ApiResponse({ status: 200, description: 'Enrollment status updated successfully' })
	updateStatus(@Param('id') id: string, @Req() req: any, @Body() updateEnrollmentStatusDto: UpdateEnrollmentStatusDto) {
		return this.enrollmentsService.updateStatus(id, req.user.id, updateEnrollmentStatusDto);
	}

	@Patch(':id/progress')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update enrollment progress' })
	@ApiResponse({ status: 200, description: 'Enrollment progress updated successfully' })
	updateProgress(@Param('id') id: string, @Req() req: any, @Body() updateEnrollmentProgressDto: UpdateEnrollmentProgressDto) {
		return this.enrollmentsService.updateProgress(id, req.user.id, updateEnrollmentProgressDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Remove an enrollment' })
	@ApiResponse({ status: 200, description: 'Enrollment removed successfully' })
	remove(@Param('id') id: string, @Req() req: any) {
		return this.enrollmentsService.remove(id, req.user.id);
	}
}
