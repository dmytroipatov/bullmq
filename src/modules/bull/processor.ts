import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TEST_PROCESSOR_QUEUE_NAME } from './constants';

@Processor(TEST_PROCESSOR_QUEUE_NAME)
export class TestProcessor {
  @Process()
  handleJob(job: Job) {
    console.log('Processing job:', job.data);
    return;
  }
}
