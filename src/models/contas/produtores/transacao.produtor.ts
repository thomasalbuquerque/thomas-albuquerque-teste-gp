import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Queues } from '@/common/queues/queues.enum';
import { Jobs } from '@/common/queues/jobs.enum';

type DadosDeDeposito = {
  depositoId: number;
};

type DadosDeSaque = {
  saqueId: number;
};

type DadosDeTransferencia = {
  transferenciaId: number;
};

@Injectable()
export class TransacaoProdutor {
  constructor(@InjectQueue(Queues.TRANSACAO) private queue: Queue) {}

  async addDepositoJob(data: DadosDeDeposito): Promise<void> {
    this.queue.add(Jobs.DEPOSITO, data);
  }

  async addSaqueJob(data: DadosDeSaque): Promise<void> {
    this.queue.add(Jobs.SAQUE, data);
  }

  async addTransferenciaJob(data: DadosDeTransferencia): Promise<void> {
    this.queue.add(Jobs.TRANSFERENCIA, data);
  }
}
