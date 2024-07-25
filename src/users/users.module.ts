import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './entities/user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesService } from '../roles/roles.service';
import { EmailModule } from 'src/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    EmailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => AdminModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, RolesGuard, RolesService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
