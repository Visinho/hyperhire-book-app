import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignUpInput {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsOptional()
  point: number;
}
