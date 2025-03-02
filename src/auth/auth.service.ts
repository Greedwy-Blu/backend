import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MikroORM } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity'
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Funcionario } from './../colaborador/entities/funcionario.entity';
import { Gestao } from './../gestor/entities/gestor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: EntityRepository<Auth>,
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: EntityRepository<Funcionario>,
    @InjectRepository(Gestao)
    private readonly gestaoRepository: EntityRepository<Gestao>,
    private readonly orm: MikroORM,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<Auth> {
    const auth = new Auth();
    auth.username = createAuthDto.username;
    auth.password = await bcrypt.hash(createAuthDto.password, 10); // Hash da senha
    auth.role = createAuthDto.role;

    await this.em.persistAndFlush(auth);
    return auth;
  }

  async findAll(): Promise<Auth[]> {
    return this.authRepository.findAll();
  }

  async findOne(id: number): Promise<Auth> {
    const auth = await this.authRepository.findOne(id);
    if (!auth) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return auth;
  }

  async findByUsername(username: string): Promise<Auth> {
    const auth = await this.authRepository.findOne({ username });
    if (!auth) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return auth;
  }

  async validateUser(username: string, password: string): Promise<Funcionario | Gestao> {
    const auth = await this.authRepository.findOne({ username });
    if (!auth) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Retorna o funcionário ou gestor com base no role
    if (auth.role === 'funcionario') {
      const funcionario = await this.funcionarioRepository.findOne({ code: auth.username });
      if (!funcionario) {
        throw new NotFoundException('Funcionário não encontrado');
      }
      return funcionario;
    } else if (auth.role === 'gestor') {
      const gestor = await this.gestaoRepository.findOne({ code: auth.username });
      if (!gestor) {
        throw new NotFoundException('Gestor não encontrado');
      }
      return gestor;
    } else {
      throw new UnauthorizedException('Role inválido');
    }
  }

  async login(user: Funcionario | Gestao) {
    const payload = {
      username: user instanceof Funcionario ? user.nome : user.name,
      sub: user.id,
      role: user instanceof Funcionario ? 'funcionario' : 'gestor',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}