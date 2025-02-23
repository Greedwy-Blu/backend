import { Module } from '@nestjs/common';
import { SectorsService } from './sector.service';
import { SectorsController } from './sector.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Sector } from './entities/sector.entity';
import { SectorConfig } from './entities/sector-config.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Sector, SectorConfig])],
  controllers: [SectorsController],
  providers: [SectorsService],
})
export class SectorsModule {}