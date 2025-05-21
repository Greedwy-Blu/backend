// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    
    if (!token) {
      console.log('Nenhum token foi fornecido na requisição');
      throw new UnauthorizedException('Token não fornecido');
    }

    console.log('Token JWT recebido:', token);

    // Validação padrão do JWT
    const isValid = await super.canActivate(context);
    if (!isValid) {
      console.log('Token inválido na validação padrão');
      throw new UnauthorizedException('Token inválido');
    }

    // Log do request.user antes da validação adicional
    console.log('Conteúdo do request.user antes da validação:', {
      user: request.user,
      headers: request.headers,
      method: request.method,
      url: request.url
    });

    // Validação adicional no banco de dados
    const user = request.user;
    const authValid = await this.authService.validateToken(user);
    if (!authValid) {
      console.log('Token inválido no banco de dados', {
        userId: user?.id,
        token: user?.token
      });
      throw new UnauthorizedException('Token expirado ou inválido');
    }

    // Log final após todas as validações
    console.log('Autenticação bem-sucedida. Dados completos do usuário:', {
      user: request.user,
      ip: request.ip,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    return null;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('Erro na autenticação:', {
        error: err,
        user,
        info
      });
      throw err || new UnauthorizedException('Não autorizado');
    }
    
    console.log('Usuário autenticado no handleRequest:', {
      id: user.id,
      role: user.role,
      email: user.email // Adicione outros campos relevantes
    });
    
    return user;
  }
}