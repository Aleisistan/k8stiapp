/* eslint-disable prettier/prettier */
import {
   IsBoolean,
   IsInt,
   IsNotEmpty,
   IsOptional,
   IsPositive,
   IsString,
} from 'class-validator';

export class CreateOrdersDto {
   @IsInt()
   @IsPositive()
   userId: number;

   @IsString()
   @IsNotEmpty()
   name: string;

   @IsString()
   @IsNotEmpty()
   priority: string;

   @IsString()
   @IsNotEmpty()
   description: string;

   @IsString()
   @IsNotEmpty()
   description2: string;

   @IsOptional()
   @IsBoolean()
   isActive?: boolean;

   @IsOptional()
   @IsString()
   estado?: string;
}

