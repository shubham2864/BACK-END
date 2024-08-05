import { IsNotEmpty, IsString } from 'class-validator';

export class Add2Dto {
  @IsNotEmpty()
  @IsString()
  Buisness: string;

  @IsNotEmpty()
  @IsString()
  Address: string;

  @IsNotEmpty()
  @IsString()
  Address2: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  Zip: string;
}
