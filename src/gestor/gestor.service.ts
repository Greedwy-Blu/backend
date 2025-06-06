import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core';
import { Gestao } from './entities/gestor.entity';
import { CreateGestorDto } from './dto/create-gestor.dto';
import { UpdateGestorDto } from './dto/update-gestor.dto';
import * as bcrypt from 'bcrypt'; // Importar bcrypt

@Injectable()
export class GestaoService {
  constructor(
    @InjectRepository(Gestao)
    private readonly gestaoRepository: EntityRepository<Gestao>,
    private readonly em: EntityManager, // Injete o EntityManager
  ) {}

  async create(createGestaoDto: CreateGestorDto): Promise<Gestao> {
    // Cria uma nova instância da entidade Gestao
    const gestao = new Gestao();
    
    // Atribui os valores do DTO à entidade
    gestao.code = createGestaoDto.code;
    gestao.name = createGestaoDto.name;
    gestao.department = createGestaoDto.department;
    gestao.role = createGestaoDto.role;

    // Hash da senha antes de salvar
    const saltRounds = 10;
    gestao.password = await bcrypt.hash(createGestaoDto.password, saltRounds);

    // Persiste e sincroniza a entidade com o banco de dados
    await this.em.persistAndFlush(gestao);

    // Remover a password da resposta por segurança (embora já esteja hidden na entidade)
    delete gestao.password;

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

    // Atualiza apenas os campos fornecidos
    if (updateGestaoDto.code !== undefined) {
      gestao.code = updateGestaoDto.code;
    }
    if (updateGestaoDto.name !== undefined) {
      gestao.name = updateGestaoDto.name;
    }
    if (updateGestaoDto.department !== undefined) {
      gestao.department = updateGestaoDto.department;
    }
    if (updateGestaoDto.role !== undefined) {
      gestao.role = updateGestaoDto.role;
    }

    // Hash da nova senha, se fornecida
    if (updateGestaoDto.password) {
      const saltRounds = 10;
      gestao.password = await bcrypt.hash(updateGestaoDto.password, saltRounds);
    }

    await this.em.flush(); // Use o EntityManager para sincronizar as alterações

    // Remover a password da resposta por segurança
    delete gestao.password;

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