import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import {
  Agreement,
  AgreementDocument,
} from '../agreement/entities/agreement.entity';

@Injectable()
export class AgreementService {
  constructor(
    @InjectModel(Agreement.name)
    private agreementModel: Model<AgreementDocument>,
  ) {}

  async create(createAgreementDto: CreateAgreementDto): Promise<Agreement> {
    const createdAgreement = new this.agreementModel(createAgreementDto);
    return createdAgreement.save();
  }
}
