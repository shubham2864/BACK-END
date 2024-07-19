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
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidatePasswordPipe } from './validate-password.pipe';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //GET
  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.usersService.verifyEmail(token);
      return res.status(200).json({ message: 'Verification verified' });
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Verification failed', error: error.message });
    }
  }

  //Profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<any> {
    console.log(req + 'helloo');
    console.log(req?.user);
    const userId = req.user.id;
    console.log(userId);
    return await this.usersService.findById(userId);
  }

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
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidatePasswordPipe)
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.usersService.register(createUserDto);
      return res.status(200).json({ message: 'signup successful' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  //PUT
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto)
    const userId = req.user.id;
    return this.usersService.update(userId, updateUserDto);
  }

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
    console.log(id);
    return this.usersService.delete(id);
  }
}
