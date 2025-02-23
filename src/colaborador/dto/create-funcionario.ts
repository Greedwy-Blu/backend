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
}