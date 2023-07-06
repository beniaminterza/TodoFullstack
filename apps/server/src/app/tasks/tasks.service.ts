import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { GetTasksDto } from './dto/get-tasks.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getTasks(data: GetTasksDto): Promise<any> {
    console.log(data);

    let sortBy: string = data.sortBy ? data.sortBy : 'createdAt';
    let order: 1 | -1 = data.order === 1 ? 1 : -1;
    let sort = {};
    sort[sortBy] = order;

    let params = { createdAt: 1 };

    switch (data.filter) {
      case 'toDo':
        return await this.taskModel.find({ isDone: false }).sort([[sortBy, 1]]);
      case 'done':
        return await this.taskModel.find({ isDone: true }).sort([[sortBy, 1]]);
      case 'dateLimit':
        return await this.taskModel
          .where({ endDate: { $exists: true } })
          .sort([[sortBy, order]]);
      default:
        return await this.taskModel.find().sort([[sortBy, order]]);
    }
  }

  async getTask(id: string) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      let result = await this.taskModel.find({ _id: id });
      if (result[0]) return result[0];
      return NotFoundException;
    } else {
      return NotFoundException;
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<any> {
    const result = await this.taskModel.create({
      name: createTaskDto.name,
      endDate: createTaskDto.endDate,
    });
    console.log('CREATED TASK: ');
    console.log(result);
    return result;
  }

  async editTask(id: string, updateTaskDto: UpdateTaskDto): Promise<any> {
    console.log(id);
    const result = await this.taskModel.updateOne(
      { _id: id },
      {
        $set: {
          name: updateTaskDto.name,
          endDate: updateTaskDto.endDate,
          isDone: updateTaskDto.isDone,
        },
        $inc: { updatedCounter: 1 },
      },
    );
    console.log(result);
    return result;
  }

  async deleteTask(id: string): Promise<any> {
    const result = await this.taskModel.deleteOne({ _id: id });
    console.log(result);
    return result;
  }
}
