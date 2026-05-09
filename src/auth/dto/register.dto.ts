import { IsString, IsEmail, MinLength, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {

    @ApiProperty({ description: 'User full name', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'User email address', example: 'john@example.com' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ description: 'Password (minimum 8 characters)', example: 'password123' })
    @MinLength(8)
    password: string;

    @ApiProperty({ description: 'University name', example: 'MIT', required: false })
    @IsOptional()
    @IsString()
    university?: string;

    @ApiProperty({ description: 'Education level', example: 'BACHELORS', required: false, enum: ['HIGH_SCHOOL', 'DIPLOMA', 'BACHELORS', 'MASTERS', 'PHD'] })
    @IsOptional()
    @IsString()
    educationLevel?: string;

    @ApiProperty({ description: 'Phone number', example: '1234567890', required: false })
    @IsOptional()
    @IsString()
    phone?: string;
}
