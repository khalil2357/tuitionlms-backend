import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @ApiProperty({ description: 'Recipient email address', example: 'student@example.com' })
  @IsEmail()
  to!: string;

  @ApiProperty({ description: 'Email subject', example: 'Welcome to TuitionLMS' })
  @IsString()
  subject!: string;

  @ApiProperty({ description: 'Email text body', example: 'Thanks for joining our platform.' })
  @IsString()
  text!: string;

  @ApiProperty({ description: 'Optional HTML body', required: false, example: '<p>Thanks for joining our platform.</p>' })
  @IsOptional()
  @IsString()
  html?: string;
}
