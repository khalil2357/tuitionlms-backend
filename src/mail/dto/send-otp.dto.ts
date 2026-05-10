import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ description: 'Recipient email address', example: 'student@example.com' })
  @IsEmail()
  to!: string;

  @ApiProperty({ description: 'One-time password', example: '482913' })
  @IsString()
  otp!: string;
}
