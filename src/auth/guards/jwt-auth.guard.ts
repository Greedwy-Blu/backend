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
  
    const isValid = await super.canActivate(context);
    if (!isValid) {
      console.error('Token inválido.');
      throw new UnauthorizedException('Token inválido');
    }
  
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('Usuário autenticado:', user);
  
    const auth = await this.authService.validateToken(user);
    if (!auth) {
      console.error('Token expirado ou inválido.');
      throw new UnauthorizedException('Token expirado ou inválido');
    }
  
    console.log('Token válido.');
    return true;
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Não autorizado');
    }
    return user;
  }
}