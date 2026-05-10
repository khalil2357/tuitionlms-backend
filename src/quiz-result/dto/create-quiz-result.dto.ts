import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateQuizResultDto {
	@ApiProperty({ description: 'Quiz ID', example: '64a1f2b3c4d5e6f7g8h9i0j1' })
	@IsString()
	quizId!: string;

	@ApiProperty({ description: 'Student ID', example: '64a1f2b3c4d5e6f7g8h9i0j2', required: false })
	@IsOptional()
	@IsString()
	studentId?: string;

	@ApiProperty({ description: 'Score achieved', example: 8 })
	@IsInt()
	@Min(0)
	score!: number;

	@ApiProperty({ description: 'Percentage achieved', example: 80 })
	@IsInt()
	@Min(0)
	percentage!: number;

	@ApiProperty({ description: 'Whether the student passed', example: true })
	@IsBoolean()
	passed!: boolean;

	@ApiProperty({ description: 'Time spent in seconds', example: 600 })
	@IsInt()
	@Min(0)
	timeSpent!: number;

	@ApiProperty({ description: 'Serialized answers JSON', example: '{"1":"A","2":"C"}' })
	@IsString()
	answers!: string;
}
