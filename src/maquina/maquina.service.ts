import { Injectable, NotFoundException } from '@nestjs/common';
import { Maquina } from './entities/maquina.entity';
import { CreateMaquinaDto } from './dto/create-maquina.dto';
import { UpdateMaquinaDto } from './dto/update-maquina.dto';
import { db } from '../config/database.config';

@Injectable()
export class MaquinaService {
  constructor() {}

  async create(createMaquinaDto: CreateMaquinaDto): Promise<Maquina> {
    const newMaquina = await db.insertInto('maquina')
      .values({
        ...createMaquinaDto,
        status: 'ativo',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return newMaquina;
  }

  async findAll(): Promise<Maquina[]> {
    return db.selectFrom('maquina').selectAll().execute();
  }

  async findOne(id: number): Promise<Maquina | null> {
    const maquina = await db.selectFrom('maquina').selectAll().where('id', '=', id).executeTakeFirst();
    return maquina || null;
  }

  async findByCodigo(codigo: string): Promise<Maquina | null> {
    const maquina = await db.selectFrom('maquina').selectAll().where('codigo', '=', codigo).executeTakeFirst();
    return maquina || null;
  }

  async update(id: number, updateMaquinaDto: UpdateMaquinaDto): Promise<Maquina> {
    const maquina = await this.findOne(id);
    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada.`);
    }

    const updatedMaquina = await db.updateTable('maquina')
      .set({
        ...updateMaquinaDto,
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
    return updatedMaquina;
  }

  async remove(id: number): Promise<void> {
    const { numDeletedRows } = await db.deleteFrom('maquina').where('id', '=', id).executeTakeFirstOrThrow();
    if (Number(numDeletedRows) === 0) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada.`);
    }
  }
}


