import {
  BaseEntity,
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

export enum ReminderStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  ACTIVE = 'active',
}

export enum ReminderType {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
}

@Entity('reminders')
@TableInheritance({
  column: { type: 'enum', enum: ReminderType, name: 'type' },
})
export class Reminder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  interactorId: number;

  @Column()
  chatId: number;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.PENDING,
  })
  status: ReminderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@ChildEntity(ReminderType.ONE_TIME)
export class OneTimeReminder extends Reminder {
  @Column({ type: 'timestamp' })
  date: Date;
}

@ChildEntity(ReminderType.RECURRING)
export class RecurringReminder extends Reminder {
  @Column()
  cron: string;
}
