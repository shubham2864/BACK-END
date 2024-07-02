import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class ValidatePasswordPipe {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    if (value.password !== value.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    return value;
  }
}
