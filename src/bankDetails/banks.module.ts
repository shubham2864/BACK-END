import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankDetails, BankDetailsSchema } from './entities/bankDetails.entity';
import { CompaniesModule } from 'src/company/company.module';
import { BankDetailsController } from './banks.controller';
import { BankDetailsService } from './banks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BankDetails.name, schema: BankDetailsSchema }]),
    CompaniesModule, // Import Company module to use in service
  ],
  controllers: [BankDetailsController],
  providers: [BankDetailsService],
})
export class BankDetailsModule {}
