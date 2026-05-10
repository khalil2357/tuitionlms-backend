import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ApproveInstructorDto {
  @ApiProperty({ description: 'Rejection reason (only if rejecting)', example: 'Insufficient credentials', required: false })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiProperty({ description: 'Approve (true) or reject (false)', example: true })
  approve!: boolean;
}
