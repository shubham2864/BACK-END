import { Controller, Post, Body, Param, Get, Put, UseInterceptors, UploadedFile, Res, BadRequestException, NotFoundException } from '@nestjs/common';
import { BankDetailsService } from './banks.service';
import { CreateBankDetailsDto } from './dto/bank-details.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/commonUtils/file.service';
import { Response } from 'express';

@Controller('bank-details')
export class BankDetailsController {
  constructor(
    private readonly bankDetailsService: BankDetailsService,
    private readonly fileService: FileService
  ) {}

  @Get('file/:fileId')
  async getFile(@Param('fileId') fileId: string, @Res() res: Response) {
    try {
      const fileStream = await this.fileService.getFile(fileId);
      fileStream.pipe(res);
    } catch (error) {
      res.status(404).send('File not found');
    }
  }

  @Get(':companyId')
  async getBankDetails(@Param('companyId') companyId: string) {
    return this.bankDetailsService.getBankDetailsByCompanyId(companyId);
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

  @Put(':companyId')
  @UseInterceptors(FileInterceptor('file'))
  async updateBankDetails(
    @Param('companyId') companyId: string,
    @Body() updateBankDetailsDto: CreateBankDetailsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file && file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Invalid file type. Only PDFs are allowed.');
    }

    const updatedBankDetails = await this.bankDetailsService.updateBankDetailsByCompanyId(
      companyId,
      updateBankDetailsDto,
      file,
    );

    return updatedBankDetails;
  }
}
