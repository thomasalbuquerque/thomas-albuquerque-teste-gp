import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Queues } from '@/common/queues/queues.enum';
import { Jobs } from '@/common/queues/jobs.enum';

export type DadosDeSaque = {
  saqueId: number;
};

@Injectable()
export class SaqueProdutor {
  constructor(@InjectQueue(Queues.SAQUE) private queue: Queue) {}

  async add(data: DadosDeSaque): Promise<void> {
    this.queue.add(Jobs.SAQUE, data, {
      removeOnComplete: true,
    });
  }
}
