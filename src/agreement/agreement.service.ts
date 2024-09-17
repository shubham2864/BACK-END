import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import {
  Agreement,
  AgreementDocument,
} from '../agreement/entities/agreement.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AgreementService {
  constructor(
    @InjectModel(Agreement.name)
    private agreementModel: Model<AgreementDocument>,
    private emailService: EmailService
  ) {}

  async create(createAgreementDto: CreateAgreementDto): Promise<Agreement> {
    const createdAgreement = new this.agreementModel(createAgreementDto);
    return createdAgreement.save();
  }

  async findById(id: string): Promise<Agreement> {
    return this.agreementModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<Agreement | null> {
    return this.agreementModel.findOne({ 'Add1.email': email }).exec();
  }

  async sendTemplateEmail(email: string): Promise<void> {
    const subject = 'Your Policy Payment Reminder';
    const text = "Thanks for filling the agreement in the XYZ Company";
    const htmlContent = '/home/cis/Documents/nest/demo1/src/template/emailTemplate.html'

    await this.emailService.sendMail(email, subject, text, htmlContent);
  }
}
