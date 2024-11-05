import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { ContasModule } from './models/contas/contas.module';
import { QueueModule } from './common/queues/queues.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ContasModule,
    QueueModule,
    RedisModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
