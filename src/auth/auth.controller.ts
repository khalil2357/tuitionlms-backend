import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InstructorRegisterDto } from './dto/instructor-register.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    @ApiOperation({ summary: 'Register a new student' })
    @ApiResponse({ status: 201, description: 'Student registered successfully' })
    async register(@Body() body: RegisterDto){
        return this.authService.register(body);
    }

    @Post('instructor-register')
    @ApiOperation({ summary: 'Apply to become an instructor (requires admin approval)' })
    @ApiResponse({ status: 201, description: 'Instructor application submitted, pending approval' })
    async instructorRegister(@Body() body: InstructorRegisterDto){
        return this.authService.registerInstructor(body);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful, returns access token' })
    async login(@Body() body: LoginDto){
        return this.authService.login(body);
    }
}
