// src/auth/dto/create-auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Código do usuário',
    example: 'FUNC123',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Papel do usuário',
    example: 'gestao',
    enum: ['funcionario', 'gestao'],
  })
  @IsIn(['funcionario', 'gestao'])
  role: string;
}