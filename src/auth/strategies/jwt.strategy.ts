// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Auth)
    private readonly authRepository: EntityRepository<Auth>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<Auth> {
    const { code } = payload;

    const auth = await this.authRepository.findOne(
      { code },
      { populate: ['funcionario', 'gestao'] }, // Carrega o relacionamento
    );

    if (!auth) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return auth;
  }
}