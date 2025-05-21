import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateFuncionarioDto {
  @ApiProperty({ description: 'Código do funcionário', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Nome do funcionário', required: false })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ description: 'Cargo do funcionário', required: false })
  @IsString()
  @IsOptional()
  cargo?: string;

  @ApiProperty({ description: 'Salário do funcionário', required: false })
  @IsNumber()
  @IsOptional()
  salario?: number;

  @ApiProperty({ description: 'Nova senha para acesso do funcionário (mínimo 6 caracteres)', required: false, minLength: 6 })
  @IsString()
  @IsOptional()
  // @MinLength(6) // Descomentar se quiser impor um tamanho mínimo
  password?: string;
}