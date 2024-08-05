import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

@Schema()
export class Add1 extends Document {
  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  contact: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  Address: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  city: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  state: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  Zip: string;

  @Prop()
  @IsOptional()
  file: string;
}

export const Add1Schema = SchemaFactory.createForClass(Add1);

@Schema()
export class Add2 extends Document {
  @Prop()
  @IsNotEmpty()
  @IsString()
  Buisness: string;

  @Prop()
  @IsNotEmpty()
  @IsString()
  Address: string;

  @Prop()
  @IsNotEmpty()
  @IsString()
  Address2: string;

  @Prop()
  @IsNotEmpty()
  @IsString()
  city: string;

  @Prop()
  @IsNotEmpty()
  @IsString()
  state: string;

  @Prop()
  @IsNotEmpty()
  @IsString()
  Zip: string;
}

export const Add2Schema = SchemaFactory.createForClass(Add2);

@Schema()
export class Quote extends Document {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  quoteNumber: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  policyNumber: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  carrierCompany: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  wholesaler: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  coverage: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @Type(() => Date)
  effectiveDate: Date;

  @Prop({ required: true })
  @IsNotEmpty()
  @Type(() => Date)
  expirationDate: Date;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  minDaysToCancel: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  minEarnedRate: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  premium: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  taxes: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  otherFees: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  brokerFee: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  policyFee: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  commission: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  agencyFees: number;

  @Prop()
  @IsOptional()
  file: string;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);

@Schema()
export class Agreement extends Document {
  @Prop({ type: Add1Schema, required: true })
  Add1: Add1;

  @Prop({ type: [Add2Schema], required: true })
  Add2: Add2[];

  @Prop({ type: [QuoteSchema], required: true })
  quotes: Quote[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  // Virtual property for id
  id: string;
}

export const AgreementSchema = SchemaFactory.createForClass(Agreement);
export type AgreementDocument = Agreement & Document;

AgreementSchema.virtual('id').get(function () {
  return this._id;
});

AgreementSchema.set('toJSON', {
  virtuals: true,
});
