import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async read(id: string): Promise<User | User[]> {
    if (id) {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } else {
      return this.userModel.find().exec();
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    console.log(createUser);
    return createUser.save();
  }

  async validateUser(email: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        email: user.email,
        role: user.role,
        id: user._id,
      };
      return this.jwtService.sign(payload);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUserByJwt(payload: JwtPayload): Promise<User> {
    const user = await this.userModel.findOne({ email: payload.email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    console.log(existingUser);
    return existingUser;
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deletedUser;
  }

}
