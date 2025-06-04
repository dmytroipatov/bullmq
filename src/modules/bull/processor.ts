// reminder.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { REMINDERS_QUEUE_NAME } from './constants';

@Processor(REMINDERS_QUEUE_NAME)
export class ReminderProcessor {
  constructor() {}

  @Process('one_time_reminder')
  handleOneTimeReminder(job: Job<{ reminderId: string }>) {
    const { reminderId } = job.data;

    console.log(reminderId);
  }

  @Process('recurring_reminder')
  handleRecurringReminder(job: Job<{ reminderId: string }>) {
    const { reminderId } = job.data;

    console.log(reminderId);
  }
}
