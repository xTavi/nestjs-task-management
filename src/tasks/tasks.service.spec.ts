import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser: User = {
  username: 'Tavi',
  id: '123',
  password: 'securePassword',
  tasks: [],
};

describe('Tasks service', () => {
  let tasksService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('get Tasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      taskRepository.getTasks.mockResolvedValue('Some value');
      const result = await tasksService.getTasks(null, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('Some value');
    });
  });

  describe('get Task by id', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      const mockTask: Task = {
        id: '123',
        title: 'Title',
        description: 'something',
        status: TaskStatus.OPEN,
        user: null,
      };

      await taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('123', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.getTasks and handles an error', async () => {
      await taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', null)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
