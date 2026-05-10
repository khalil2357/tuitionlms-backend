import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateLessonDto {
	@ApiProperty({ description: 'Lesson title', example: 'Introduction to React' })
	@IsString()
	title!: string;

	@ApiProperty({ description: 'Lesson description', example: 'What you will learn in this lesson', required: false })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({ description: 'Lesson content', example: 'Full lesson content in markdown or HTML' })
	@IsString()
	content!: string;

	@ApiProperty({ description: 'Video URL', example: 'https://example.com/video.mp4', required: false })
	@IsOptional()
	@IsString()
	videoUrl?: string;

	@ApiProperty({ description: 'Lesson duration in seconds', example: 900, required: false })
	@IsOptional()
	@IsInt()
	@Min(0)
	duration?: number;

	@ApiProperty({ description: 'Lesson order inside the course', example: 1 })
	@IsInt()
	@Min(1)
	order!: number;

	@ApiProperty({ description: 'Course ID', example: '64a1f2b3c4d5e6f7g8h9i0j1' })
	@IsString()
	courseId!: string;

	@ApiProperty({ description: 'Section ID', example: '64a1f2b3c4d5e6f7g8h9i0j2' })
	@IsString()
	sectionId!: string;

	@ApiProperty({ description: 'Whether this is a preview lesson', example: false, required: false })
	@IsOptional()
	@IsBoolean()
	isPreview?: boolean;
}
