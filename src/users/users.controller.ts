import { Body,Controller,Get,Patch,Req,UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return this.usersService.getProfile(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update')
    UpdateUser(
        @Req() req: any,
        @Body() payload: any
    ){
        return this.usersService.updateUser(req.user.id, payload);
    }
    @UseGuards(JwtAuthGuard)
    @Get('all')
    getAllUsers(){
        return this.usersService.getAllUsers();
    }
}
