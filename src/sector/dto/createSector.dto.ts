import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSectorDto {
  @ApiProperty({
    description: 'Nome do setor',
    example: 'Usinagem',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}