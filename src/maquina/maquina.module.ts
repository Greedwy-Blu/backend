import { Module } from '@nestjs/common';
import { MaquinaService } from './maquina.service';
import { MaquinaController } from './maquina.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [MaquinaController],
  providers: [MaquinaService],
  exports: [MaquinaService],
})
export class MaquinaModule {}


