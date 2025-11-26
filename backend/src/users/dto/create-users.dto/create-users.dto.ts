/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUsersDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    institute: string;

    @IsEmail()
    @IsNotEmpty()
    mail: string;

    @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    cel?: number;
}
