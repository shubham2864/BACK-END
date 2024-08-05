import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Add1Dto } from '../dto/add1.dto';
import { Add2Dto } from '../dto/add2.dto';
import { QuoteDto } from '../dto/quote.dto';

export class CreateAgreementDto {
  @ValidateNested()
  @Type(() => Add1Dto)
  Add1: Add1Dto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Add2Dto)
  Add2: Add2Dto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteDto)
  quotes: QuoteDto[];
}
