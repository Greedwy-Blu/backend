import { ApiProperty } from '@nestjs/swagger';

export interface Maquina {
  id: number;

  codigo: string;

  nome: string;

  tipo: string;

  modelo: string;

  fabricante: string;

  capacidade?: string;

  status: string;

  created_at: Date;

  updated_at: Date;
}


