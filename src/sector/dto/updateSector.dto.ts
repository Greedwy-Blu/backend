import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSectorDto {
  @ApiProperty({
    description: 'Nome do setor',
    example: 'Usinagem e Montagem',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}