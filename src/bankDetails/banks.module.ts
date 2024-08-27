import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankDetails, BankDetailsSchema } from './entities/bankDetails.entity';
import { CompaniesModule } from 'src/company/company.module';
import { BankDetailsController } from './banks.controller';
import { BankDetailsService } from './banks.service';
import { FileModule } from 'src/commonUtils/file.module';
import { FileService } from 'src/commonUtils/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BankDetails.name, schema: BankDetailsSchema }]),
    CompaniesModule, // Import Company module to use in service
    FileModule
  ],
  controllers: [BankDetailsController],
  providers: [BankDetailsService, FileService],
  exports: [BankDetailsService, MongooseModule]
})
export class BankDetailsModule {}
