import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Queues } from '@/common/queues/queues.enum';
import * as basicAuth from 'express-basic-auth';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => {
        const url = new URL(process.env.REDIS_QUEUE_URL);

        return {
          redis: {
            host: url.hostname,
            password: url.password,
            port: parseInt(url.port),
            username: url.username,
            sentinelMaxConnections: 2,
          },
        };
      },
    }),
    BullBoardModule.forRoot({
      route: process.env.QUEUES_PREFIX,
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      ...Object.values(Queues).map((queue) => ({
        name: queue,
        adapter: BullAdapter,
      })),
    ),
  ],
})
export class QueueModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        basicAuth({
          users: process.env.QUEUES_USERS.split(',').reduce((acc, user) => {
            const [username, password] = user.split(':');
            acc[username] = password;
            return acc;
          }, {}),
          challenge: true,
          realm: 'Queue API',
        }),
      )
      .forRoutes(`/${process.env.QUEUES_PREFIX}/*`);
  }
}
