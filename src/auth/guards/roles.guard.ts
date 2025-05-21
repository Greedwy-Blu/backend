import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(process.env.ROLES_KEY, context.getHandler());
    if (!roles) {
      return true; // Se não houver restrições, permita o acesso
    }

    const request = context.switchToHttp().getRequest();
    const user = request;

    if (!roles.includes(user.user_role)) {
      throw new ForbiddenException('Você não tem permissão para realizar esta ação');
    }

    return true;
  }
}