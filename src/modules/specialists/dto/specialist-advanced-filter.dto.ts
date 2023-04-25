import { IsNotEmpty, IsOptional } from 'class-validator';

export class SpecialistAdvancedFilterDto {
  @IsNotEmpty()
  currentPage: number;

  @IsOptional()
  pageLimit: number;

  @IsOptional()
  search: string;

  @IsOptional()
  gender: any;

  @IsOptional()
  country: string;

  @IsOptional()
  state: string;

  @IsOptional()
  category: string;

  @IsOptional()
  dateReg: Date;

  @IsOptional()
  status: any;
}
