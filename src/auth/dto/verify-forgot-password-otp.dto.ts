import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyForgotPasswordOtpDto {
  @ApiProperty({ description: 'Registered email address', example: 'student@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: '6 digit OTP', example: '482913' })
  @IsString()
  @Length(6, 6)
  otp!: string;
}