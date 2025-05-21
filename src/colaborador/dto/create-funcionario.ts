import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFuncionarioDto {
  @ApiProperty({ description: 'Código do funcionário' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Nome do funcionário' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Cargo do funcionário' })
  @IsString()
  @IsNotEmpty()
  cargo: string;

  @ApiProperty({ description: 'Salário do funcionário' })
  @IsNumber()
  @IsNotEmpty()
  salario: number;

  @ApiProperty({ description: 'Senha para acesso do funcionário', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  // @MinLength(6) // Descomentar se quiser impor um tamanho mínimo
  password: string;
}