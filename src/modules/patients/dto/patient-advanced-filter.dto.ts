import { Gender } from '../../users/types/profile.types';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PatientAdvancedFilterDto {
  @IsNotEmpty()
  currentPage: number;

  @IsOptional()
  pageLimit: number;

  @IsOptional()
  search: string;

  @IsOptional()
  gender: Gender;

  @IsOptional()
  country: string;

  @IsOptional()
  state: string;

  @IsOptional()
  minDependant: number;

  @IsOptional()
  maxDependant: number;

  @IsOptional()
  dateReg: Date;

  @IsOptional()
  plan: string;

  @IsNotEmpty()
  status: string;
}
