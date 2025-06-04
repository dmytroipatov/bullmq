import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OneTimeReminder, ReminderStatus } from '../entity';
import { InjectQueue } from '@nestjs/bull';
import { REMINDERS_QUEUE_NAME } from '../constants';
import { Queue } from 'bull';

@Injectable()
export class OneTimeReminderService {
  constructor(
    @InjectRepository(OneTimeReminder)
    private readonly oneTimeReminderRepo: Repository<OneTimeReminder>,
    @InjectQueue(REMINDERS_QUEUE_NAME)
    private readonly remindersQueue: Queue,
  ) {}

  async create(data: {
    interactorId: number;
    chatId: number;
    message: string;
    date: Date;
  }): Promise<OneTimeReminder> {
    const reminder = await this.oneTimeReminderRepo.save(
      this.oneTimeReminderRepo.create({
        ...data,
        status: ReminderStatus.PENDING,
      }),
    );

    const delay = new Date(reminder.date).getTime() - Date.now();

    if (delay <= 0) {
      throw new Error();
    }

    await this.remindersQueue.add(
      'one_time_reminder',
      { reminderId: reminder.id },
      {
        delay,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return reminder;
  }
}
