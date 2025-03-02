import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Funcionario } from '../../colaborador/entities/funcionario.entity';
import { Gestao } from '../../gestor/entities/gestor.entity';

// Interface para o payload do token JWT
interface JwtPayload {
  sub: number; // ID do usuário
  username: string; // Nome de usuário (opcional)
  role: string; // Role do usuário (funcionario ou gestor)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: EntityRepository<Funcionario>,
    @InjectRepository(Gestao)
    private readonly gestaoRepository: EntityRepository<Gestao>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'), // Garante que a chave secreta está definida
    });
  }

  async validate(payload: JwtPayload): Promise<Funcionario | Gestao> {
    const { sub: userId, role } = payload;

    if (role === 'funcionario') {
      const funcionario = await this.funcionarioRepository.findOne({ id: userId });
      if (!funcionario) {
        throw new UnauthorizedException('Funcionário não encontrado');
      }
      return funcionario;
    } else if (role === 'gestor') {
      const gestor = await this.gestaoRepository.findOne({ id: userId });
      if (!gestor) {
        throw new UnauthorizedException('Gestor não encontrado');
      }
      return gestor;
    } else {
      throw new UnauthorizedException('Role inválido');
    }
  }
}