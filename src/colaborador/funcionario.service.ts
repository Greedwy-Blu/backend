import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Funcionario } from './entities/employee.entity';
import { CreateFuncionarioDto } from './dto/create-funcionario';
import { UpdateFuncionarioDto } from './dto/update-funcionario';

@Injectable()
export class FuncionarioService {
  constructor(
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: EntityRepository<Funcionario>,
    private readonly em: EntityManager, // Injete o EntityManager
  ) {}

  async create(createFuncionarioDto: CreateFuncionarioDto): Promise<Funcionario> {
    const funcionario = this.funcionarioRepository.create(createFuncionarioDto);
    await this.em.persistAndFlush(funcionario); // Use o EntityManager para persistir e sincronizar
    return funcionario;
  }

  async findAll(): Promise<Funcionario[]> {
    return this.funcionarioRepository.findAll();
  }

  async findOne(id: number): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.findOne(id);
    if (!funcionario) {
      throw new NotFoundException('Employee not found');
    }
    return funcionario;
  }

  async update(id: number, updateFuncionarioDto: UpdateFuncionarioDto): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.findOne(id);
    if (!funcionario) {
      throw new NotFoundException('Employee not found');
    }

    if (updateFuncionarioDto.code) {
      funcionario.code = updateFuncionarioDto.code;
    }
    if (updateFuncionarioDto.name) {
      funcionario.name = updateFuncionarioDto.name;
    }

    await this.em.flush(); // Use o EntityManager para sincronizar as alterações
    return funcionario;
  }

  async remove(id: number): Promise<void> {
    const funcionario = await this.funcionarioRepository.findOne(id);
    if (!funcionario) {
      throw new NotFoundException('Funcionario not found');
    }

    await this.em.removeAndFlush(funcionario); // Use o EntityManager para remover e sincronizar
  }
}