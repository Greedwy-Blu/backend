// src/auth/auth.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Funcionario } from '../colaborador/entities/funcionario.entity';
import { Gestao } from '../gestor/entities/gestor.entity';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: EntityRepository<Auth>,
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: EntityRepository<Funcionario>,
    @InjectRepository(Gestao)
    private readonly gestaoRepository: EntityRepository<Gestao>,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { code, password, role } = createAuthDto;

    // Verifica se o código já existe no Auth
    const existingAuth = await this.authRepository.findOne({ code });
    if (existingAuth) {
      throw new UnauthorizedException('Código já está em uso');
    }

    // Verifica se o código existe no Funcionario ou Gestao
    if (role === 'funcionario') {
      const funcionario = await this.funcionarioRepository.findOne({ code });
      if (!funcionario) {
        throw new NotFoundException('Funcionário não encontrado');
      }
    } else if (role === 'gestor') {
      const gestor = await this.gestaoRepository.findOne({ code });
      if (!gestor) {
        throw new NotFoundException('Gestor não encontrado');
      }
    } else {
      throw new UnauthorizedException('Role inválido');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const auth = new Auth();
    auth.code = code;
    auth.password = hashedPassword;
    auth.role = role;

    if (role === 'funcionario') {
      const funcionario = await this.funcionarioRepository.findOne({ code });
      if (funcionario) {
        auth.funcionario = funcionario; // Associa o Funcionario ao Auth
      }
    } else if (role === 'gestor') {
      const gestor = await this.gestaoRepository.findOne({ code });
      if (gestor) {
        auth.gestao = gestor; // Associa o Gestao ao Auth
      }
    }

    await this.em.persistAndFlush(auth);
    return auth;
  }

  async validateUser(code: string, password: string): Promise<Auth> {
    const auth = await this.authRepository.findOne(
      { code },
      { populate: ['funcionario', 'gestao'] }, // Carrega o relacionamento
    );

    if (!auth) {
      throw new UnauthorizedException('Código ou senha inválidos');
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Código ou senha inválidos');
    }

    return auth;
  }

  async login(auth: Auth) {
    const payload = {
      code: auth.code,
      sub: auth.id,
      role: auth.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}