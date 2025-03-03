import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { Funcionario } from '../colaborador/entities/funcionario.entity';
import { Gestao } from '../gestor/entities/gestor.entity';
import { Auth } from './entities/auth.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Auth, Funcionario, Gestao]), // Registra as entidades e repositórios
    PassportModule, // Habilita o Passport para autenticação
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa o ConfigModule para usar variáveis de ambiente
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'), // Chave secreta do JWT
        signOptions: { expiresIn: '1h' }, // Token expira em 1 hora
      }),
      inject: [ConfigService], // Injeta o ConfigService
    }),
  ],
  controllers: [AuthController], // Registra o controller
  providers: [
    AuthService, // Serviço de autenticação
    JwtStrategy, // Estratégia JWT
    {
      provide: 'APP_GUARD', // Registra o RolesGuard globalmente
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService, MikroOrmModule.forFeature([Auth, Funcionario, Gestao])], // Exporta o AuthService e os repositórios
})
export class AuthModule {}