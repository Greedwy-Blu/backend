import { Injectable, NotFoundException } from '@nestjs/common';
import { Gestao } from './entities/gestor.entity';
import { CreateGestorDto } from './dto/create-gestor.dto';
import { UpdateGestorDto } from './dto/update-gestor.dto';
import * as bcrypt from 'bcrypt';
import { db } from '../config/database.config';

@Injectable()
export class GestaoService {
  constructor() {}

  async create(createGestaoDto: CreateGestorDto): Promise<Gestao> {
    const { code, name, department, role, password } = createGestaoDto;

    // Password hashing is handled by Auth service, so we don't hash it here.
    // If the intention was to store it in Gestao, the schema would need adjustment.

    const newGestao = await db.insertInto('gestao')
      .values({
        code,
        name,
        department,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newGestao;
  }

  async findAll(): Promise<Gestao[]> {
    return db.selectFrom('gestao').selectAll().execute();
  }

  async findOne(id: number): Promise<Gestao> {
    const gestao = await db.selectFrom('gestao').selectAll().where('id', '=', id).executeTakeFirst();
    if (!gestao) {
      throw new NotFoundException('Gestão não encontrada');
    }
    return gestao;
  }

  async update(id: number, updateGestaoDto: UpdateGestorDto): Promise<Gestao> {
    const gestao = await db.selectFrom('gestao').selectAll().where('id', '=', id).executeTakeFirst();
    if (!gestao) {
      throw new NotFoundException('Gestão não encontrada');
    }

    const updatedFields: Partial<Gestao> = {
      updatedAt: new Date(),
    };

    if (updateGestaoDto.code !== undefined) {
      updatedFields.code = updateGestaoDto.code;
    }
    if (updateGestaoDto.name !== undefined) {
      updatedFields.name = updateGestaoDto.name;
    }
    if (updateGestaoDto.department !== undefined) {
      updatedFields.department = updateGestaoDto.department;
    }
    if (updateGestaoDto.role !== undefined) {
      updatedFields.role = updateGestaoDto.role;
    }

    // Password update should be handled via Auth service if it's in the Auth table
    // If it's meant to be updated here, the schema and logic need to be adjusted.

    const updatedGestao = await db.updateTable('gestao')
      .set(updatedFields)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return updatedGestao;
  }

  async remove(id: number): Promise<void> {
    const { numDeletedRows } = await db.deleteFrom('gestao').where('id', '=', id).executeTakeFirstOrThrow();
    if (Number(numDeletedRows) === 0) {
      throw new NotFoundException('Gestão não encontrada');
    }
  }
}


