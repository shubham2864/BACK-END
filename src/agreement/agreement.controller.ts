import { Body, Controller, Post } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';

@Controller('agreement')
export class AgreementController {
  constructor(private readonly agreementService: AgreementService) {}

  @Post()
  async create(@Body() createAgreementDto: CreateAgreementDto) {
    try {
      console.log('hello');
      console.log(createAgreementDto);
      return this.agreementService.create(createAgreementDto);
    } catch (error) {
      console.log(error + 'There is an error');
    }
  }
}
