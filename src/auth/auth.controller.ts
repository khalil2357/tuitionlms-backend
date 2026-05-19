import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InstructorRegisterDto } from './dto/instructor-register.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { VerifyForgotPasswordOtpDto } from './dto/verify-forgot-password-otp.dto';
import { ResetForgotPasswordDto } from './dto/reset-forgot-password.dto';

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

    @Post('forgot-password/request-otp')
    @ApiOperation({ summary: 'Send password reset OTP' })
    @ApiResponse({ status: 201, description: 'OTP sent successfully' })
    async requestForgotPasswordOtp(
        @Body(new ValidationPipe({ whitelist: true, transform: true })) body: ForgotPasswordRequestDto,
    ) {
        return this.authService.sendPasswordResetOtp(body.email);
    }

    @Post('forgot-password/verify-otp')
    @ApiOperation({ summary: 'Verify password reset OTP' })
    @ApiResponse({ status: 200, description: 'OTP verified successfully' })
    async verifyForgotPasswordOtp(
        @Body(new ValidationPipe({ whitelist: true, transform: true })) body: VerifyForgotPasswordOtpDto,
    ) {
        return this.authService.verifyPasswordResetOtp(body.email, body.otp);
    }

    @Post('forgot-password/reset')
    @ApiOperation({ summary: 'Reset password using verified OTP' })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    async resetForgotPassword(
        @Body(new ValidationPipe({ whitelist: true, transform: true })) body: ResetForgotPasswordDto,
    ) {
        return this.authService.resetPassword(body.email, body.otp, body.newPassword);
    }
}
