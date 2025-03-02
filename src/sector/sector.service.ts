import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Sector } from './entities/sector.entity';
import { SectorConfig } from './entities/sector-config.entity';
import { AddSectorConfigDto } from './dto/add-sector-config.dto';
import { CreateSectorDto } from './dto/createSector.dto';
import { UpdateSectorDto } from './dto/updateSector.dto';

@Injectable()
export class SectorsService {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: EntityRepository<Sector>,
    @InjectRepository(SectorConfig)
    private readonly sectorConfigRepository: EntityRepository<SectorConfig>,
    private readonly em: EntityManager, // Injete o EntityManager
  ) {}

    // Cria um novo setor
    async create(createSectorDto: CreateSectorDto): Promise<Sector> {
      const sector = this.sectorRepository.create(createSectorDto);
      await this.em.persistAndFlush(sector);
      return sector;
    }
  
    // Lista todos os setores
    async findAll(): Promise<Sector[]> {
      return this.sectorRepository.findAll();
    }
  
    // Busca um setor pelo ID
    async findOne(id: number): Promise<Sector> {
      const sector = await this.sectorRepository.findOne(id);
      if (!sector) {
        throw new NotFoundException('Setor não encontrado');
      }
      return sector;
    }
  
    // Atualiza um setor
    async update(id: number, updateSectorDto: UpdateSectorDto): Promise<Sector> {
      const sector = await this.sectorRepository.findOne(id);
      if (!sector) {
        throw new NotFoundException('Setor não encontrado');
      }
  
      this.sectorRepository.assign(sector, updateSectorDto);
      await this.em.flush();
      return sector;
    }
  
    // Remove um setor
    async remove(id: number): Promise<void> {
      const sector = await this.sectorRepository.findOne(id);
      if (!sector) {
        throw new NotFoundException('Setor não encontrado');
      }
  
      await this.em.removeAndFlush(sector);
    }

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