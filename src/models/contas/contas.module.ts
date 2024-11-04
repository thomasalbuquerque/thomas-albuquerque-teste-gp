import { Module } from '@nestjs/common';
import { ContasController } from '@/models/contas/contas.controller';
import { ContasService } from '@/models/contas/contas.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { Queues } from '@/common/queues/queues.enum';
import { DepositoProdutor } from './produtores/deposito.produtor';
import { DepositoConsumidor } from './consumidores/deposito.consumidor';
import { SaqueProdutor } from './produtores/saque.produtor';
import { SaqueConsumidor } from './consumidores/saque.consumidor';
import { TransferenciaProdutor } from './produtores/transferencia.produtor';
import { TransferenciaConsumidor } from './consumidores/transferencia.consumidor';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue(
      { name: Queues.DEPOSITO },
      { name: Queues.SAQUE },
      { name: Queues.TRANSFERENCIA },
    ),
  ],
  controllers: [ContasController],
  providers: [
    ContasService,
    DepositoProdutor,
    DepositoConsumidor,
    SaqueProdutor,
    SaqueConsumidor,
    TransferenciaProdutor,
    TransferenciaConsumidor,
  ],
})
export class ContasModule {}
