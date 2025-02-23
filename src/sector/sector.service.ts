import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Sector } from './entities/sector.entity';
import { SectorConfig } from './entities/sector-config.entity';
import { AddSectorConfigDto } from './dto/add-sector-config.dto';

@Injectable()
export class SectorsService {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: EntityRepository<Sector>,
    @InjectRepository(SectorConfig)
    private readonly sectorConfigRepository: EntityRepository<SectorConfig>,
    private readonly em: EntityManager, // Injete o EntityManager
  ) {}

  async addConfig(sectorId: number, addSectorConfigDto: AddSectorConfigDto): Promise<SectorConfig> {
    const sector = await this.sectorRepository.findOne(sectorId);
    if (!sector) {
      throw new NotFoundException('Sector not found');
    }

    const config = this.sectorConfigRepository.create({
      sector,
      fieldName: addSectorConfigDto.fieldName,
      fieldType: addSectorConfigDto.fieldType,
    });

    await this.em.persistAndFlush(config); // Use o EntityManager para persistir e sincronizar
    return config;
  }
}