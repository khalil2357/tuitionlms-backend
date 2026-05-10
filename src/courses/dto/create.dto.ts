import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course title', example: 'Introduction to React' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Course description', example: 'Learn React from scratch' })
  @IsString()
  description!: string;

  @ApiProperty({ description: 'Short description', example: 'React basics', required: false })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ description: 'Course slug', example: 'intro-to-react', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'Category ID', example: '64a1f2b3c4d5e6f7g8h9i0j1' })
  @IsString()
  categoryId!: string;

  @ApiProperty({ description: 'Course price', example: 99.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ description: 'Discount price', example: 79.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @ApiProperty({ description: 'Currency', example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Course level', example: 'BEGINNER', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], required: false })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiProperty({ description: 'Course language', example: 'en', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: 'Thumbnail URL', example: 'https://example.com/thumb.jpg', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}
