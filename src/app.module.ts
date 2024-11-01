import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { ContasModule } from './models/contas/contas.module';

@Module({
  imports: [PrismaModule, ContasModule],
})
export class AppModule {}
