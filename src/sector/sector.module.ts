import { Module } from '@nestjs/common';
import { SectorsService } from './sector.service';
import { SectorsController } from './sector.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SectorsController],
  providers: [SectorsService],
})
export class SectorsModule {}


