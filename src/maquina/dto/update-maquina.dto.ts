// src/maquina/dto/update-maquina.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateMaquinaDto } from './create-maquina.dto';

export class UpdateMaquinaDto extends PartialType(CreateMaquinaDto) {}
