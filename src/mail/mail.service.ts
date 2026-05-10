import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: 'jefferey.wilkinson@ethereal.email',
		pass: 'h9CqsBSepms1rUxnrg',
	},
});

@Injectable()
export class MailService {
	async sendMail(payload: SendMailDto) {
		const info = await transporter.sendMail({
			from: '"TuitionLMS" <no-reply@tuitionlms.com>',
			to: payload.to,
			subject: payload.subject,
			text: payload.text,
			html: payload.html,
		});

		return {
			message: 'Email sent successfully',
			messageId: info.messageId,
			previewUrl: nodemailer.getTestMessageUrl(info),
		};
	}

	async sendOtp(payload: SendOtpDto) {
		const info = await transporter.sendMail({
			from: '"TuitionLMS" <no-reply@tuitionlms.com>',
			to: payload.to,
			subject: 'Your TuitionLMS OTP',
			text: `Your OTP is ${payload.otp}`,
			html: `<p>Your OTP is <strong>${payload.otp}</strong></p>`,
		});

		return {
			message: 'OTP email sent successfully',
			messageId: info.messageId,
			previewUrl: nodemailer.getTestMessageUrl(info),
		};
	}

	async sendResetPassword(payload: ResetPasswordDto) {
		const info = await transporter.sendMail({
			from: '"TuitionLMS" <no-reply@tuitionlms.com>',
			to: payload.to,
			subject: 'Reset your TuitionLMS password',
			text: `Reset your password using this link: ${payload.resetLink}`,
			html: `<p>Reset your password using this link:</p><p><a href="${payload.resetLink}">${payload.resetLink}</a></p>`,
		});

		return {
			message: 'Reset password email sent successfully',
			messageId: info.messageId,
			previewUrl: nodemailer.getTestMessageUrl(info),
		};
	}
}
