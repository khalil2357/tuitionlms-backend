import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InstructorRegisterDto {
  @ApiProperty({ description: 'Instructor full name', example: 'Jane Smith' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Instructor email address', example: 'jane@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Password (minimum 8 characters)', example: 'password123' })
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: 'Areas of expertise', example: 'React, Node.js, JavaScript', required: false })
  @IsOptional()
  @IsString()
  expertise?: string;

  @ApiProperty({ description: 'Professional bio', example: 'I have 10+ years of experience in web development', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Phone number', example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
