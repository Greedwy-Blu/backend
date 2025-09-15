import { Injectable, NotFoundException } from '@nestjs/common';
import { Sector } from './entities/sector.entity';
import { SectorConfig } from './entities/sector-config.entity';
import { AddSectorConfigDto } from './dto/add-sector-config.dto';
import { CreateSectorDto } from './dto/createSector.dto';
import { UpdateSectorDto } from './dto/updateSector.dto';
import { db } from '../config/database.config';

@Injectable()
export class SectorsService {
  constructor() {}

  // Cria um novo setor
  async create(createSectorDto: CreateSectorDto): Promise<Sector> {
    const newSector = await db.insertInto('sector')
      .values(createSectorDto)
      .returningAll()
      .executeTakeFirstOrThrow();
    return newSector;
  }

  // Lista todos os setores
  async findAll(): Promise<Sector[]> {
    return db.selectFrom('sector').selectAll().execute();
  }

  // Busca um setor pelo ID
  async findOne(id: number): Promise<Sector> {
    const sector = await db.selectFrom('sector').selectAll().where('id', '=', id).executeTakeFirst();
    if (!sector) {
      throw new NotFoundException('Setor não encontrado');
    }
    return sector;
  }

  // Atualiza um setor
  async update(id: number, updateSectorDto: UpdateSectorDto): Promise<Sector> {
    const sector = await db.selectFrom('sector').selectAll().where('id', '=', id).executeTakeFirst();
    if (!sector) {
      throw new NotFoundException('Setor não encontrado');
    }

    const updatedSector = await db.updateTable('sector')
      .set(updateSectorDto)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
    return updatedSector;
  }

  // Remove um setor
  async remove(id: number): Promise<void> {
    const { numDeletedRows } = await db.deleteFrom('sector').where('id', '=', id).executeTakeFirstOrThrow();
    if (Number(numDeletedRows) === 0) {
      throw new NotFoundException('Setor não encontrado');
    }
  }

  async addConfig(sectorId: number, addSectorConfigDto: AddSectorConfigDto): Promise<SectorConfig> {
    const sector = await db.selectFrom('sector').selectAll().where('id', '=', sectorId).executeTakeFirst();
    if (!sector) {
      throw new NotFoundException('Sector not found');
    }

    const newConfig = await db.insertInto('sector_config')
      .values({
        sectorId: sector.id,
        fieldName: addSectorConfigDto.fieldName,
        fieldType: addSectorConfigDto.fieldType,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newConfig;
  }
}


