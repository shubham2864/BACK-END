import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BankDetailsService } from './banks.service';
import { CreateBankDetailsDto } from './dto/bank-details.dto';

@Controller('bank-details')
export class BankDetailsController {
  constructor(private readonly bankDetailsService: BankDetailsService) {}

  @Get(':companyId')
  async getBankDetails(@Param('companyId') companyId: string) {
    return this.bankDetailsService.getBankDetailsByCompanyId(companyId)
  }

  @Post(':companyId')
  async registerBankDetails(
    @Param('companyId') companyId: string,
    @Body() createBankDetailsDto: CreateBankDetailsDto,
  ) {
    return this.bankDetailsService.createBankDetails(
      companyId,
      createBankDetailsDto,
    );
  }
}
