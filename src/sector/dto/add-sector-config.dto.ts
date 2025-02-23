// src/sectors/dto/add-sector-config.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddSectorConfigDto {
  @ApiProperty({
    description: 'Nome do campo de configuração',
    example: 'Temperatura Máxima',
  })
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @ApiProperty({
    description: 'Tipo do campo de configuração',
    example: 'number',
  })
  @IsString()
  @IsNotEmpty()
  fieldType: string;
}