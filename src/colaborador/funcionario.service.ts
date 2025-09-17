import { Injectable, NotFoundException } from '@nestjs/common';
import { Funcionario } from './entities/funcionario.entity';
import { CreateFuncionarioDto } from './dto/create-funcionario';
import { UpdateFuncionarioDto } from './dto/update-funcionario';
import * as bcrypt from 'bcrypt';
import { db } from '../config/database.config';

@Injectable()
export class FuncionarioService {
  constructor() {}

  async create(createFuncionarioDto: CreateFuncionarioDto): Promise<Funcionario> {
    const { code, nome, cargo, salario, password } = createFuncionarioDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFuncionario = await db.insertInto('funcionario')
      .values({
        code,
        nome,
        cargo,
        salario,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

   
    return newFuncionario;
  }

  async findAll(): Promise<Funcionario[]> {
    return db.selectFrom('funcionario').selectAll().execute();
  }

  async findOne(id: number): Promise<Funcionario> {
    const funcionario = await db.selectFrom('funcionario').selectAll().where('id', '=', id).executeTakeFirst();
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    return funcionario;
  }

  async update(id: number, updateFuncionarioDto: UpdateFuncionarioDto): Promise<Funcionario> {
    const funcionario = await db.selectFrom('funcionario').selectAll().where('id', '=', id).executeTakeFirst();
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    const updatedFields: Partial<Funcionario> = {
      updatedAt: new Date(),
    };

    if (updateFuncionarioDto.code !== undefined) {
      updatedFields.code = updateFuncionarioDto.code;
    }
    if (updateFuncionarioDto.nome !== undefined) {
      updatedFields.nome = updateFuncionarioDto.nome;
    }
    if (updateFuncionarioDto.cargo !== undefined) {
      updatedFields.cargo = updateFuncionarioDto.cargo;
    }
    if (updateFuncionarioDto.salario !== undefined) {
      updatedFields.salario = updateFuncionarioDto.salario;
    }

    // Password update should be handled via Auth service if it's in the Auth table
    // If it's meant to be updated here, the schema and logic need to be adjusted.

    const updatedFuncionario = await db.updateTable('funcionario')
      .set(updatedFields)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return updatedFuncionario;
  }

  async remove(id: number): Promise<void> {
    const { numDeletedRows } = await db.deleteFrom('funcionario').where('id', '=', id).executeTakeFirstOrThrow();
    if (Number(numDeletedRows) === 0) {
      throw new NotFoundException('Funcionário não encontrado');
    }
  }
}


