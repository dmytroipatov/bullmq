import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TestProcessor } from './processor';
import { TEST_PROCESSOR_QUEUE_NAME } from './constants';
import { TestService } from './service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from './entity';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: TEST_PROCESSOR_QUEUE_NAME,
    }),
    TypeOrmModule.forFeature([TestEntity]),
  ],
  providers: [TestProcessor, TestService],
  exports: [BullModule],
})
export class CustomBullModule {}
