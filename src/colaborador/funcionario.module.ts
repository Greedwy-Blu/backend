import { Module } from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { FuncionarioController } from './funcionario.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Funcionario } from './entities/funcionario.entity'
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MikroOrmModule.forFeature([Funcionario]), AuthModule,],
  controllers: [FuncionarioController],
  providers: [FuncionarioService],
})
export class FuncionarioModule {}