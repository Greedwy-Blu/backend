import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core';
import { Funcionario } from './entities/funcionario.entity';
import { CreateFuncionarioDto } from './dto/create-funcionario';
import { UpdateFuncionarioDto } from './dto/update-funcionario';
import * as bcrypt from 'bcrypt'; // Importar bcrypt

@Injectable()
export class FuncionarioService {
  constructor(
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: EntityRepository<Funcionario>,
    private readonly em: EntityManager,
  ) {}

  async create(createFuncionarioDto: CreateFuncionarioDto): Promise<Funcionario> {
    // Cria uma nova instância da entidade Funcionario
    const funcionario = new Funcionario();
    
    // Atribui os valores do DTO à entidade
    funcionario.code = createFuncionarioDto.code;
    funcionario.nome = createFuncionarioDto.nome;
    funcionario.cargo = createFuncionarioDto.cargo;
    funcionario.salario = createFuncionarioDto.salario;

    // Hash da senha antes de salvar
    const saltRounds = 10;
    funcionario.password = await bcrypt.hash(createFuncionarioDto.password, saltRounds);

    // Persiste e sincroniza a entidade com o banco de dados
    await this.em.persistAndFlush(funcionario);

    // Remover a password da resposta por segurança (embora já esteja hidden na entidade)
    delete funcionario.password;

    return funcionario;
  }

  async findAll(): Promise<Funcionario[]> {
    return this.funcionarioRepository.findAll();
  }

  async findOne(id: number): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.findOne(id);
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    return funcionario;
  }

  async update(id: number, updateFuncionarioDto: UpdateFuncionarioDto): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.findOne(id);
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    if (updateFuncionarioDto.code !== undefined) {
      funcionario.code = updateFuncionarioDto.code;
    }
    if (updateFuncionarioDto.nome !== undefined) {
      funcionario.nome = updateFuncionarioDto.nome;
    }
    if (updateFuncionarioDto.cargo !== undefined) {
      funcionario.cargo = updateFuncionarioDto.cargo;
    }
    if (updateFuncionarioDto.salario !== undefined) {
      funcionario.salario = updateFuncionarioDto.salario;
    }

    // Hash da nova senha, se fornecida
    if (updateFuncionarioDto.password) {
      const saltRounds = 10;
      funcionario.password = await bcrypt.hash(updateFuncionarioDto.password, saltRounds);
    }

    await this.em.flush();

    // Remover a password da resposta por segurança
    delete funcionario.password;

    return funcionario;
  }

  async remove(id: number): Promise<void> {
    const funcionario = await this.funcionarioRepository.findOne(id);
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    await this.em.removeAndFlush(funcionario);
  }
}