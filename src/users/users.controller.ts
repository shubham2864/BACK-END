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
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidatePasswordPipe } from './validate-password.pipe';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateNewUserDto } from './dto/create-new-user.dto';

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
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request): Promise<any> {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('suggestions')
  async getCustomerSuggestions(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email query parameter is required');
    }

    try {
      const suggestions = await this.usersService.findSuggestionsByEmail(email);
      return suggestions;
    } catch (error) {
      throw new NotFoundException('Customer suggestions not found');
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return this.usersService.getUsers();
  }

  // Endpoint to get customer details by email
  @Get(':email')
  async getCustomerDetails(@Param('email') email: string) {
    try {
      console.log(email);
      const customer = await this.usersService.findCustomerByEmail(email);
      if (!customer) {
        throw new NotFoundException(`Customer with email ${email} not found`);
      }
      return customer.email;
    } catch (error) {
      throw new NotFoundException('Customer details not found');
    }
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

  @Post('newUser')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidatePasswordPipe)
  async registerUser(
    @Body() createNewUserDto: CreateNewUserDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.usersService.registerUser(createNewUserDto);
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
    console.log(updateUserDto);
    const userId = req.user.id;
    const h = await this.usersService.update(userId, updateUserDto);
    console.log(h + 'yeah');
    return {
      data: h,
      msg: 'updated successfully',
    };
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
