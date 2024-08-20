import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesController } from './company.controller';
import { CompaniesService } from './company.service';
import { Company, CompanySchema } from './entities/company.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService, MongooseModule],
})
export class CompaniesModule {}
