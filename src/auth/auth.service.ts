import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { db } from '../config/database.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { code, password } = createAuthDto;

    const existingAuth = await db.selectFrom('auth').selectAll().where('code', '=', code).executeTakeFirst();
    if (existingAuth) {
      throw new UnauthorizedException('Código já está em uso');
    }

    const funcionario = await db.selectFrom('funcionario').selectAll().where('code', '=', code).executeTakeFirst();
    const gestor = await db.selectFrom('gestao').selectAll().where('code', '=', code).executeTakeFirst();

    if (!funcionario && !gestor) {
      throw new NotFoundException('Código não encontrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let authData: Omit<Auth, 'id'> = {
      code: code,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: '', // Temporarily assign an empty string, will be updated below
    };

    if (funcionario) {
      authData.role = 'funcionario';
      authData.funcionarioId = funcionario.id;
    } else if (gestor) {
      authData.role = 'gestao';
      authData.gestaoId = gestor.id;
    }

    const newAuth = await db.insertInto('auth').values(authData).returningAll().executeTakeFirstOrThrow();
    return newAuth;
  }

  async validateUser(code: string, password: string): Promise<Auth> {
    const auth = await db.selectFrom('auth').selectAll().where('code', '=', code).executeTakeFirst();

    if (!auth) {
      throw new UnauthorizedException('Código ou senha inválidos');
    }

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

    const accessToken = this.jwtService.sign(payload);

    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 1);

    await db.updateTable('auth')
      .set({
        accessToken: accessToken,
        tokenExpiresAt: tokenExpiresAt,
        updatedAt: new Date(),
      })
      .where('id', '=', auth.id)
      .execute();

    const gestao = auth.gestaoId ? await db.selectFrom('gestao').selectAll().where('id', '=', auth.gestaoId).executeTakeFirst() : undefined;
    const funcionario = auth.funcionarioId ? await db.selectFrom('funcionario').selectAll().where('id', '=', auth.funcionarioId).executeTakeFirst() : undefined;

    return {
      access_token: accessToken,
      expires_at: tokenExpiresAt,
      role: auth.role,
      sub: auth.id,
      code: auth.code,
      userAuth: gestao?.id || funcionario?.id,
      user: gestao || funcionario,
    };
  }

  async validateToken(user: any): Promise<boolean> {
    try {
      if (!user?.id) {
        throw new Error('ID do usuário não encontrado no token.');
      }

      const auth = await db.selectFrom('auth').selectAll().where('id', '=', user.id).executeTakeFirst();

      if (!auth) {
        console.warn('Registro de autenticação não encontrado para o usuário:', user.id);
        return false;
      }

      if (!auth.accessToken || !auth.tokenExpiresAt) {
        console.warn('Token inválido: accessToken ou tokenExpiresAt não definidos.');
        return false;
      }

      if (auth.tokenExpiresAt < new Date()) {
        console.warn('Token expirado para o usuário:', user.id);
        return false;
      }

      return true;
    } catch (error: any) {
      console.error('Erro ao validar o token:', error.message);
      return false;
    }
  }
}


