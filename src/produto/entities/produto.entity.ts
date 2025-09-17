import { ApiProperty } from '@nestjs/swagger';

export interface Product {
id: number;

  code: string;

  name: string;

   description?: string;

  price: number;

  quantity: number;
}


