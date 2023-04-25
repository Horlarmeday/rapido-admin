import { Role } from '../types/profile.types';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;
  @IsNotEmpty()
  @IsString()
  readonly last_name: string;
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;

  @IsString()
  @IsNotEmpty()
  readonly country_code: string;

  @IsString()
  @MinLength(10, {
    message:
      'Phone number is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @MaxLength(10, {
    message:
      'Phone number is too long. Minimal length is $constraint1 characters, but actual is $value',
  })
  @IsNotEmpty()
  readonly phone: string;
}
