  import { Injectable, UnauthorizedException } from '@nestjs/common';
  import { PassportStrategy } from '@nestjs/passport';
  import { Strategy, ExtractJwt } from 'passport-jwt';
  import { UsersService } from 'src/users/users.service';
  import { JwtPayload } from './jwt-payload.interface';
  import { User } from 'src/users/entities/user.entity';
  import { ConfigService } from '@nestjs/config';

  @Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService,private configService: ConfigService) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get<string>('JWT_SECRET'),
      });
    }

    async validate(payload: JwtPayload): Promise<User> {
      const user = await this.usersService.validateUserByJwt(payload);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    }
  }
