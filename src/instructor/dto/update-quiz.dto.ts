import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateQuizDto {
  @ApiProperty({ description: 'Quiz title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Quiz description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Passing score percentage', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  passingScore?: number;

  @ApiProperty({ description: 'Time limit in minutes', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  timeLimit?: number;

  @ApiProperty({ description: 'Shuffle questions', required: false })
  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean;

  @ApiProperty({ description: 'Show correct answers after submission', required: false })
  @IsOptional()
  @IsBoolean()
  showCorrectAnswers?: boolean;

  @ApiProperty({ description: 'Publish quiz', required: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
