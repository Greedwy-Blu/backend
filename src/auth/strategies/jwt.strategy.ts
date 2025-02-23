// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/entities/user.entity';
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly orm: MikroORM) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'fjnsvcas_asvamk23_nkcasjjnas_212368', 
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.orm.em.findOne(User, { id: payload.sub });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}