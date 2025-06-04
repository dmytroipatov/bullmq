import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiProperty } from '@nestjs/swagger';
import { RecurringReminderService } from '../services/recurring';

export class CreateRecurringReminderDto {
  @ApiProperty()
  interactorId: number;

  @ApiProperty()
  chatId: number;

  @ApiProperty()
  message: string;

  @ApiProperty({
    description: 'Cron expression (e.g. "0 9 * * 1" for every Monday at 9am)',
    example: '0 9 * * *',
  })
  cron: string;
}

@ApiTags('recurring-reminders')
@Controller('recurring-reminders')
export class RecurringReminderController {
  constructor(private readonly service: RecurringReminderService) {}

  @Post()
  create(@Body() dto: CreateRecurringReminderDto) {
    return this.service.create(dto);
  }
}
