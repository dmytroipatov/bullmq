import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecurringReminder, ReminderStatus } from '../entity';
import { InjectQueue } from '@nestjs/bull';
import { REMINDERS_QUEUE_NAME } from '../constants';
import { Queue } from 'bull';

@Injectable()
export class RecurringReminderService {
  constructor(
    @InjectRepository(RecurringReminder)
    private readonly recurringReminderRepo: Repository<RecurringReminder>,
    @InjectQueue(REMINDERS_QUEUE_NAME)
    private readonly remindersQueue: Queue,
  ) {}

  async create(data: {
    interactorId: number;
    chatId: number;
    message: string;
    cron: string;
  }): Promise<RecurringReminder> {
    const reminder = await this.recurringReminderRepo.save(
      this.recurringReminderRepo.create({
        ...data,
        status: ReminderStatus.PENDING,
      }),
    );

    await this.remindersQueue.add(
      'recurring_reminder',
      { reminderId: reminder.id },
      {
        repeat: { cron: reminder.cron },
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return reminder;
  }
}
