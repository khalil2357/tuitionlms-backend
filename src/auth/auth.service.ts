import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { randomInt } from 'crypto';

type PasswordResetRecord = {
  otp: string;
  expiresAt: number;
};

@Injectable()
export class AuthService {
  private readonly passwordResetOtps = new Map<string, PasswordResetRecord>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async register(data: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        university: data.university,
        educationLevel: data.educationLevel,
        phone: data.phone,
        role: 'STUDENT',
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async registerInstructor(data: any) {
    const existingRequest = await this.prisma.instructorRequest.findUnique({
      where: { email: data.email },
    });

    if (existingRequest) {
      throw new ConflictException('Instructor request already exists');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const request = await this.prisma.instructorRequest.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        expertise: data.expertise,
        bio: data.bio,
        phoneNumber: data.phoneNumber,
        status: 'PENDING',
      },
    });

    const { password, ...result } = request;

    return {
      ...result,
      message: 'Instructor request submitted successfully',
    };
  }

  async login(data: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...result } = user;

    return {
      access_token: token,
      user: result,
    };
  }

  async sendPasswordResetOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = String(randomInt(100000, 999999));
    this.passwordResetOtps.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await this.mailService.sendOtp({ to: email, otp });

    return {
      message: 'OTP sent successfully',
    };
  }

  async verifyPasswordResetOtp(email: string, otp: string) {
    const record = this.passwordResetOtps.get(email);

    if (!record) {
      throw new BadRequestException('OTP not requested or expired');
    }

    if (record.expiresAt < Date.now()) {
      this.passwordResetOtps.delete(email);
      throw new BadRequestException('OTP expired');
    }

    if (record.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    return {
      message: 'OTP verified successfully',
      verified: true,
    };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const record = this.passwordResetOtps.get(email);

    if (!record) {
      throw new BadRequestException('OTP not requested or expired');
    }

    if (record.expiresAt < Date.now()) {
      this.passwordResetOtps.delete(email);
      throw new BadRequestException('OTP expired');
    }

    if (record.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    this.passwordResetOtps.delete(email);

    return {
      message: 'Password reset successfully',
    };
  }
}