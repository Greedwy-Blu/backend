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
    console.log('Iniciando validação do token...');
  
    // Verifica se o token é válido usando o JwtAuthGuard padrão
    const isValid = await super.canActivate(context);
    if (!isValid) {
      console.error('Token inválido.');
      throw new UnauthorizedException('Token inválido');
    }
  
    // Obtém o usuário autenticado
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('Usuário autenticado:', user);
  
    // Verifica se o token está armazenado no banco de dados e se não expirou
    const auth = await this.authService.validateToken(user);
    if (!auth) {
      console.error('Token expirado ou inválido.');
      throw new UnauthorizedException('Token expirado ou inválido');
    }
  
    console.log('Token válido.');
    return true; // Retorna true para permitir o acesso
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Não autorizado');
    }
    return user;
  }
}