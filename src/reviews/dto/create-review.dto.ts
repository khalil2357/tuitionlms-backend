import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Course ID', example: '64a1f2b3c4d5e6f7g8h9i0j1' })
  @IsString()
  courseId!: string;

  @ApiProperty({ description: 'Review title', example: 'Great course' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Review comment', example: 'The instructor explains everything clearly.', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ description: 'Rating from 1 to 5', example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({ description: 'Reviewer user ID', example: '64a1f2b3c4d5e6f7g8h9i0j2', required: false })
  @IsOptional()
  @IsString()
  reviewerId?: string;
}