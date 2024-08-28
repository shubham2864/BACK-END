import { IsNotEmpty, IsOptional, IsString, ValidateNested, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class BusinessOwnerDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  socialSecurityNumber?: string;

  @IsOptional()
  @IsString()
  sAddress?: string;

  @IsOptional()
  @IsString()
  sCity?: string;

  @IsOptional()
  @IsString()
  sState?: string;

  @IsOptional()
  @IsString()
  sZipCode?: string;
}

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

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessOwnerDto)
  businessOwner?: BusinessOwnerDto[];
}