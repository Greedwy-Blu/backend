// src/gestao/gestao.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Gestao } from './entities/gestor.entity';
import { CreateGestorDto } from './dto/create-gestor.dto';
import { UpdateGestorDto } from './dto/update-gestor.dto';

@Injectable()
export class GestaoService {
  constructor(
    @InjectRepository(Gestao)
    private readonly gestaoRepository: EntityRepository<Gestao>,
    private readonly em: EntityManager, // Injete o EntityManager
  ) {}

  async create(createGestaoDto: CreateGestorDto): Promise<Gestao> {
    const gestao = this.gestaoRepository.create(createGestaoDto);
    await this.em.persistAndFlush(gestao); // Use o EntityManager para persistir e sincronizar
    return gestao;
  }

  async findAll(): Promise<Gestao[]> {
    return this.gestaoRepository.findAll();
  }

  async findOne(id: number): Promise<Gestao> {
    const gestao = await this.gestaoRepository.findOne(id);
    if (!gestao) {
      throw new NotFoundException('Gestão não encontrada');
    }
    return gestao;
  }

  async update(id: number, updateGestaoDto: UpdateGestorDto): Promise<Gestao> {
    const gestao = await this.gestaoRepository.findOne(id);
    if (!gestao) {
      throw new NotFoundException('Gestão não encontrada');
    }

    if (updateGestaoDto.code) {
      gestao.code = updateGestaoDto.code;
    }
    if (updateGestaoDto.name) {
      gestao.name = updateGestaoDto.name;
    }
    if (updateGestaoDto.department) {
      gestao.department = updateGestaoDto.department;
    }
    if (updateGestaoDto.role) {
      gestao.role = updateGestaoDto.role;
    }

    await this.em.flush(); // Use o EntityManager para sincronizar as alterações
    return gestao;
  }

  async remove(id: number): Promise<void> {
    const gestao = await this.gestaoRepository.findOne(id);
    if (!gestao) {
      throw new NotFoundException('Gestão não encontrada');
    }

    await this.em.removeAndFlush(gestao); // Use o EntityManager para remover e sincronizar
  }
}