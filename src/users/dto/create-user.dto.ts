import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]*$/, {
    message: 'userName must contain letters and numbers without any spaces',
  })
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/, {
    message: 'password too weak',
  })
  confirmPassword: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  mobileNo?: number;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
