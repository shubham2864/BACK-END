import {
  BadRequestException,
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
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { EmailService } from 'src/email/email.service';
import { CreateNewUserDto } from './dto/create-new-user.dto';
import { newUser } from './entities/newUser.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(User.name) private newUserModel: Model<newUser>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  //READ
  async getUsers() {
    return this.userModel.find().exec();
  }

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

  async findSuggestionsByEmail(email: string): Promise<User[]> {
    // Implement the logic to find customer suggestions by email
    return this.userModel
      .find({ email: { $regex: email, $options: 'i' } })
      .exec();
  }

  async findCustomerByEmail(email: string): Promise<User | undefined> {
    // Implement the logic to find customer details by email
    return this.userModel.findOne({ email }).exec();
  }

  //Signup
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, companyId } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = new this.userModel({
      ...createUserDto,
      isVerified: false,
      password: hashedPassword,
      companyId: companyId,
    });

    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'), // Use ConfigService
      expiresIn: '1h',
    });
    console.log('shubham your token : ' + token);
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
    const subject = 'Email Verification';
    const text = `Please verify your email by clicking on the following link: ${verificationLink}`;

    try {
      console.log('I came here');
      const data = await createUser.save();
      await this.emailService.sendMail(email, subject, text);
      console.log('email sended');
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  //New User
  async registerUser(createNewUserDto: CreateNewUserDto): Promise<any> {
    const { email } = createNewUserDto;
    const createUser = new this.newUserModel({
      ...createNewUserDto,
      isVerified: false,
    });

    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'), // Use ConfigService
      expiresIn: '1h',
    });
    console.log('shubham your token : ' + token);
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
    const subject = 'Email Verification';
    const text = `Please verify your email by clicking on the following link: ${verificationLink}`;

    try {
      await this.emailService.sendMail(email, subject, text);
      const data = await createUser.save();
      console.log(data, 'SURAJ');
      console.log('email sended');
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return 'Failedd122334';
    }
  }

  //EMAIL VERIFICATION
  async verifyEmail(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'), // Use ConfigService
      });
      console.log(decoded);
      console.log('shubham11111');
      const user = await this.userModel.findOne({ email: decoded.email });
      console.log(user);
      if (!user) {
        console.log('this is it');
        throw new UnauthorizedException('Invalid or expired token');
      }
      console.log('is it this');
      user.isVerified = true;
      await user.save();
      return user;
    } catch (error) {
      console.error('Invalid or expired token:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  //USER TOKEN VALIDATION
  async validateUserByJwt(payload: JwtPayload): Promise<User> {
    console.log('validateUserByJwt payload:', payload); // Add logging
    const user = await this.userModel.findOne({ email: payload.email }).exec();
    if (!user) {
      console.log('validateUserByJwt: user not found'); // Add logging
      throw new UnauthorizedException('Invalid token');
    }
    console.log('validateUserByJwt: found user:', user); // Add logging
    return user;
  }

  //UPDATE
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    console.log('ID22', id);
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    console.log(existingUser + '1111');
    return existingUser;
  }

  async updateProfile(updateProfileDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOne({
      email: updateProfileDto.email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateProfileDto); // Update fields as per DTO
    return await user.save();
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.password = newPassword;
    await user.save();
  }

  //DELETE
  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deletedUser;
  }
}
