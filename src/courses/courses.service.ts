import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create.dto';
import { UpdateCourseDto } from './dto/update.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(instructorId: string, createCourseDto: CreateCourseDto) {
    const slug = createCourseDto.slug || createCourseDto.title.toLowerCase().replace(/\s+/g, '-');
    
    const existingCourse = await this.prisma.course.findUnique({
      where: { slug },
    });
    
    if (existingCourse) {
      throw new BadRequestException('Course slug already exists');
    }

    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        slug,
        instructorId,
        categoryId: createCourseDto.categoryId,
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true },
        },
        category: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, categoryId?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = { isPublished: true };
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
          category: true,
          _count: {
            select: { enrollments: true, sections: true, lessons: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, headline: true, avatar: true },
        },
        category: true,
        sections: {
          include: {
            lessons: {
              select: { id: true, title: true, duration: true },
            },
          },
        },
        reviews: {
          take: 5,
          include: {
            reviewer: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        _count: {
          select: { enrollments: true, reviews: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findByInstructor(instructorId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where: { instructorId },
        skip,
        take: limit,
        include: {
          category: true,
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where: { instructorId } }),
    ]);

    return {
      data: courses,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async update(id: string, instructorId: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new BadRequestException('You do not have permission to update this course');
    }

    const { categoryId, ...courseData } = updateCourseDto;

    return this.prisma.course.update({
      where: { id },
      data: {
        ...courseData,
        ...(categoryId
          ? {
              category: {
                connect: { id: categoryId },
              },
            }
          : {}),
      },
      include: {
        instructor: {
          select: { id: true, name: true },
        },
        category: true,
      },
    });
  }

  async delete(id: string, instructorId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new BadRequestException('You do not have permission to delete this course');
    }

    return this.prisma.course.delete({
      where: { id },
    });
  }

  async publish(id: string, instructorId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new BadRequestException('You do not have permission to publish this course');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  async unpublish(id: string, instructorId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== instructorId) {
      throw new BadRequestException('You do not have permission to unpublish this course');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        isPublished: false,
      },
    });
  }
  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, headline: true, avatar: true },
        },
        category: true,
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: { id: true, title: true, duration: true, type: true, isPreview: true },
            },
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        _count: {
          select: { enrollments: true, reviews: true, sections: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async listCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { courses: { where: { isPublished: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}

