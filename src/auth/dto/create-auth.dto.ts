import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Nome de usuário único',
    example: 'funcionario123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Papel do usuário',
    example: 'funcionario',
    enum: ['funcionario', 'gestor'],
  })
  @IsIn(['funcionario', 'gestor'])
  role: string;
}