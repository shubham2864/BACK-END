import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async adminLogin(loginDto: any) {
    // Implement admin login logic with OTP verification
    // Ensure that only admins can log in
  }

  async getDashboard() {
    // Implement logic to get dashboard data
    const totalUsers = await this.userModel.countDocuments().exec();
    const totalStaffs = await this.userModel.countDocuments({ role: 'staff' }).exec();
    return { totalUsers, totalStaffs };
  }

  async getUsers() {
    return this.userModel.find().exec();
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: any) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }

  async blockUser(blockUserDto: any) {
    const user = await this.userModel.findById(blockUserDto.id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isBlocked = true; // You need to add `isBlocked` field in your User schema
    await user.save();
    return { message: 'User blocked successfully' };
  }
}
