import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgreementService } from './agreement.service';
import { AgreementController } from './agreement.controller';
import {
  Agreement,
  AgreementSchema,
} from '../agreement/entities/agreement.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Agreement.name, schema: AgreementSchema },
    ]),
    EmailModule
  ],
  controllers: [AgreementController],
  providers: [AgreementService],
})
export class AgreementModule {}
