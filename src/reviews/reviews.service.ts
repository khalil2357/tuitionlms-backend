import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  private assertObjectId(id: string, resourceName: string) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new BadRequestException(`Invalid ${resourceName} id`);
    }
  }

  async create(reviewerId: string, createReviewDto: CreateReviewDto) {
    this.assertObjectId(reviewerId, 'reviewer');
    this.assertObjectId(createReviewDto.courseId, 'course');

    const course = await this.prisma.course.findUnique({
      where: { id: createReviewDto.courseId },
      select: { id: true, isPublished: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const reviewer = await this.prisma.user.findUnique({
      where: { id: reviewerId },
      select: { id: true },
    });

    if (!reviewer) {
      throw new NotFoundException('User not found');
    }

    const existingReview = await this.prisma.courseReview.findUnique({
      where: {
        courseId_reviewerId: {
          courseId: createReviewDto.courseId,
          reviewerId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('You already reviewed this course');
    }

    const review = await this.prisma.courseReview.create({
      data: {
        courseId: createReviewDto.courseId,
        reviewerId,
        rating: createReviewDto.rating,
        title: createReviewDto.title,
        comment: createReviewDto.comment,
      },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        reviewer: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    await this.recalculateCourseStats(createReviewDto.courseId);

    return review;
  }

  async findAll(courseId?: string) {
    if (courseId) {
      this.assertObjectId(courseId, 'course');
    }

    return this.prisma.courseReview.findMany({
      where: courseId ? { courseId } : undefined,
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        reviewer: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async myReviews(reviewerId: string) {
    this.assertObjectId(reviewerId, 'reviewer');

    return this.prisma.courseReview.findMany({
      where: { reviewerId },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    this.assertObjectId(id, 'review');

    const review = await this.prisma.courseReview.findUnique({
      where: { id },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        reviewer: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, reviewerId: string, updateReviewDto: UpdateReviewDto) {
    this.assertObjectId(id, 'review');
    this.assertObjectId(reviewerId, 'reviewer');

    const review = await this.prisma.courseReview.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.reviewerId !== reviewerId) {
      throw new BadRequestException('You do not have permission to update this review');
    }

    const updated = await this.prisma.courseReview.update({
      where: { id },
      data: {
        rating: updateReviewDto.rating,
        title: updateReviewDto.title,
        comment: updateReviewDto.comment,
      },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
        reviewer: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    await this.recalculateCourseStats(review.courseId);

    return updated;
  }

  async remove(id: string, reviewerId: string) {
    this.assertObjectId(id, 'review');
    this.assertObjectId(reviewerId, 'reviewer');

    const review = await this.prisma.courseReview.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.reviewerId !== reviewerId) {
      throw new BadRequestException('You do not have permission to delete this review');
    }

    await this.prisma.courseReview.delete({
      where: { id },
    });

    await this.recalculateCourseStats(review.courseId);

    return { message: 'Review deleted successfully' };
  }

  async markHelpful(id: string) {
    this.assertObjectId(id, 'review');

    const review = await this.prisma.courseReview.findUnique({
      where: { id },
      select: { id: true, helpful: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.courseReview.update({
      where: { id },
      data: { helpful: review.helpful + 1 },
    });
  }

  private async recalculateCourseStats(courseId: string) {
    const reviews = await this.prisma.courseReview.findMany({
      where: { courseId },
      select: { rating: true },
    });

    const reviewCount = reviews.length;
    const rating = reviewCount > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviewCount
      : 0;

    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        rating,
        reviewCount,
      },
    });
  }
}