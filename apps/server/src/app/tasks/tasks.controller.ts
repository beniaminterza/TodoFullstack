import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskServices: TasksService) {}

  @Get()
  async getTasks(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    getTasksDto: GetTasksDto,
  ) {
    return await this.taskServices.getTasks(getTasksDto);
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    return await this.taskServices.getTask(id);
  }

  @Post()
  async createTask(@Body(new ValidationPipe()) createTaskDto: CreateTaskDto) {
    return await this.taskServices.createTask(createTaskDto);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto,
  ) {
    return await this.taskServices.editTask(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskServices.deleteTask(id);
  }
}
