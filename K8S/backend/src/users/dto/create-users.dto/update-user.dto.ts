/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    institute?: string;

    @IsOptional()
    @IsEmail()
    mail?: string;

    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    cel?: number;
}