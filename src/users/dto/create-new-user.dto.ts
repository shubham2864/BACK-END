import {
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class CreateNewUserDto {
    
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    // @IsString()
    // @IsNotEmpty()
    // companyName: string;

    @IsString()
    @IsNotEmpty()
    role: string
  }
  