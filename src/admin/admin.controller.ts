import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  async getUsers(@Req() req) {
    console.log("AdminController: getUsers called");
    try {
      const users = await this.adminService.getUsers();
      console.log("AdminController: getUsers successful");
      console.log(users)
      return users;
    } catch (error) {
      console.error("AdminController: getUsers failed", error.message);
      throw error;
    }
  }

  @Post('login')
  async adminLogin(@Body() loginDto: any) {
    return this.adminService.adminLogin(loginDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('user/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('block-user')
  async blockUser(@Body() blockUserDto: any) {
    return this.adminService.blockUser(blockUserDto);
  }
}