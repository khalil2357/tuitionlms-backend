import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({ description: 'Registered email address', example: 'student@example.com' })
  @IsEmail()
  email!: string;
}