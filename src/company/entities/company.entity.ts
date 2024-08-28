import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

export type CompanyDocument = Company & Document;

@Schema()
export class BusinessOwner {
  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  email?: string;

  @Prop()
  mobileNumber?: string;

  @Prop()
  jobTitle?: string;

  @Prop()
  dateOfBirth?: string;

  @Prop()
  socialSecurityNumber?: string;

  @Prop()
  sAddress?: string;

  @Prop()
  sCity?: string;

  @Prop()
  sState?: string;

  @Prop()
  sZipCode?: string;
}

const BusinessOwnerSchema = SchemaFactory.createForClass(BusinessOwner);

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

  @Prop()
  taxId: string;

  @Prop()
  type: string;

  @Prop({ type: [BusinessOwnerSchema], default: [] })
  businessOwner: BusinessOwner[];

  @Prop()
  isVerified: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.plugin(uniqueValidator);
