import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create.dto';
import { UpdateLessonDto } from './dto/update.dto';

@Injectable()
export class LessonsService {
	constructor(private prisma: PrismaService) {}

	private assertObjectId(id: string, resourceName: string) {
		if (!/^[0-9a-fA-F]{24}$/.test(id)) {
			throw new BadRequestException(`Invalid ${resourceName} id`);
		}
	}

	async create(instructorId: string, createLessonDto: CreateLessonDto) {
		this.assertObjectId(createLessonDto.courseId, 'course');
		this.assertObjectId(createLessonDto.sectionId, 'section');

		const course = await this.prisma.course.findUnique({
			where: { id: createLessonDto.courseId },
			select: { id: true, instructorId: true },
		});

		if (!course) {
			throw new NotFoundException('Course not found');
		}

		if (course.instructorId !== instructorId) {
			throw new BadRequestException('You do not have permission to add lessons to this course');
		}

		const section = await this.prisma.section.findUnique({
			where: { id: createLessonDto.sectionId },
			select: { id: true, courseId: true },
		});

		if (!section) {
			throw new NotFoundException('Section not found');
		}

		if (section.courseId !== createLessonDto.courseId) {
			throw new BadRequestException('Section does not belong to this course');
		}

		return this.prisma.lesson.create({
			data: {
				title: createLessonDto.title,
				description: createLessonDto.description,
				content: createLessonDto.content,
				videoUrl: createLessonDto.videoUrl,
				duration: createLessonDto.duration,
				order: createLessonDto.order,
				courseId: createLessonDto.courseId,
				sectionId: createLessonDto.sectionId,
				isPreview: createLessonDto.isPreview ?? false,
			},
			include: {
				course: {
					select: { id: true, title: true, slug: true },
				},
				section: {
					select: { id: true, title: true },
				},
			},
		});
	}

	async findAllByCourse(courseId: string) {
		this.assertObjectId(courseId, 'course');

		return this.prisma.lesson.findMany({
			where: { courseId },
			include: {
				section: {
					select: { id: true, title: true, order: true },
				},
				resources: true,
			},
			orderBy: { order: 'asc' },
		});
	}

	async findOne(id: string) {
		this.assertObjectId(id, 'lesson');

		const lesson = await this.prisma.lesson.findUnique({
			where: { id },
			include: {
				course: {
					select: { id: true, title: true, slug: true },
				},
				section: true,
				resources: true,
			},
		});

		if (!lesson) {
			throw new NotFoundException('Lesson not found');
		}

		return lesson;
	}

	async update(id: string, instructorId: string, updateLessonDto: UpdateLessonDto) {
		this.assertObjectId(id, 'lesson');
		if (updateLessonDto.sectionId) {
			this.assertObjectId(updateLessonDto.sectionId, 'section');
		}

		const lesson = await this.prisma.lesson.findUnique({
			where: { id },
			include: { course: true },
		});

		if (!lesson) {
			throw new NotFoundException('Lesson not found');
		}

		if (lesson.course.instructorId !== instructorId) {
			throw new BadRequestException('You do not have permission to update this lesson');
		}

		if (updateLessonDto.sectionId) {
			const section = await this.prisma.section.findUnique({
				where: { id: updateLessonDto.sectionId },
				select: { id: true, courseId: true },
			});

			if (!section) {
				throw new NotFoundException('Section not found');
			}

			if (section.courseId !== lesson.courseId) {
				throw new BadRequestException('Section does not belong to this course');
			}
		}

		return this.prisma.lesson.update({
			where: { id },
			data: {
				...updateLessonDto,
			},
			include: {
				course: {
					select: { id: true, title: true, slug: true },
				},
				section: {
					select: { id: true, title: true },
				},
			},
		});
	}

	async remove(id: string, instructorId: string) {
		this.assertObjectId(id, 'lesson');

		const lesson = await this.prisma.lesson.findUnique({
			where: { id },
			include: { course: true },
		});

		if (!lesson) {
			throw new NotFoundException('Lesson not found');
		}

		if (lesson.course.instructorId !== instructorId) {
			throw new BadRequestException('You do not have permission to delete this lesson');
		}

		return this.prisma.lesson.delete({
			where: { id },
		});
	}
}
