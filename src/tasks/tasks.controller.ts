import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger: Logger = new Logger('Tasks Controller');

  constructor(private tasksService: TasksService) {}

  @Get()
  public getTasks(
    @Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} is getting all tasks`);
    return this.tasksService.getTasks(getTasksFilterDto, user);
  }

  @Get('/:id')
  public async getTaskById(
    @Param('id') taskId: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} is creating a new task with ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param('id') taskId: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, status, user);
  }

  @Delete('/:id')
  public deleteTask(
    @Param('id') taskId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(taskId, user);
  }
}
