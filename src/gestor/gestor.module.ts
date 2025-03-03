// src/gestao/gestao.module.ts
import { Module } from '@nestjs/common';
import { GestaoService } from './gestor.service';
import { GestaoController } from './gestor.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Gestao } from './entities/gestor.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MikroOrmModule.forFeature([Gestao]), AuthModule,],
  controllers: [GestaoController],
  providers: [GestaoService],
})
export class GestaoModule {}