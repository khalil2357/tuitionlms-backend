import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    async register(@Body() body: RegisterDto){
        return this.authService.register(body);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful, returns access token' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() body: LoginDto){
        return this.authService.login(body);
    }
}
