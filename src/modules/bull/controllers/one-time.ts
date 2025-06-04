import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiProperty } from '@nestjs/swagger';
import { OneTimeReminderService } from '../services/one-time';

export class CreateOneTimeReminderDto {
  @ApiProperty()
  interactorId: number;

  @ApiProperty()
  chatId: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  date: Date;
}

@ApiTags('one-time-reminders')
@Controller('one-time-reminders')
export class OneTimeReminderController {
  constructor(private readonly service: OneTimeReminderService) {}

  @Post()
  create(@Body() dto: CreateOneTimeReminderDto) {
    return this.service.create(dto);
  }
}
