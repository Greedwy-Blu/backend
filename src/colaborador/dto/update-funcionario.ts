import { IsString, IsOptional } from 'class-validator';

export class UpdateFuncionarioDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  name?: string;
}