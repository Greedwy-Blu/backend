import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata(process.env.ROLES_KEY, roles);