import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  public async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ id, user });
    //? This can also be written like this
    // const found = await this.taskRepository.findOne({where: {id, user}});
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
