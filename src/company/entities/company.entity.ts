import { Prop, Schema, SchemaFactory, getModelToken } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

export type CompanyDocument = Company & Document ;

@Schema()
export class Company {
  @Prop({ unique: true })
  companyName: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop()
  website?: string;

  @Prop({ required: true })
  streetAddress: string;

  @Prop()
  streetAddress2?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.plugin(uniqueValidator);
// CompanySchema.index({ "companyName": 1 }, { unique: true });