import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EnrollDto {
	@ApiProperty({ description: 'Course ID to enroll in', example: '64a1f2b3c4d5e6f7g8h9i0j1' })
	@IsString()
	courseId!: string;
}

export class UpdateEnrollmentStatusDto {
	@ApiProperty({ description: 'Enrollment status', example: 'ACTIVE', enum: ['ACTIVE', 'COMPLETED', 'DROPPED', 'SUSPENDED'] })
	@IsString()
	status!: string;
}

export class UpdateEnrollmentProgressDto {
	@ApiProperty({ description: 'Progress percentage', example: 45 })
	progress!: number;
}
