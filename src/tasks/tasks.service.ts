import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(getTasksFilterDto: GetTasksFilterDto): Task[] {
    const { status, search } = getTasksFilterDto;
    let tasks: Task[] = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.description.includes(search) || task.title.includes(search),
      );
    }

    return tasks;
  }

  public getTaskById(taskId: string): Task {
    const foundTask = this.tasks.find((task) => task.id === taskId);
    if (!foundTask) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return foundTask;
  }

  public createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      ...createTaskDto,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  public deleteTask(taskId: string): void {
    const found = this.getTaskById(taskId);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
