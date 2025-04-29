// src/maquina/maquina.module.ts
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MaquinaService } from './maquina.service';
import { MaquinaController } from './maquina.controller';
import { Maquina } from './entities/maquina.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Maquina]),
    AuthModule,
  ],
  controllers: [MaquinaController],
  providers: [MaquinaService],
  exports: [MaquinaService],
})
export class MaquinaModule {}
