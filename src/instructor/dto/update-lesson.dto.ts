import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLessonDto {
  @ApiProperty({ description: 'Lesson title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Lesson description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Lesson content', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Video URL', required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ description: 'Lesson duration in seconds', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiProperty({ description: 'Lesson order', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiProperty({ description: 'Is published', required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
