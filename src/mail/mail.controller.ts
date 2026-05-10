import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@Post('send-mail')
	@ApiOperation({ summary: 'Send a custom email' })
	@ApiResponse({ status: 201, description: 'Email sent successfully' })
	sendMail(@Body() payload: SendMailDto) {
		return this.mailService.sendMail(payload);
	}

	@Post('otp')
	@ApiOperation({ summary: 'Send an OTP email' })
	@ApiResponse({ status: 201, description: 'OTP email sent successfully' })
	sendOtp(@Body() payload: SendOtpDto) {
		return this.mailService.sendOtp(payload);
	}

	@Post('reset-password')
	@ApiOperation({ summary: 'Send a password reset email' })
	@ApiResponse({ status: 201, description: 'Reset password email sent successfully' })
	sendResetPassword(@Body() payload: ResetPasswordDto) {
		return this.mailService.sendResetPassword(payload);
	}
}
