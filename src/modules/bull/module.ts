import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReminderProcessor } from './processor';
import { REMINDERS_QUEUE_NAME } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OneTimeReminder, RecurringReminder } from './entity';
import { RecurringReminderService } from './services/recurring';
import { OneTimeReminderService } from './services/one-time';
import { OneTimeReminderController } from './controllers/one-time';
import { RecurringReminderController } from './controllers/reccuring';

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
      name: REMINDERS_QUEUE_NAME,
    }),
    TypeOrmModule.forFeature([OneTimeReminder, RecurringReminder]),
  ],
  providers: [
    ReminderProcessor,
    RecurringReminderService,
    OneTimeReminderService,
  ],
  exports: [BullModule],
  controllers: [OneTimeReminderController, RecurringReminderController],
})
export class CustomBullModule {}
