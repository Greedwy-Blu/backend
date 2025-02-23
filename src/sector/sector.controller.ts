// src/sectors/sectors.controller.ts
import { Body, Controller, Post, Param } from '@nestjs/common';
import { SectorsService } from './sector.service';
import { AddSectorConfigDto } from './dto/add-sector-config.dto';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Post(':id/config')
  async addConfig(@Param('id') id: number, @Body() addSectorConfigDto: AddSectorConfigDto) {
    return this.sectorsService.addConfig(id, addSectorConfigDto);
  }
}