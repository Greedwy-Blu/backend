import { Module } from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { FuncionarioController } from './funcionario.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Funcionario } from './entities/funcionario.entity'

@Module({
  imports: [MikroOrmModule.forFeature([Funcionario])],
  controllers: [FuncionarioController],
  providers: [FuncionarioService],
})
export class FuncionarioModule {}