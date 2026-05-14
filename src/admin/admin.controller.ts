import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { ApproveInstructorDto } from './dto/approve-instructor.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Get('dashboard')
	@ApiOperation({ summary: 'Admin dashboard metrics' })
	@ApiResponse({ status: 200, description: 'Returns dashboard analytics' })
	dashboard(@Req() req: any) {
		return this.adminService.dashboard(req.user);
	}

	@Get('users')
	@ApiOperation({ summary: 'View all users' })
	findUsers(@Req() req: any) {
		return this.adminService.listUsers(req.user);
	}

	@Post('users')
	@ApiOperation({ summary: 'Create a new user' })
	createUser(@Req() req: any, @Body() body: any) {
		return this.adminService.createUser(req.user, body);
	}

	@Get('users/:id')
	@ApiOperation({ summary: 'View a user' })
	findUser(@Req() req: any, @Param('id') id: string) {
		return this.adminService.getUser(req.user, id);
	}

	@Patch('users/:id')
	@ApiOperation({ summary: 'Update a user' })
	updateUser(@Req() req: any, @Param('id') id: string, @Body() body: any) {
		return this.adminService.updateUser(req.user, id, body);
	}

	@Patch('users/:id/ban')
	@ApiOperation({ summary: 'Ban a user' })
	banUser(@Req() req: any, @Param('id') id: string) {
		return this.adminService.banUser(req.user, id);
	}

	@Patch('users/:id/suspend')
	@ApiOperation({ summary: 'Suspend a user' })
	suspendUser(@Req() req: any, @Param('id') id: string) {
		return this.adminService.suspendUser(req.user, id);
	}

	@Patch('users/:id/verify-instructor')
	@ApiOperation({ summary: 'Verify an instructor' })
	verifyInstructor(@Req() req: any, @Param('id') id: string) {
		return this.adminService.verifyInstructor(req.user, id);
	}

	@Patch('users/:id/role')
	@ApiOperation({ summary: 'Change user role' })
	changeRole(@Req() req: any, @Param('id') id: string, @Body() body: { role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' }) {
		return this.adminService.changeRole(req.user, id, body.role as any);
	}

	@Delete('users/:id')
	@ApiOperation({ summary: 'Delete a user' })
	deleteUser(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteUser(req.user, id);
	}

	@Get('courses')
	@ApiOperation({ summary: 'View all courses' })
	findCourses(@Req() req: any) {
		return this.adminService.listCourses(req.user);
	}

	@Get('courses/:id')
	@ApiOperation({ summary: 'View a course' })
	findCourse(@Req() req: any, @Param('id') id: string) {
		return this.adminService.getCourse(req.user, id);
	}

	@Post('courses')
	@ApiOperation({ summary: 'Create any course' })
	createCourse(@Req() req: any, @Body() body: any) {
		return this.adminService.createCourse(req.user, body);
	}

	@Patch('courses/:id')
	@ApiOperation({ summary: 'Update any course' })
	updateCourse(@Req() req: any, @Param('id') id: string, @Body() body: any) {
		return this.adminService.updateCourse(req.user, id, body);
	}

	@Patch('courses/:id/publish')
	@ApiOperation({ summary: 'Publish a course' })
	publishCourse(@Req() req: any, @Param('id') id: string) {
		return this.adminService.publishCourse(req.user, id);
	}

	@Patch('courses/:id/unpublish')
	@ApiOperation({ summary: 'Unpublish a course' })
	unpublishCourse(@Req() req: any, @Param('id') id: string) {
		return this.adminService.unpublishCourse(req.user, id);
	}

	@Delete('courses/:id')
	@ApiOperation({ summary: 'Delete any course' })
	deleteCourse(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteCourse(req.user, id);
	}

	@Get('lessons')
	@ApiOperation({ summary: 'View all lessons' })
	findLessons(@Req() req: any) {
		return this.adminService.listLessons(req.user);
	}

	@Get('lessons/:id')
	@ApiOperation({ summary: 'View a lesson' })
	findLesson(@Req() req: any, @Param('id') id: string) {
		return this.adminService.getLesson(req.user, id);
	}

	@Post('lessons')
	@ApiOperation({ summary: 'Create any lesson' })
	createLesson(@Req() req: any, @Body() body: any) {
		return this.adminService.createLesson(req.user, body);
	}

	@Patch('lessons/:id')
	@ApiOperation({ summary: 'Update any lesson' })
	updateLesson(@Req() req: any, @Param('id') id: string, @Body() body: any) {
		return this.adminService.updateLesson(req.user, id, body);
	}

	@Delete('lessons/:id')
	@ApiOperation({ summary: 'Delete any lesson' })
	deleteLesson(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteLesson(req.user, id);
	}

	@Post('enrollments/manual')
	manualEnroll(@Req() req: any, @Body() body: { studentId: string; courseId: string }) {
		return this.adminService.manualEnroll(req.user, body);
	}

	@Get('enrollments')
	@ApiOperation({ summary: 'View all enrollments' })
	findEnrollments(@Req() req: any) {
		return this.adminService.listEnrollments(req.user);
	}

	@Get('enrollments/:id')
	@ApiOperation({ summary: 'View an enrollment' })
	findEnrollment(@Req() req: any, @Param('id') id: string) {
		return this.adminService.getEnrollment(req.user, id);
	}

	@Patch('enrollments/:id/status')
	@ApiOperation({ summary: 'Update enrollment status' })
	updateEnrollmentStatus(@Req() req: any, @Param('id') id: string, @Body() body: { status: 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'SUSPENDED' }) {
		return this.adminService.updateEnrollmentStatus(req.user, id, body.status as any);
	}

	@Patch('enrollments/:id/progress')
	@ApiOperation({ summary: 'Update enrollment progress' })
	updateEnrollmentProgress(@Req() req: any, @Param('id') id: string, @Body() body: { progress: number }) {
		return this.adminService.updateEnrollmentProgress(req.user, id, body.progress);
	}

	@Delete('enrollments/:id')
	@ApiOperation({ summary: 'Delete an enrollment' })
	deleteEnrollment(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteEnrollment(req.user, id);
	}

	@Get('quizzes')
	@ApiOperation({ summary: 'View all quizzes' })
	findQuizzes(@Req() req: any) {
		return this.adminService.listQuizzes(req.user);
	}

	@Get('quizzes/:id')
	@ApiOperation({ summary: 'View a quiz' })
	findQuiz(@Req() req: any, @Param('id') id: string) {
		return this.adminService.getQuiz(req.user, id);
	}

	@Post('quizzes')
	@ApiOperation({ summary: 'Create any quiz' })
	createQuiz(@Req() req: any, @Body() body: any) {
		return this.adminService.createQuiz(req.user, body);
	}

	@Patch('quizzes/:id')
	@ApiOperation({ summary: 'Update any quiz' })
	updateQuiz(@Req() req: any, @Param('id') id: string, @Body() body: any) {
		return this.adminService.updateQuiz(req.user, id, body);
	}

	@Patch('quizzes/:id/publish')
	@ApiOperation({ summary: 'Publish a quiz' })
	publishQuiz(@Req() req: any, @Param('id') id: string) {
		return this.adminService.publishQuiz(req.user, id);
	}

	@Patch('quizzes/:id/unpublish')
	@ApiOperation({ summary: 'Unpublish a quiz' })
	unpublishQuiz(@Req() req: any, @Param('id') id: string) {
		return this.adminService.unpublishQuiz(req.user, id);
	}

	@Delete('quizzes/:id')
	@ApiOperation({ summary: 'Delete a quiz' })
	deleteQuiz(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteQuiz(req.user, id);
	}

	@Get('reviews')
	@ApiOperation({ summary: 'View all reviews' })
	findReviews(@Req() req: any) {
		return this.adminService.listReviews(req.user);
	}

	@Delete('reviews/:id')
	@ApiOperation({ summary: 'Delete inappropriate review' })
	deleteReview(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteReview(req.user, id);
	}

	@Get('certificates')
	@ApiOperation({ summary: 'View all certificates' })
	findCertificates(@Req() req: any) {
		return this.adminService.listCertificates(req.user);
	}

	@Get('certificates/:id')
	@ApiOperation({ summary: 'View a certificate' })
	findCertificate(@Req() req: any, @Param('id') id: string) {
		return this.adminService.getCertificate(req.user, id);
	}

	@Post('certificates')
	@ApiOperation({ summary: 'Create a certificate' })
	createCertificate(@Req() req: any, @Body() body: any) {
		return this.adminService.createCertificate(req.user, body);
	}

	@Delete('certificates/:id')
	@ApiOperation({ summary: 'Delete a certificate' })
	deleteCertificate(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteCertificate(req.user, id);
	}

	/**
	 * INSTRUCTOR REQUESTS
	 */
	@Get('instructor-requests')
	@ApiOperation({ summary: 'View all pending instructor applications' })
	@ApiResponse({ status: 200, description: 'List of instructor requests' })
	getInstructorRequests(@Req() req: any) {
		return this.adminService.getInstructorRequests(req.user);
	}

	@Get('instructor-requests/:id')
	@ApiOperation({ summary: 'View a specific instructor application' })
	@ApiResponse({ status: 200, description: 'Instructor request details' })
	getInstructorRequest(@Req() req: any, @Param('id') id: string) {
		return this.adminService.getInstructorRequest(req.user, id);
	}

	@Patch('approve-instructor/:id')
	@ApiOperation({ summary: 'Approve or reject instructor application' })
	@ApiResponse({ status: 200, description: 'Instructor request processed' })
	approveInstructor(@Req() req: any, @Param('id') id: string, @Body() body: ApproveInstructorDto) {
		return this.adminService.approveInstructor(req.user, id, body);
	}

	@Delete('instructor-requests/:id')
	@ApiOperation({ summary: 'Delete an instructor application' })
	@ApiResponse({ status: 200, description: 'Instructor request deleted' })
	deleteInstructorRequest(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteInstructorRequest(req.user, id);
	}

	/**
	 * SECTIONS
	 */
	@Get('sections')
	findSections(@Req() req: any, @Query('courseId') courseId?: string) {
		return this.adminService.listSections(req.user, courseId);
	}

	@Post('sections')
	createSection(@Req() req: any, @Body() body: any) {
		return this.adminService.createSection(req.user, body);
	}

	@Patch('sections/:id')
	updateSection(@Req() req: any, @Param('id') id: string, @Body() body: any) {
		return this.adminService.updateSection(req.user, id, body);
	}

	@Delete('sections/:id')
	deleteSection(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteSection(req.user, id);
	}

	/**
	 * QUESTIONS
	 */
	@Get('questions')
	findQuestions(@Req() req: any, @Query('quizId') quizId?: string) {
		return this.adminService.listQuestions(req.user, quizId);
	}

	@Post('questions')
	createQuestion(@Req() req: any, @Body() body: any) {
		return this.adminService.createQuestion(req.user, body);
	}

	@Patch('questions/:id')
	updateQuestion(@Req() req: any, @Param('id') id: string, @Body() body: any) {
		return this.adminService.updateQuestion(req.user, id, body);
	}

	@Delete('questions/:id')
	deleteQuestion(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteQuestion(req.user, id);
	}

	/**
	 * CATEGORIES
	 */
	@Get('categories')
	findCategories(@Req() req: any) {
		return this.adminService.listCategories(req.user);
	}

	@Post('categories')
	createCategory(@Req() req: any, @Body() body: any) {
		return this.adminService.createCategory(req.user, body);
	}

	@Patch('categories/:id')
	updateCategory(@Req() req: any, @Param('id') id: string, @Body() body: any) {
		return this.adminService.updateCategory(req.user, id, body);
	}

	@Delete('categories/:id')
	deleteCategory(@Req() req: any, @Param('id') id: string) {
		return this.adminService.deleteCategory(req.user, id);
	}
}
