import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  // Adicione aqui funções utilitárias que podem ser usadas em vários módulos
  // Exemplo: formatação de datas, validações genéricas, etc.

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}


