import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

//To Check Login credentials
export class LoginAuthDto {
  @IsNotEmpty({ message: 'Username should not be empty' })
  @MinLength(3, { message: 'Username should be at least 3 characters long' })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/, {
    message: 'password too weak',
  })
  password: string;
}
