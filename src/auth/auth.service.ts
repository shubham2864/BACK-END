import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginAuthDto } from './dto/create-auth.dto';
import { JwtPayload } from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constants';
import { EmailService } from 'src/email/email.service';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { RedisService } from './storage/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private usersService: UsersService,
    private emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  //LOGIN
  async validateUser(
    loginAuthDto: LoginAuthDto,
  ): Promise<{ access_token: string; userName: string }> {
    const { email, password } = loginAuthDto;
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        throw new UnauthorizedException('Email not verified');
      }
      const payload: JwtPayload = {
        email: user.email,
        role: user.role,
        id: user.id,
        userName: user.userName,
      };
      const token = this.jwtService.sign(payload);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.redisService.set(email, otp, 300);
      console.log(token)
      await this.emailService.sendMail(
        user.email,
        'Your OTP Code',
        `Dear ${user.userName},\n\nYour OTP code is: ${otp}\n\nPlease use this code to verify your login.`,
      );

      return {
        access_token: token,
        userName: user.userName,
      };
    }
    throw new UnauthorizedException(
      'Invalid credentials or email not verified',
    );
  }

  //RESET PASSWORD
  async sendPasswordResetEmail(token: string): Promise<void> {
    const decoded = this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });
    const user = await this.userModel.findById(decoded.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const resetToken = await this.generatePasswordResetToken(user);
    const resetLink = `https://demo.com/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const text = `Dear ${user.userName},\n\nPlease click on the following link to reset your password:\n${resetLink}\n\nIf you did not request this, please ignore this email.`;
    try {
      await this.emailService.sendMail(user.email, subject, text);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.validatePasswordResetToken(token);
    console.log(user);
    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await this.usersService.updatePassword(user.id, hashedPassword);
  }

  private async generatePasswordResetToken(
    user: UserDocument,
  ): Promise<string> {
    const payload = { userId: user._id.toHexString() };
    return jwt.sign(payload, jwtConstants.secret, { expiresIn: '1h' });
  }

  private async validatePasswordResetToken(
    token: string,
  ): Promise<UserDocument | null> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      const user = await this.userModel.findById(decoded.userId);
      console.log(user);
      return user;
    } catch (error) {
      console.error('Invalid or expired token:', error);
      throw new NotFoundException('Invalid or expired token');
    }
  }

  //OTP
  async sendOtp(userName: string): Promise<void> {
    const user = await this.userModel.findOne({ userName: userName }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.userModel.updateOne({ _id: user._id }, { otp });
    const subject = 'Your OTP Code';
    const text = `Dear ${user.userName},\n\nYour OTP code is: ${otp}\n\nPlease use this code to verify your login.`;
    try {
      await this.emailService.sendMail(user.email, subject, text);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  //OTP VERIFICATION.
  async verifyOtp(email: string, otp: string): Promise<void> {
    const storedOtp = await this.redisService.get(email);
    if (storedOtp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    await this.redisService.delete(email);
  }

  //LOGOUT
  async logout(token: string): Promise<void> {
    // Add the token to the blacklist
    await this.redisService.set(`blacklist_${token}`, token, 3600); // Token blacklisted for 1 hour (example)
  }
}
