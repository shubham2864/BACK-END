import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
  IsOptional,
  IsDate,
} from 'class-validator';

export type UserDocument = User & Document & { _id: any };

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]*$/, {
    message: 'userName must contain letters and numbers without any spaces',
  })
  userName: string;

  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ required: true })
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

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: false, default: 'user' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @Prop()
  @IsOptional()
  @IsString()
  address: string;

  @Prop()
  @IsOptional()
  @IsNumber()
  mobileNo: number;

  @Prop()
  @IsOptional()
  @IsDate()
  dateOfBirth: Date;

  @Prop({ default: false })
  isVerified: boolean;

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
