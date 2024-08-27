import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBankDetailsDto } from './dto/bank-details.dto';
import { BankDetails } from './entities/bankDetails.entity';
import { CompaniesService } from 'src/company/company.service';
import { FileService } from 'src/commonUtils/file.service';

@Injectable()
export class BankDetailsService {
  constructor(
    @InjectModel(BankDetails.name) private readonly bankDetailsModel: Model<BankDetails>,
    private readonly companyService: CompaniesService,
    private readonly fileService: FileService,
  ) {}

  async getBankDetailsByCompanyId(companyId: string): Promise<BankDetails[]> {
    const bankDetails = await this.bankDetailsModel.find({ companyId }).exec();
    if (!bankDetails || bankDetails.length === 0) {
      throw new NotFoundException(`Bank details not found for company ID ${companyId}`);
    }
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

  async updateBankDetailsByCompanyId(
    companyId: string,
    updateBankDetailsDto: CreateBankDetailsDto,
    file?: Express.Multer.File,
  ): Promise<BankDetails> {
    const bankDetails = await this.bankDetailsModel.findOne({ companyId });

    if (!bankDetails) {
      throw new NotFoundException(`BankDetails with companyId ${companyId} not found`);
    }

    // Update bank details fields
    Object.assign(bankDetails, updateBankDetailsDto);

    // If a file is uploaded, update the fileUrl field
    if (file) {
      // You can save the file buffer directly or convert it to a different format as needed
      bankDetails.fileUrl = file.buffer.toString('base64'); // or store the buffer directly
    }

    return await bankDetails.save();
  }
}
