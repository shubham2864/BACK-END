import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Company } from "../../company/entities/company.entity"; // Import Company schema
import * as uniqueValidator from 'mongoose-unique-validator';

@Schema()
export class BankDetails extends Document {
  @Prop({ required: true , unique: true, type: Types.ObjectId, ref: 'Company' })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  accountTypeOperational: string;
  
  @Prop({ required: true })
  operationalAccountHolderName: string;

  @Prop({ required: true })
  operationalAccountNumber: string;

  @Prop({ required: true })
  operationalRoutingNumber: string;

  @Prop({ required: true })
  accountTypeTrust?: string;

  @Prop({ required: true })
  trustAccountHolderName?: string;

  @Prop({ required: true })
  trustAccountNumber?: string;

  @Prop({ required: true })
  trustRoutingNumber?: string;

  @Prop()
  sameAsOperational?: boolean;

  @Prop({ required: true })
  oneTimePaymentAccount: string;
}

export const BankDetailsSchema = SchemaFactory.createForClass(BankDetails);

BankDetailsSchema.plugin(uniqueValidator);