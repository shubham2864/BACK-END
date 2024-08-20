import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsOptional()
  @IsString()
  streetAddress2?: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;
}
