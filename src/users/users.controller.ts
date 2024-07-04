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

  //POST
  @Post('register')
  @UsePipes(ValidatePasswordPipe)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
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
    return this.usersService.delete(id);
  }
}
