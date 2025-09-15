import { ApiProperty } from '@nestjs/swagger';

export class Sector {
  @ApiProperty({
    description: 'Nome do setor',
    example: 'Usinagem',
  })
  id!: number;

  name!: string;
}


