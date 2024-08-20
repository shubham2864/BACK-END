import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompaniesService } from './company.service';
import { Company } from './entities/company.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<any> {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Get(':Id')
  @UseGuards(JwtAuthGuard)
  async getCompanyProfile(@Param('Id') Id: string): Promise<any> {
    
    const data = await this.companyService.findById(Id);
    if (!data) {
      throw new NotFoundException('Company Name not found');
    }
    return data;
  }

  @Delete(':id')
  async deleteCompany(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deletedCompany = await this.companyService.deleteCompany(id);
      if (!deletedCompany) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Company deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete company',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
