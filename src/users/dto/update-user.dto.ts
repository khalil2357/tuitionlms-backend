import { ApiOAuth2} from "@nestjs/swagger";
import { EducationLevel } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsOptional } from "class-validator/types/decorator/common/IsOptional";
export class UpdateUserDto {
    
    @ApiProperty({ description: 'User full name', example: 'John Doe', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'University name', example: 'MIT', required: false })
    @IsOptional()
    @IsString()
    university?: string;

    @ApiProperty({ description: 'Education level', example: 'BACHELORS', required: false, enum: ['HIGH_SCHOOL', 'DIPLOMA', 'BACHELORS', 'MASTERS', 'PHD'] })
    @IsOptional()
    @IsString()
    educationLevel?: EducationLevel;

    @ApiProperty({description: 'Avatar URL', example: 'https://example.com/avatar.jpg', required: false})
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ description: 'Phone number', example: '1234567890', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({description: 'Bio or description about the user', example: 'I am a student at MIT studying Computer Science.', required: false})
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiProperty({description:'Headeline or title for the user profile', example: 'Computer Science Student at MIT', required: false})
    @IsOptional()
    @IsString()
    headline?: string;

}