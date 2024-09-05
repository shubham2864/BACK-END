import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';

export class QuoteDto {
  @IsNotEmpty()
  @IsString()
  quoteNumber: string;

  @IsNotEmpty()
  @IsString()
  policyNumber: string;

  @IsNotEmpty()
  @IsString()
  carrierCompany: string;

  @IsNotEmpty()
  @IsString()
  wholesaler: string;

  @IsNotEmpty()
  @IsString()
  coverage: string;

  @IsNotEmpty()
  effectiveDate: string;

  @IsNotEmpty()
  expirationDate: string;

  @IsNotEmpty()
  @IsNumber()
  minDaysToCancel: number;

  @IsNotEmpty()
  @IsNumber()
  minEarnedRate: number;

  @IsNotEmpty()
  @IsNumber()
  premium: number;

  @IsNotEmpty()
  @IsNumber()
  taxes: number;

  @IsNotEmpty()
  @IsNumber()
  otherFees: number;

  @IsNotEmpty()
  @IsNumber()
  brokerFee: number;

  @IsNotEmpty()
  @IsNumber()
  policyFee: number;

  @IsNotEmpty()
  @IsNumber()
  commission: number;

  @IsNotEmpty()
  @IsNumber()
  agencyFees: number;

  @IsNotEmpty()
  @IsNumber()
  totalCost: number;
}
