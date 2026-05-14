import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class UpdateProgressDto {
	lessonsCompleted?: number;
	totalLessons?: number;
	percentage?: number;
	currentLessonId?: string | null;
}

@Injectable()
export class ProgressService {
	constructor(private prisma: PrismaService) {}

	private assertObjectId(id: string, resourceName: string) {
		if (!id) {
			throw new BadRequestException(`${resourceName} id is required`);
		}
	}

	async upsert(studentId: string, courseId: string, payload: UpdateProgressDto) {
		this.assertObjectId(studentId, 'student');
		this.assertObjectId(courseId, 'course');

		const student = await this.prisma.user.findUnique({
			where: { id: studentId },
			select: { id: true },
		});

		if (!student) {
			throw new NotFoundException('User not found');
		}

		const course = await this.prisma.course.findUnique({
			where: { id: courseId },
			select: { id: true },
		});

		if (!course) {
			throw new NotFoundException('Course not found');
		}

		const totalLessons =
			payload.totalLessons ??
			(await this.prisma.lesson.count({
				where: { courseId },
			}));

		const lessonsCompleted = Math.max(0, payload.lessonsCompleted ?? 0);
		const percentage = payload.percentage ?? (totalLessons > 0 ? Math.min(100, Math.round((lessonsCompleted / totalLessons) * 100)) : 0);

		return this.prisma.courseProgress.upsert({
			where: {
				studentId_courseId: {
					studentId,
					courseId,
				},
			},
			create: {
				studentId,
				courseId,
				lessonsCompleted,
				totalLessons,
				percentage,
				currentLessonId: payload.currentLessonId ?? null,
				lastAccessedAt: new Date(),
			},
			update: {
				lessonsCompleted,
				totalLessons,
				percentage,
				currentLessonId: payload.currentLessonId ?? undefined,
				lastAccessedAt: new Date(),
			},
			include: {
				student: {
					select: { id: true, name: true, email: true },
				},
				course: {
					select: { id: true, title: true, slug: true },
				},
			},
		});
	}

	async myProgress(studentId: string) {
		this.assertObjectId(studentId, 'student');

		return this.prisma.courseProgress.findMany({
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
			orderBy: { lastAccessedAt: 'desc' },
		});
	}

	async courseProgress(courseId: string) {
		this.assertObjectId(courseId, 'course');

		return this.prisma.courseProgress.findMany({
			where: { courseId },
			include: {
				student: {
					select: { id: true, name: true, email: true, avatar: true },
				},
			},
			orderBy: { lastAccessedAt: 'desc' },
		});
	}

	async one(studentId: string, courseId: string) {
		this.assertObjectId(studentId, 'student');
		this.assertObjectId(courseId, 'course');

		const progress = await this.prisma.courseProgress.findUnique({
			where: {
				studentId_courseId: {
					studentId,
					courseId,
				},
			},
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

		if (!progress) {
			throw new NotFoundException('Progress not found');
		}

		return progress;
	}

	async remove(studentId: string, courseId: string) {
		this.assertObjectId(studentId, 'student');
		this.assertObjectId(courseId, 'course');

		return this.prisma.courseProgress.delete({
			where: {
				studentId_courseId: {
					studentId,
					courseId,
				},
			},
		});
	}
}
