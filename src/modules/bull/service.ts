import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TEST_PROCESSOR_QUEUE_NAME } from './constants';

@Injectable()
export class TestService {
  constructor(@InjectQueue(TEST_PROCESSOR_QUEUE_NAME) private queue: Queue) {}

  async addJob(data: any) {
    await this.queue.add(data);
  }
}
