import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
}