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

export type UserDocument = User & Document & { _id: any };

@Schema()
export class User {
  @Prop()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  website?: string;

  @Prop()
  streetAddress: string;

  @Prop()
  streetAddress2?: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()  zipCode: string;

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
