import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBook {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  writer: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  coverImage: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Tag)
  tag: Tag;
}
