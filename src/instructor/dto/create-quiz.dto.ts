import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ description: 'Quiz title', example: 'React Fundamentals Quiz' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Quiz description', example: 'Test your understanding of React basics', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Passing score percentage', example: 70, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  passingScore?: number;

  @ApiProperty({ description: 'Time limit in minutes', example: 20, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  timeLimit?: number;

  @ApiProperty({ description: 'Shuffle questions', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean;

  @ApiProperty({ description: 'Show correct answers after submission', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  showCorrectAnswers?: boolean;

  @ApiProperty({ description: 'Publish quiz immediately', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
