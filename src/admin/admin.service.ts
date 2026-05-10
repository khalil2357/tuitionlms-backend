import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentStatus, CourseLevel, CourseStatus, Role, QuestionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
	constructor(private prisma: PrismaService) {}

	private assertAdmin(actor: { role?: string }) {
		if (actor?.role !== 'ADMIN') {
			throw new ForbiddenException('Admin access required');
		}
	}

	private assertObjectId(id: string, resourceName: string) {
		if (!/^[0-9a-fA-F]{24}$/.test(id)) {
			throw new BadRequestException(`Invalid ${resourceName} id`);
		}
	}

	private slugify(value: string) {
		return value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	private async ensureUserExists(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: { id: true },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}
	}

	private async ensureCourseExists(courseId: string) {
		const course = await this.prisma.course.findUnique({
			where: { id: courseId },
			select: { id: true },
		});

		if (!course) {
			throw new NotFoundException('Course not found');
		}
	}

	private async ensureQuizExists(quizId: string) {
		const quiz = await this.prisma.quiz.findUnique({
			where: { id: quizId },
			select: { id: true },
		});

		if (!quiz) {
			throw new NotFoundException('Quiz not found');
		}
	}

	private async ensureLessonExists(lessonId: string) {
		const lesson = await this.prisma.lesson.findUnique({
			where: { id: lessonId },
			select: { id: true },
		});

		if (!lesson) {
			throw new NotFoundException('Lesson not found');
		}
	}

	private async ensureReviewExists(reviewId: string) {
		const review = await this.prisma.courseReview.findUnique({
			where: { id: reviewId },
			select: { id: true },
		});

		if (!review) {
			throw new NotFoundException('Review not found');
		}
	}

	private async ensureCertificateExists(certificateId: string) {
		const certificate = await this.prisma.certificate.findUnique({
			where: { id: certificateId },
			select: { id: true },
		});

		if (!certificate) {
			throw new NotFoundException('Certificate not found');
		}
	}

	async dashboard(actor: { role?: string }) {
		this.assertAdmin(actor);

		const [
			totalUsers,
			totalCourses,
			totalLessons,
			totalEnrollments,
			totalQuizzes,
			totalQuizResults,
			totalReviews,
			totalCertificates,
			activeUsers,
			verifiedInstructors,
			publishedCourses,
			completedEnrollments,
			activeEnrollments,
			draftCourses,
			archivedCourses,
			revenuesEnrollments,
		] = await Promise.all([
			this.prisma.user.count(),
			this.prisma.course.count(),
			this.prisma.lesson.count(),
			this.prisma.enrollment.count(),
			this.prisma.quiz.count(),
			this.prisma.quizResult.count(),
			this.prisma.courseReview.count(),
			this.prisma.certificate.count(),
			this.prisma.user.count({ where: { isActive: true } }),
			this.prisma.user.count({ where: { role: Role.INSTRUCTOR, isVerified: true } }),
			this.prisma.course.count({ where: { isPublished: true } }),
			this.prisma.enrollment.count({ where: { status: EnrollmentStatus.COMPLETED } }),
			this.prisma.enrollment.count({ where: { status: EnrollmentStatus.ACTIVE } }),
			this.prisma.course.count({ where: { status: CourseStatus.DRAFT } }),
			this.prisma.course.count({ where: { status: CourseStatus.ARCHIVED } }),
			this.prisma.enrollment.findMany({
				include: {
					course: { select: { price: true } },
				},
			}),
		]);

		const revenue = revenuesEnrollments.reduce((sum, enrollment) => sum + Number(enrollment.course.price ?? 0), 0);

		return {
			totalUsers,
			totalCourses,
			totalLessons,
			totalEnrollments,
			totalQuizzes,
			totalQuizResults,
			totalReviews,
			totalCertificates,
			activeUsers,
			verifiedInstructors,
			publishedCourses,
			draftCourses,
			archivedCourses,
			activeEnrollments,
			completedEnrollments,
			revenue,
		};
	}

	async listUsers(actor: { role?: string }) {
		this.assertAdmin(actor);

		return this.prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				university: true,
				educationLevel: true,
				avatar: true,
				phone: true,
				bio: true,
				headline: true,
				isActive: true,
				isVerified: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	async getUser(actor: { role?: string }, userId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(userId, 'user');
		await this.ensureUserExists(userId);

		return this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				university: true,
				educationLevel: true,
				avatar: true,
				phone: true,
				bio: true,
				headline: true,
				isActive: true,
				isVerified: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	async updateUser(actor: { role?: string }, userId: string, payload: any) {
		this.assertAdmin(actor);
		this.assertObjectId(userId, 'user');
		await this.ensureUserExists(userId);

		return this.prisma.user.update({
			where: { id: userId },
			data: {
				name: payload.name,
				email: payload.email,
				role: payload.role,
				university: payload.university,
				educationLevel: payload.educationLevel,
				avatar: payload.avatar,
				phone: payload.phone,
				bio: payload.bio,
				headline: payload.headline,
				isActive: payload.isActive,
				isVerified: payload.isVerified,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				university: true,
				educationLevel: true,
				avatar: true,
				phone: true,
				bio: true,
				headline: true,
				isActive: true,
				isVerified: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	async banUser(actor: { role?: string }, userId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(userId, 'user');
		await this.ensureUserExists(userId);

		return this.prisma.user.update({
			where: { id: userId },
			data: { isActive: false },
		});
	}

	async suspendUser(actor: { role?: string }, userId: string) {
		return this.banUser(actor, userId);
	}

	async verifyInstructor(actor: { role?: string }, userId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(userId, 'user');
		await this.ensureUserExists(userId);

		return this.prisma.user.update({
			where: { id: userId },
			data: {
				role: Role.INSTRUCTOR,
				isVerified: true,
			},
		});
	}

	async changeRole(actor: { role?: string }, userId: string, role: Role) {
		this.assertAdmin(actor);
		this.assertObjectId(userId, 'user');
		await this.ensureUserExists(userId);

		return this.prisma.user.update({
			where: { id: userId },
			data: { role },
		});
	}

	async deleteUser(actor: { role?: string }, userId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(userId, 'user');
		await this.ensureUserExists(userId);

		return this.prisma.user.delete({ where: { id: userId } });
	}

	async listCourses(actor: { role?: string }) {
		this.assertAdmin(actor);

		return this.prisma.course.findMany({
			include: {
				instructor: { select: { id: true, name: true, email: true } },
				category: true,
				_count: {
					select: { enrollments: true, lessons: true, quizzes: true, reviews: true, sections: true },
				},
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	async getCourse(actor: { role?: string }, courseId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(courseId, 'course');
		await this.ensureCourseExists(courseId);

		return this.prisma.course.findUnique({
			where: { id: courseId },
			include: {
				instructor: { select: { id: true, name: true, email: true, avatar: true } },
				category: true,
				sections: true,
				lessons: true,
				quizzes: true,
				reviews: true,
				enrollments: true,
			},
		});
	}

	async createCourse(actor: { role?: string }, payload: any) {
		this.assertAdmin(actor);

		this.assertObjectId(payload.instructorId, 'instructor');
		this.assertObjectId(payload.categoryId, 'category');
		await this.ensureUserExists(payload.instructorId);

		const category = await this.prisma.category.findUnique({
			where: { id: payload.categoryId },
			select: { id: true },
		});

		if (!category) {
			throw new NotFoundException('Category not found');
		}

		const slug = payload.slug || this.slugify(payload.title);
		const existing = await this.prisma.course.findUnique({ where: { slug } });

		if (existing) {
			throw new BadRequestException('Course slug already exists');
		}

		return this.prisma.course.create({
			data: {
				title: payload.title,
				description: payload.description,
				shortDescription: payload.shortDescription,
				slug,
				instructorId: payload.instructorId,
				categoryId: payload.categoryId,
				thumbnail: payload.thumbnail,
				price: payload.price,
				discountPrice: payload.discountPrice,
				currency: payload.currency ?? 'USD',
				level: payload.level ?? CourseLevel.BEGINNER,
				status: payload.status ?? CourseStatus.DRAFT,
				language: payload.language ?? 'en',
				isPublished: payload.isPublished ?? false,
				publishedAt: payload.isPublished ? new Date() : undefined,
			},
			include: {
				instructor: { select: { id: true, name: true, email: true } },
				category: true,
			},
		});
	}

	async updateCourse(actor: { role?: string }, courseId: string, payload: any) {
		this.assertAdmin(actor);
		this.assertObjectId(courseId, 'course');
		await this.ensureCourseExists(courseId);

		if (payload.instructorId) {
			this.assertObjectId(payload.instructorId, 'instructor');
			await this.ensureUserExists(payload.instructorId);
		}

		if (payload.categoryId) {
			this.assertObjectId(payload.categoryId, 'category');
			const category = await this.prisma.category.findUnique({
				where: { id: payload.categoryId },
				select: { id: true },
			});

			if (!category) {
				throw new NotFoundException('Category not found');
			}
		}

		if (payload.slug) {
			const existing = await this.prisma.course.findUnique({ where: { slug: payload.slug } });
			if (existing && existing.id !== courseId) {
				throw new BadRequestException('Course slug already exists');
			}
		}

		const data: any = {
			title: payload.title,
			description: payload.description,
			shortDescription: payload.shortDescription,
			slug: payload.slug,
			instructorId: payload.instructorId,
			categoryId: payload.categoryId,
			thumbnail: payload.thumbnail,
			price: payload.price,
			discountPrice: payload.discountPrice,
			currency: payload.currency,
			level: payload.level,
			status: payload.status,
			language: payload.language,
			isPublished: payload.isPublished,
			publishedAt: payload.isPublished === true ? new Date() : payload.isPublished === false ? null : undefined,
		};

		Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

		return this.prisma.course.update({
			where: { id: courseId },
			data,
			include: {
				instructor: { select: { id: true, name: true, email: true } },
				category: true,
			},
		});
	}

	async publishCourse(actor: { role?: string }, courseId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(courseId, 'course');
		await this.ensureCourseExists(courseId);

		return this.prisma.course.update({
			where: { id: courseId },
			data: { isPublished: true, publishedAt: new Date(), status: CourseStatus.PUBLISHED },
		});
	}

	async unpublishCourse(actor: { role?: string }, courseId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(courseId, 'course');
		await this.ensureCourseExists(courseId);

		return this.prisma.course.update({
			where: { id: courseId },
			data: { isPublished: false, status: CourseStatus.DRAFT },
		});
	}

	async deleteCourse(actor: { role?: string }, courseId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(courseId, 'course');
		await this.ensureCourseExists(courseId);

		return this.prisma.course.delete({ where: { id: courseId } });
	}

	async listLessons(actor: { role?: string }) {
		this.assertAdmin(actor);

		return this.prisma.lesson.findMany({
			include: {
				course: { select: { id: true, title: true, slug: true } },
				section: { select: { id: true, title: true, order: true } },
				resources: true,
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	async getLesson(actor: { role?: string }, lessonId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(lessonId, 'lesson');
		await this.ensureLessonExists(lessonId);

		return this.prisma.lesson.findUnique({
			where: { id: lessonId },
			include: {
				course: { select: { id: true, title: true, slug: true } },
				section: true,
				resources: true,
			},
		});
	}

	async createLesson(actor: { role?: string }, payload: any) {
		this.assertAdmin(actor);

		this.assertObjectId(payload.courseId, 'course');
		this.assertObjectId(payload.sectionId, 'section');
		await this.ensureCourseExists(payload.courseId);

		const section = await this.prisma.section.findUnique({
			where: { id: payload.sectionId },
			select: { id: true, courseId: true },
		});

		if (!section) {
			throw new NotFoundException('Section not found');
		}

		if (section.courseId !== payload.courseId) {
			throw new BadRequestException('Section does not belong to this course');
		}

		return this.prisma.lesson.create({
			data: {
				title: payload.title,
				description: payload.description,
				content: payload.content,
				videoUrl: payload.videoUrl,
				duration: payload.duration,
				order: payload.order,
				courseId: payload.courseId,
				sectionId: payload.sectionId,
				isPreview: payload.isPreview ?? false,
			},
			include: {
				course: { select: { id: true, title: true, slug: true } },
				section: { select: { id: true, title: true } },
			},
		});
	}

	async updateLesson(actor: { role?: string }, lessonId: string, payload: any) {
		this.assertAdmin(actor);
		this.assertObjectId(lessonId, 'lesson');
		await this.ensureLessonExists(lessonId);

		const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });

		if (!lesson) {
			throw new NotFoundException('Lesson not found');
		}

		if (payload.sectionId) {
			this.assertObjectId(payload.sectionId, 'section');
			const section = await this.prisma.section.findUnique({
				where: { id: payload.sectionId },
				select: { id: true, courseId: true },
			});

			if (!section) {
				throw new NotFoundException('Section not found');
			}

			if (section.courseId !== lesson.courseId) {
				throw new BadRequestException('Section does not belong to this course');
			}
		}

		const data: any = {
			title: payload.title,
			description: payload.description,
			content: payload.content,
			videoUrl: payload.videoUrl,
			duration: payload.duration,
			order: payload.order,
			sectionId: payload.sectionId,
			isPreview: payload.isPreview,
		};

		Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

		return this.prisma.lesson.update({
			where: { id: lessonId },
			data,
			include: {
				course: { select: { id: true, title: true, slug: true } },
				section: { select: { id: true, title: true } },
			},
		});
	}

	async deleteLesson(actor: { role?: string }, lessonId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(lessonId, 'lesson');
		await this.ensureLessonExists(lessonId);

		return this.prisma.lesson.delete({ where: { id: lessonId } });
	}

	async listEnrollments(actor: { role?: string }) {
		this.assertAdmin(actor);

		return this.prisma.enrollment.findMany({
			include: {
				student: { select: { id: true, name: true, email: true, avatar: true } },
				course: {
					include: {
						instructor: { select: { id: true, name: true, email: true } },
						category: true,
					},
				},
			},
			orderBy: { enrolledAt: 'desc' },
		});
	}

	async getEnrollment(actor: { role?: string }, enrollmentId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(enrollmentId, 'enrollment');

		const enrollment = await this.prisma.enrollment.findUnique({
			where: { id: enrollmentId },
			include: {
				student: { select: { id: true, name: true, email: true, avatar: true } },
				course: true,
			},
		});

		if (!enrollment) {
			throw new NotFoundException('Enrollment not found');
		}

		return enrollment;
	}

	async updateEnrollmentStatus(actor: { role?: string }, enrollmentId: string, status: EnrollmentStatus) {
		this.assertAdmin(actor);
		this.assertObjectId(enrollmentId, 'enrollment');

		const enrollment = await this.prisma.enrollment.findUnique({ where: { id: enrollmentId } });

		if (!enrollment) {
			throw new NotFoundException('Enrollment not found');
		}

		return this.prisma.enrollment.update({
			where: { id: enrollmentId },
			data: {
				status,
				completedAt: status === EnrollmentStatus.COMPLETED ? new Date() : null,
			},
		});
	}

	async updateEnrollmentProgress(actor: { role?: string }, enrollmentId: string, progress: number) {
		this.assertAdmin(actor);
		this.assertObjectId(enrollmentId, 'enrollment');

		const enrollment = await this.prisma.enrollment.findUnique({ where: { id: enrollmentId } });

		if (!enrollment) {
			throw new NotFoundException('Enrollment not found');
		}

		const safeProgress = Math.max(0, Math.min(100, Number(progress)));

		return this.prisma.enrollment.update({
			where: { id: enrollmentId },
			data: {
				progress: safeProgress,
				status: safeProgress === 100 ? EnrollmentStatus.COMPLETED : enrollment.status,
				completedAt: safeProgress === 100 ? new Date() : enrollment.completedAt,
			},
		});
	}

	async deleteEnrollment(actor: { role?: string }, enrollmentId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(enrollmentId, 'enrollment');

		const enrollment = await this.prisma.enrollment.findUnique({ where: { id: enrollmentId } });

		if (!enrollment) {
			throw new NotFoundException('Enrollment not found');
		}

		return this.prisma.enrollment.delete({ where: { id: enrollmentId } });
	}

	async listQuizzes(actor: { role?: string }) {
		this.assertAdmin(actor);

		return this.prisma.quiz.findMany({
			include: {
				course: { select: { id: true, title: true, slug: true } },
				_count: { select: { questions: true, results: true } },
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	async getQuiz(actor: { role?: string }, quizId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(quizId, 'quiz');
		await this.ensureQuizExists(quizId);

		return this.prisma.quiz.findUnique({
			where: { id: quizId },
			include: {
				course: { select: { id: true, title: true, slug: true } },
				questions: { include: { options: true }, orderBy: { order: 'asc' } },
				results: true,
			},
		});
	}

	async createQuiz(actor: { role?: string }, payload: any) {
		this.assertAdmin(actor);
		this.assertObjectId(payload.courseId, 'course');
		await this.ensureCourseExists(payload.courseId);

		return this.prisma.quiz.create({
			data: {
				title: payload.title,
				description: payload.description,
				courseId: payload.courseId,
				passingScore: payload.passingScore ?? 70,
				timeLimit: payload.timeLimit,
				shuffleQuestions: payload.shuffleQuestions ?? false,
				showCorrectAnswers: payload.showCorrectAnswers ?? true,
				isPublished: payload.isPublished ?? false,
			},
			include: {
				course: { select: { id: true, title: true, slug: true } },
			},
		});
	}

	async updateQuiz(actor: { role?: string }, quizId: string, payload: any) {
		this.assertAdmin(actor);
		this.assertObjectId(quizId, 'quiz');
		await this.ensureQuizExists(quizId);

		if (payload.courseId) {
			this.assertObjectId(payload.courseId, 'course');
			await this.ensureCourseExists(payload.courseId);
		}

		const data: any = {
			title: payload.title,
			description: payload.description,
			courseId: payload.courseId,
			passingScore: payload.passingScore,
			timeLimit: payload.timeLimit,
			shuffleQuestions: payload.shuffleQuestions,
			showCorrectAnswers: payload.showCorrectAnswers,
			isPublished: payload.isPublished,
		};

		Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

		return this.prisma.quiz.update({
			where: { id: quizId },
			data,
			include: {
				course: { select: { id: true, title: true, slug: true } },
			},
		});
	}

	async publishQuiz(actor: { role?: string }, quizId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(quizId, 'quiz');
		await this.ensureQuizExists(quizId);

		return this.prisma.quiz.update({
			where: { id: quizId },
			data: { isPublished: true },
		});
	}

	async unpublishQuiz(actor: { role?: string }, quizId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(quizId, 'quiz');
		await this.ensureQuizExists(quizId);

		return this.prisma.quiz.update({
			where: { id: quizId },
			data: { isPublished: false },
		});
	}

	async deleteQuiz(actor: { role?: string }, quizId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(quizId, 'quiz');
		await this.ensureQuizExists(quizId);

		return this.prisma.quiz.delete({ where: { id: quizId } });
	}

	async listReviews(actor: { role?: string }) {
		this.assertAdmin(actor);

		return this.prisma.courseReview.findMany({
			include: {
				course: { select: { id: true, title: true, slug: true } },
				reviewer: { select: { id: true, name: true, email: true, avatar: true } },
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	async deleteReview(actor: { role?: string }, reviewId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(reviewId, 'review');
		await this.ensureReviewExists(reviewId);

		return this.prisma.courseReview.delete({ where: { id: reviewId } });
	}

	async listCertificates(actor: { role?: string }) {
		this.assertAdmin(actor);

		return this.prisma.certificate.findMany({
			include: {
				student: { select: { id: true, name: true, email: true, avatar: true } },
			},
			orderBy: { issuedAt: 'desc' },
		});
	}

	async getCertificate(actor: { role?: string }, certificateId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(certificateId, 'certificate');
		await this.ensureCertificateExists(certificateId);

		return this.prisma.certificate.findUnique({
			where: { id: certificateId },
			include: {
				student: { select: { id: true, name: true, email: true, avatar: true } },
			},
		});
	}

	async createCertificate(actor: { role?: string }, payload: any) {
		this.assertAdmin(actor);
		this.assertObjectId(payload.studentId, 'student');
		await this.ensureUserExists(payload.studentId);

		return this.prisma.certificate.create({
			data: {
				studentId: payload.studentId,
				courseName: payload.courseName,
				certificateUrl: payload.certificateUrl,
			},
			include: {
				student: { select: { id: true, name: true, email: true, avatar: true } },
			},
		});
	}

	async deleteCertificate(actor: { role?: string }, certificateId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(certificateId, 'certificate');
		await this.ensureCertificateExists(certificateId);

		return this.prisma.certificate.delete({ where: { id: certificateId } });
	}

	/**
	 * INSTRUCTOR REQUESTS
	 */
	async getInstructorRequests(actor: { role?: string }) {
		this.assertAdmin(actor);

		return this.prisma.instructorRequest.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				expertise: true,
				bio: true,
				phoneNumber: true,
				status: true,
				createdAt: true,
				approvedAt: true,
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	async getInstructorRequest(actor: { role?: string }, requestId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(requestId, 'instructor request');

		const request = await this.prisma.instructorRequest.findUnique({
			where: { id: requestId },
			select: {
				id: true,
				email: true,
				name: true,
				expertise: true,
				bio: true,
				phoneNumber: true,
				status: true,
				rejectionReason: true,
				createdAt: true,
				approvedAt: true,
			},
		});

		if (!request) {
			throw new NotFoundException('Instructor request not found');
		}

		return request;
	}

	async approveInstructor(actor: any, requestId: string, data: any) {
		this.assertAdmin(actor);
		this.assertObjectId(requestId, 'instructor request');

		const request = await this.prisma.instructorRequest.findUnique({
			where: { id: requestId },
		});

		if (!request) {
			throw new NotFoundException('Instructor request not found');
		}

		if (request.status !== 'PENDING') {
			throw new BadRequestException('This request has already been processed');
		}

		if (data.approve) {
			// Create user as instructor
			const user = await this.prisma.user.create({
				data: {
					email: request.email,
					password: request.password,
					name: request.name,
					role: 'INSTRUCTOR',
					phone: request.phoneNumber,
					bio: request.bio,
					headline: request.expertise,
					isVerified: true,
				},
			});

			// Update request status to approved
			await this.prisma.instructorRequest.update({
				where: { id: requestId },
				data: {
					status: 'APPROVED',
					approvedAt: new Date(),
					approvedBy: actor.sub || null,
				},
			});

			return {
				message: 'Instructor approved and account created',
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				},
			};
		} else {
			// Reject request
			await this.prisma.instructorRequest.update({
				where: { id: requestId },
				data: {
					status: 'REJECTED',
					rejectionReason: data.rejectionReason || 'Application rejected by admin',
				},
			});

			return {
				message: 'Instructor application rejected',
				requestId,
				rejectionReason: data.rejectionReason,
			};
		}
	}

	async deleteInstructorRequest(actor: { role?: string }, requestId: string) {
		this.assertAdmin(actor);
		this.assertObjectId(requestId, 'instructor request');

		const request = await this.prisma.instructorRequest.findUnique({
			where: { id: requestId },
			select: { id: true },
		});

		if (!request) {
			throw new NotFoundException('Instructor request not found');
		}

		return this.prisma.instructorRequest.delete({ where: { id: requestId } });
	}
}
