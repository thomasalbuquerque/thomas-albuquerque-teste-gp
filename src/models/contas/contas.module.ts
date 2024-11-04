import { Module } from '@nestjs/common';
import { ContasController } from '@/models/contas/contas.controller';
import { ContasService } from '@/models/contas/contas.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { Queues } from '@/common/queues/queues.enum';
import { DepositoProdutor } from './produtores/deposito.produtor';
import { DepositoConsumidor } from './consumidores/deposito.consumidor';

@Module({
  imports: [PrismaModule, BullModule.registerQueue({ name: Queues.DEPOSITO })],
  controllers: [ContasController],
  providers: [ContasService, DepositoProdutor, DepositoConsumidor],
})
export class ContasModule {}
