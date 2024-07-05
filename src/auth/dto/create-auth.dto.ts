import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

//To Check Login credentials
export class CreateAuthDto {
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/, {
      message: 'password too weak',
    })
    password: string;
  }