import {
  Controller,
  Post,
  Body,
  UsePipes,
  Put,
  Param,
  Delete,
  Get,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidatePasswordPipe } from './validate-password.pipe';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //GET
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async read(@Param('id') id: string, @Req() req: Request) {
    const user = req.user;

    if (!user || (user.role !== 'admin' && user.id !== id)) {
      throw new UnauthorizedException();
    }

    return await this.usersService.read(id);
  }

  //Profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = req.user.id;
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.usersService.update(userId, updateUserDto);
  }

  //POST
  @Post('signup')
  @UsePipes(ValidatePasswordPipe)
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  //PUT
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(ValidatePasswordPipe)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (user.role !== 'admin' && user.id !== id) {
      throw new UnauthorizedException();
    }
    return this.usersService.update(id, updateUserDto);
  }

  //DELETE
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log(id)
    return this.usersService.delete(id);
  }
}

