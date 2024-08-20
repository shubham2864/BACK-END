import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Types } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
export type UserDocument = User & Document & { _id: any };

@Schema()
export class User {

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/, {
    message: 'password too weak',
  })
  confirmPassword: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Company' })
  companyId: Types.ObjectId;

  @Prop({ required: false, default: 'user' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  // Virtual property for id
  id: string;
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

userSchema.plugin(uniqueValidator);