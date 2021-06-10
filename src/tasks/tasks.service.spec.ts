import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

describe('Tasks service', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TaskRepository],
    });
  });
});
