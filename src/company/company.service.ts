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

  async findById(id: string): Promise<Company> {
    const user = await this.companyModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Comapny with id ${id} not found`);
    }
    return user;
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
