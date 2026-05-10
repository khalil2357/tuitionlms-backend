import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { IsString, IsNumber, IsOptional, Min, IsEnum } from 'class-validator';

export class UpdateCourseDto {
  @ApiProperty({ description: 'Course title', required: false })
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

  @ApiProperty({ description: 'Currency', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Course level', required: false })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiProperty({ description: 'Course language', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}
