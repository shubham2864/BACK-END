import {
  Controller,
  Post,
  Body,
  UsePipes,
  Put,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidatePasswordPipe } from './validate-password.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get([':id','/'])
  async read(@Param('id') id: string) {
    return this.usersService.read(id);
  }

  @Post('register')
  @UsePipes(ValidatePasswordPipe)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    await this.usersService.validateUser(email, password);
    console.log('User logged in successfully!');
  }

  @Put(':id')
  @UsePipes(ValidatePasswordPipe)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
