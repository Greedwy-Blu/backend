// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Nome de usuário',
    example: 'usuario123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}