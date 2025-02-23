// src/gestao/gestao.module.ts
import { Module } from '@nestjs/common';
import { GestaoService } from './gestor.service';
import { GestaoController } from './gestor.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Gestao } from './entities/gestor.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Gestao])],
  controllers: [GestaoController],
  providers: [GestaoService],
})
export class GestaoModule {}