import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './entities/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, RolesGuard, RolesService],
  exports: [UsersService,MongooseModule],
})
export class UsersModule {}
