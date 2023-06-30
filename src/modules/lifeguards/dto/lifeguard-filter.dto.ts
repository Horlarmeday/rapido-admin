import { ProfileStatus } from '../entities/lifeguard.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LifeguardFilterDto {
  @IsNotEmpty()
  status: any;

  @IsNotEmpty()
  currentPage: number;

  @IsOptional()
  pageLimit: number;

  @IsOptional()
  search: string;
}
