// src/sectors/dto/add-sector-config.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class AddSectorConfigDto {
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @IsString()
  @IsNotEmpty()
  fieldType: string;
}