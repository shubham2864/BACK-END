import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtPayload } from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(createAuthDto: CreateAuthDto): Promise<string> {
    const { email, password } = createAuthDto;
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
}
