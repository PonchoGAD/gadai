import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class CalcProfileDto {
  @IsISO8601()
  date_of_birth!: string;

  @IsOptional()
  @IsString()
  time_of_birth?: string;

  @IsOptional()
  @IsString()
  place_of_birth?: string;

  @IsString()
  locale!: 'ru' | 'en';
}
