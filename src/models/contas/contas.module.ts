import { Module } from '@nestjs/common';
import { ContasController } from '@/models/contas/contas.controller';
import { ContasService } from '@/models/contas/contas.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContasController],
  providers: [ContasService],
})
export class ContasModule {}
