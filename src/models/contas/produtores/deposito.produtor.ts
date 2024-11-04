import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Queues } from '@/common/queues/queues.enum';
import { Jobs } from '@/common/queues/jobs.enum';

export type DadosDeDeposito = {
  depositoId: number;
};

@Injectable()
export class DepositoProdutor {
  constructor(@InjectQueue(Queues.DEPOSITO) private queue: Queue) {}

  async add(data: DadosDeDeposito): Promise<void> {
    this.queue.add(Jobs.DEPOSITO, data, {
      removeOnComplete: true,
    });
  }
}
