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
import { EmailService } from 'src/email/email.service';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/auth/jwt/jwt.constants';
import { RedisService } from 'src/auth/storage/redis.service';
import { create } from 'domain';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
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

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email }).exec();
  }

  //Signup
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, userName } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = new this.userModel({
      ...createUserDto,
      isVerified: false,
      password: hashedPassword,
    });

    const payload = { email, userName };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1h',
    });
    console.log(token);
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
    const subject = 'Email Verification';
    const text = `Please verify your email by clicking on the following link: ${verificationLink}`;

    try {
      await this.emailService.sendMail(email, subject, text);
      createUser.save();
      console.log('email sended');
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  //EMAIL VERIFICATION
  async verifyEmail(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      const user = await this.userModel.findOne({ email: decoded.email });
      if (!user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      user.isVerified = true;
      await user.save();
      return user;
    } catch (error) {
      console.error('Invalid or expired token:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
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
    return existingUser;
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deletedUser;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.password = newPassword;
    await user.save();
  }
}
