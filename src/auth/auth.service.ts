import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { access } from 'fs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ){}
    async register(data: any){
     const hashedPassword = await bcrypt.hash(data.password, 10);
     const user = await this.prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            name: data.name,
            university: data.university,
            educationLevel: data.educationLevel,
            phone: data.phone
        }
     });
     return user;
    }

    async login(data: any){
       const user = await this.prisma.user.findUnique({
        where: {
            email: data.email
        }
       });
       if(!user){
        throw new UnauthorizedException('Invalid credentials');
       }
      const isMatch = await bcrypt.compare(data.password,user.password);
       if(!isMatch){
        throw new UnauthorizedException('Invalid credentials');
       }
       const payload = { sub: user.id, email: user.email, role: user.role };
       const token = this.jwtService.sign(payload);
       return { access_token: token };
    }
}
