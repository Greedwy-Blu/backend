import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateGestorDto {
  @ApiProperty({ description: 'Código do gestor', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Nome do gestor', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Departamento do gestor', required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ description: 'Cargo do gestor', required: false })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ description: 'Nova senha para acesso do gestor (mínimo 6 caracteres)', required: false, minLength: 6 })
  @IsString()
  @IsOptional()
  // @MinLength(6) // Descomentar se quiser impor um tamanho mínimo
  password?: string;
}