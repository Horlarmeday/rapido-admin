import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RateAdvancedFilterDto {
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  specialization: string;

  @IsOptional()
  minRate: number;

  @IsOptional()
  maxRate: number;
}
