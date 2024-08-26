import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBankDetailsDto {
  @IsNotEmpty()
  @IsString()
  accountTypeOperational: string;

  @IsNotEmpty()
  @IsString()
  operationalAccountHolderName: string;

  @IsNotEmpty()
  @IsString()
  operationalAccountNumber: string;

  @IsNotEmpty()
  @IsString()
  operationalRoutingNumber: string;

  @IsOptional()
  @IsString()
  accountTypeTrust?: string;

  @IsOptional()
  @IsString()
  trustAccountHolderName?: string;

  @IsOptional()
  @IsString()
  trustAccountNumber?: string;

  @IsOptional()
  @IsString()
  trustRoutingNumber?: string;

  @IsNotEmpty()
  @IsBoolean()
  sameAsOperational?: boolean;

  @IsNotEmpty()
  @IsString()
  oneTimePaymentAccount: string;
}
