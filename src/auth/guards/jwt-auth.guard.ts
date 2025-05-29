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
      
      throw new UnauthorizedException('Token não fornecido');
    }

    
    // Validação padrão do JWT
    const isValid = await super.canActivate(context);
    if (!isValid) {
     
      throw new UnauthorizedException('Token inválido');
    }

    // Log do request.user antes da validação adicional
    
    // Validação adicional no banco de dados
    const user = request.user;
    const authValid = await this.authService.validateToken(user);
    if (!authValid) {
     
      throw new UnauthorizedException('Token expirado ou inválido');
    }

    // Log final após todas as validações
   

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
    
   
    
    return user;
  }
}