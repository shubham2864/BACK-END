import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';

@Controller('agreement')
export class AgreementController {
  constructor(private readonly agreementService: AgreementService) {}

  @Post()
  async create(@Body() createAgreementDto: CreateAgreementDto) {
    try {
      const newAgreement =
        await this.agreementService.create(createAgreementDto);
      return { id: newAgreement._id }; // Return the generated ID
    } catch (error) {
      console.log(error + 'There is an error');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const agreement = await this.agreementService.findById(id);
    return agreement;
  }
}
