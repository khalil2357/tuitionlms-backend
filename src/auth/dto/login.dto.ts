import { IsEmail, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {

    @ApiProperty({ description: 'User email address', example: 'john@example.com' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ description: 'User password (minimum 8 characters)', example: 'password123' })
    @MinLength(8)
    password: string;
}
