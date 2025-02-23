import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGestorDto {
  @ApiProperty({ description: 'Código do gestor' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Nome do gestor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Departamento do gestor' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ description: 'Cargo do gestor' })
  @IsString()
  @IsNotEmpty()
  role: string;
}