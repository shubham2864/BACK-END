import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBankDetailsDto } from './dto/bank-details.dto';
import { BankDetails } from './entities/bankDetails.entity';
import { CompaniesService } from 'src/company/company.service';

@Injectable()
export class BankDetailsService {
  constructor(
    @InjectModel(BankDetails.name) private readonly bankDetailsModel: Model<BankDetails>,
    private readonly companyService: CompaniesService, // Inject Company service
  ) {}

  async getBankDetailsByCompanyId(companyId: string): Promise<BankDetails[]> {
    const bankDetails = await this.bankDetailsModel.find({ companyId }).exec();
    if (!bankDetails || bankDetails.length === 0) {
      throw new NotFoundException(`Bank details not found for company ID ${companyId}`);
    }
    console.log(bankDetails)
    return bankDetails;
  }

  async createBankDetails(companyId: string, createBankDetailsDto: CreateBankDetailsDto): Promise<BankDetails> {
    const company = await this.companyService.findCompanyById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const bankDetails = new this.bankDetailsModel({
      ...createBankDetailsDto,
      companyId,
    });
    return bankDetails.save();
  }
}
