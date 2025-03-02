// src/sectors/sectors.controller.ts
import { Body, Controller, Post, Param } from '@nestjs/common';
import { SectorsService } from './sector.service';
import { AddSectorConfigDto } from './dto/add-sector-config.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('sectors')
@ApiBearerAuth()
@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Post(':id/config')
  @ApiOperation({ summary: 'Adicionar uma configuração personalizada a um setor' })
  @ApiResponse({
    status: 201,
    description: 'Configuração adicionada com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID do setor', example: 1 })
  @ApiBody({ type: AddSectorConfigDto })
  async addConfig(
    @Param('id') id: number,
    @Body() addSectorConfigDto: AddSectorConfigDto,
  ) {
    return this.sectorsService.addConfig(id, addSectorConfigDto);
  }
}