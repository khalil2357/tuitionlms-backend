import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({ description: 'Course title', example: 'Introduction to React', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Course description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Short description', required: false })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ description: 'Course price', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ description: 'Discount price', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @ApiProperty({ description: 'Course level', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], required: false })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiProperty({ description: 'Category ID', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}
