import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // public getTasks(
  //   @Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto,
  // ): Task[] {
  //   if (Object.keys(getTasksFilterDto).length) {
  //     return this.tasksService.getTasksWithFilter(getTasksFilterDto);
  //   }
  //   return this.tasksService.getAllTasks();
  // }

  @Get('/:id')
  public async getTaskById(@Param('id') taskId: string): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param('id') taskId: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, status);
  }

  @Delete('/:id')
  public deleteTask(@Param('id') taskId: string): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }
}
