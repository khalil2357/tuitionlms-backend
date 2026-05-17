import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {} 
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        university: true,
        educationLevel: true,
        avatar: true,
        phone: true,
        bio: true,
        headline: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async updateUser(
    userId: string,
    payload: UpdateUserDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only allow specific fields to be updated
    const allowedFields = {
      name: payload.name,
      university: payload.university,
      educationLevel: payload.educationLevel,
      avatar: payload.avatar,
      phone: payload.phone,
      bio: payload.bio,
      headline: payload.headline,
    };

    // Filter out undefined values
    const updateData = Object.fromEntries(
      Object.entries(allowedFields).filter(([, value]) => value !== undefined)
    );

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        university: true,
        educationLevel: true,
        avatar: true,
        phone: true,
        bio: true,
        headline: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        university: true,
        educationLevel: true,
        avatar: true,
        phone: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}