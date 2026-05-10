import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Recipient email address', example: 'student@example.com' })
  @IsEmail()
  to!: string;

  @ApiProperty({ description: 'Password reset URL', example: 'https://example.com/reset-password?token=abc123' })
  @IsString()
  resetLink!: string;
}
