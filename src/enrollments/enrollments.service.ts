import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollDto, UpdateEnrollmentProgressDto, UpdateEnrollmentStatusDto } from './dto/enroll.dto';

@Injectable()
export class EnrollmentsService {
	constructor(private prisma: PrismaService) {}

	private assertObjectId(id: string, resourceName: string) {
		if (!id) {
			throw new BadRequestException(`${resourceName} id is required`);
		}
	}

	async enroll(studentId: string, enrollDto: EnrollDto) {
		this.assertObjectId(studentId, 'student');
		this.assertObjectId(enrollDto.courseId, 'course');

		const course = await this.prisma.course.findUnique({
			where: { id: enrollDto.courseId },
			select: { id: true, isPublished: true },
		});

		if (!course) {
			throw new NotFoundException('Course not found');
		}

		if (!course.isPublished) {
			throw new BadRequestException('Course is not published yet');
		}

		const user = await this.prisma.user.findUnique({
			where: { id: studentId },
			select: { id: true },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const existingEnrollment = await this.prisma.enrollment.findUnique({
			where: {
				studentId_courseId: {
					studentId,
					courseId: enrollDto.courseId,
				},
			},
		});

		if (existingEnrollment) {
			throw new BadRequestException('Already enrolled in this course');
		}

		const totalLessons = await this.prisma.lesson.count({
			where: { courseId: enrollDto.courseId },
		});

		return this.prisma.enrollment.create({
			data: {
				studentId,
				courseId: enrollDto.courseId,
			},
			include: {
				student: {
					select: { id: true, name: true, email: true },
				},
				course: {
					select: { id: true, title: true, slug: true, price: true, thumbnail: true },
				},
			},
		});
	}

	async myEnrollments(studentId: string) {
		this.assertObjectId(studentId, 'student');

		return this.prisma.enrollment.findMany({
			where: { studentId },
			include: {
				course: {
					include: {
						instructor: {
							select: { id: true, name: true, email: true },
						},
						category: true,
					},
				},
			},
			orderBy: { enrolledAt: 'desc' },
		});
	}

	async courseEnrollments(courseId: string) {
		this.assertObjectId(courseId, 'course');

		return this.prisma.enrollment.findMany({
			where: { courseId },
			include: {
				student: {
					select: { id: true, name: true, email: true, avatar: true },
				},
			},
			orderBy: { enrolledAt: 'desc' },
		});
	}

	async findOne(id: string) {
		this.assertObjectId(id, 'enrollment');

		const enrollment = await this.prisma.enrollment.findUnique({
			where: { id },
			include: {
				student: {
					select: { id: true, name: true, email: true, avatar: true },
				},
				course: {
					include: {
						instructor: {
							select: { id: true, name: true, email: true },
						},
						category: true,
					},
				},
			},
		});

		if (!enrollment) {
			throw new NotFoundException('Enrollment not found');
		}

		return enrollment;
	}

	async updateStatus(id: string, studentId: string, updateEnrollmentStatusDto: UpdateEnrollmentStatusDto) {
		this.assertObjectId(id, 'enrollment');
		this.assertObjectId(studentId, 'student');

		const enrollment = await this.prisma.enrollment.findUnique({
			where: { id },
		});

		if (!enrollment) {
			throw new NotFoundException('Enrollment not found');
		}

		if (enrollment.studentId !== studentId) {
			throw new BadRequestException('You do not have permission to update this enrollment');
		}

		const status = updateEnrollmentStatusDto.status as EnrollmentStatus;

		return this.prisma.enrollment.update({
			where: { id },
			data: {
				status,
				completedAt: status === EnrollmentStatus.COMPLETED ? new Date() : null,
			},
		});
	}

	async updateProgress(id: string, studentId: string, updateEnrollmentProgressDto: UpdateEnrollmentProgressDto) {
		this.assertObjectId(id, 'enrollment');
		this.assertObjectId(studentId, 'student');

		const enrollment = await this.prisma.enrollment.findUnique({
			where: { id },
		});

		if (!enrollment) {
			throw new NotFoundException('Enrollment not found');
		}

		if (enrollment.studentId !== studentId) {
			throw new BadRequestException('You do not have permission to update this enrollment');
		}

		const progress = Math.max(0, Math.min(100, updateEnrollmentProgressDto.progress));

		return this.prisma.enrollment.update({
			where: { id },
			data: {
				progress,
				status: progress === 100 ? EnrollmentStatus.COMPLETED : enrollment.status,
				completedAt: progress === 100 ? new Date() : enrollment.completedAt,
			},
		});
	}

	async remove(id: string, studentId: string) {
		this.assertObjectId(id, 'enrollment');
		this.assertObjectId(studentId, 'student');

		const enrollment = await this.prisma.enrollment.findUnique({
			where: { id },
		});

		if (!enrollment) {
			throw new NotFoundException('Enrollment not found');
		}

		if (enrollment.studentId !== studentId) {
			throw new BadRequestException('You do not have permission to remove this enrollment');
		}

		return this.prisma.enrollment.delete({
			where: { id },
		});
	}
}
