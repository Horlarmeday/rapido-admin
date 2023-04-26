import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @Type(() => Number)
  readonly amount: number;

  @IsOptional()
  @Type(() => Number)
  readonly trial_days: number;
}
