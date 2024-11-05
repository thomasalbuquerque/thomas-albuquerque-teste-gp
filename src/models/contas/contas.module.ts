import { Module } from '@nestjs/common';
import { ContasController } from '@/models/contas/contas.controller';
import { ContasService } from '@/models/contas/contas.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { Queues } from '@/common/queues/queues.enum';
import { TransacaoProdutor } from './produtores/transacao.produtor';
import { TransacaoConsumidor } from './consumidores/transacao.consumidor';

@Module({
  imports: [PrismaModule, BullModule.registerQueue({ name: Queues.TRANSACAO })],
  controllers: [ContasController],
  providers: [ContasService, TransacaoProdutor, TransacaoConsumidor],
})
export class ContasModule {}
