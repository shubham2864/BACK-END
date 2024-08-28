import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company, CompanyDocument } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<any> {
    try {
      const company = new this.companyModel(createCompanyDto);
      console.log(company);
      return company.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Company name must be unique.');
      }
      throw error;
    }
  }

  async findPendingCompanies(): Promise<Company[]> {
    return this.companyModel.find({ isVerified: false }).exec();
  }

  async findById(id: string): Promise<Company> {
    const user = await this.companyModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Comapny with id ${id} not found`);
    }
    return user;
  }

  async updateCompanyDetails(
    id: string,
    updateDetails: Partial<Company>,
  ): Promise<Company | null> {
    const updatedCompany = await this.companyModel
      .findByIdAndUpdate(id, updateDetails, { new: true })
      .exec();

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return updatedCompany;
  }

  async findCompanyById(companyId: string): Promise<Company> {
    const company = await this.companyModel.findById(companyId).exec();
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
    return company;
  }

  async deleteCompany(companyId: string): Promise<Company | null> {
    const deletedCompany = await this.companyModel
      .findByIdAndDelete(companyId)
      .exec();

    if (!deletedCompany) {
      throw new NotFoundException('Company not found');
    }

    return deletedCompany;
  }
}
