import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Queues } from '@/common/queues/queues.enum';
import { Jobs } from '@/common/queues/jobs.enum';

export type DadosDeTransferencia = {
  transferenciaId: number;
};

@Injectable()
export class TransferenciaProdutor {
  constructor(@InjectQueue(Queues.TRANSFERENCIA) private queue: Queue) {}

  async add(data: DadosDeTransferencia): Promise<void> {
    this.queue.add(Jobs.TRANSFERENCIA, data, {
      removeOnComplete: true,
    });
  }
}
