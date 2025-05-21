// src/maquina/maquina.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Maquina } from './entities/maquina.entity';
import { CreateMaquinaDto } from './dto/create-maquina.dto';
import { UpdateMaquinaDto } from './dto/update-maquina.dto';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class MaquinaService {
  constructor(
    @InjectRepository(Maquina)
    private readonly maquinaRepository: EntityRepository<Maquina>,
   private readonly em: EntityManager, // Injete o EntityManager
  
  ) {}

  async create(createMaquinaDto: CreateMaquinaDto): Promise<Maquina> {
    const maquina = this.maquinaRepository.create({
      ...createMaquinaDto,
      status: 'ativo', // Default value for status
      created_at: new Date(), // Set current date for created_at
      updated_at: new Date(), // Set current date for updated_at
    });
    await this.em.persistAndFlush(maquina);
    return maquina;
  }

  async findAll(): Promise<Maquina[]> {
    return this.maquinaRepository.findAll();
  }

  async findOne(id: number): Promise<Maquina | null> {
    const maquina = await this.maquinaRepository.findOne(id);
    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada.`);
    }
    return maquina;
  }

  async findByCodigo(codigo: string): Promise<Maquina | null> {
    const maquina = await this.maquinaRepository.findOne({ codigo });
    // Não lançar exceção aqui, pois pode ser usado internamente para verificar existência
    return maquina;
  }

  async update(id: number, updateMaquinaDto: UpdateMaquinaDto): Promise<Maquina> {
    const maquina = await this.findOne(id); // findOne já lança NotFoundException se não encontrar
    if (!maquina) { 
        // Redundante devido ao findOne, mas mantém a clareza
        throw new NotFoundException(`Máquina com ID ${id} não encontrada.`);
    }
    wrap(maquina).assign(updateMaquinaDto);
    await this.em.flush();
    return maquina;
  }

  async remove(id: number): Promise<void> {
    const maquina = await this.findOne(id); // findOne já lança NotFoundException se não encontrar
     if (!maquina) {
        // Redundante devido ao findOne, mas mantém a clareza
        throw new NotFoundException(`Máquina com ID ${id} não encontrada.`);
    }
    await this.em.removeAndFlush(maquina);
  }
}
