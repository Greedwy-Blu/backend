import { Module } from '@nestjs/common';
import { GestaoService } from './gestor.service';
import { GestaoController } from './gestor.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [GestaoController],
  providers: [GestaoService],
})
export class GestaoModule {}


