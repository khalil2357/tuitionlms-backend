import { Body,Controller,Get,Patch,Req,UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'Returns the user profile' })
    getProfile(@Req() req) {
        return this.usersService.getProfile(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({ status: 200, description: 'User profile updated successfully' })
    UpdateUser(
        @Req() req: any,
        @Body() payload: any
    ){
        return this.usersService.updateUser(req.user.id, payload);
    }
    @UseGuards(JwtAuthGuard)
    @Get('all')
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Returns a list of all users' })
    getAllUsers(){
        return this.usersService.getAllUsers();
    }
}
