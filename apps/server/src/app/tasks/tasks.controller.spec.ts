import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { describe } from 'node:test';
import { tasksStub } from './stubs/tasks.controller.specs';
import { ITask } from 'libs/shared/domain/src/lib/task.interface';
import { GetTasksDto } from './dto/get-tasks.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

jest.mock('./tasks.service');

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    tasksController = moduleRef.get<TasksController>(TasksController);
    tasksService = moduleRef.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  describe('getTask', () => {
    describe('when getTask is called', () => {
      let task: ITask;

      beforeEach(async () => {
        task = await tasksController.getTask(tasksStub()._id);
      });

      test('then it should call taskService', () => {
        expect(tasksService.getTask).toBeCalledWith(tasksStub()._id);
      });

      test('then it should return a task', () => {
        expect(task).toEqual(tasksStub());
      });
    });
  });

  describe('getTasks', () => {
    describe('when getTasks is called', () => {
      let tasks: ITask[];

      let getTaskDto: GetTasksDto = { filter: 'all', sortBy: 'name', order: 1 };

      beforeEach(async () => {
        tasks = await tasksController.getTasks(getTaskDto);
      });

      test('then it should call tasksService', () => {
        expect(tasksService.getTasks).toBeCalledWith(getTaskDto);
      });

      test('then it should return a task array', () => {
        expect(tasks).toEqual([tasksStub()]);
      });
    });
  });

  describe('createTask', () => {
    describe('when createTask is called', () => {
      let task: ITask;
      let createTaskDto: CreateTaskDto;

      beforeEach(async () => {
        createTaskDto = { name: 'Wash car' };
        task = await tasksController.createTask(createTaskDto);
      });

      test('then it should call tasksService', () => {
        expect(tasksService.createTask).toBeCalledWith(createTaskDto);
      });

      test('then it should return a task', () => {
        expect(task).toEqual(tasksStub());
      });
    });
  });

  describe('updateTask', () => {
    describe('when updateTask is called', () => {
      let task: ITask;
      let updateTaskDto: UpdateTaskDto;

      beforeEach(async () => {
        updateTaskDto = {
          name: 'Wash house',
          isDone: false,
        };
        task = await tasksController.updateTask(tasksStub()._id, updateTaskDto);
      });

      test('then it should call taskService', () => {
        expect(tasksService.editTask).toBeCalledWith(
          tasksStub()._id,
          updateTaskDto
        );
      });

      test('then it should return a task', () => {
        expect(task).toEqual(tasksStub());
      });
    });
  });

  describe('deleteTask', () => {
    describe('when deleteTask is called', () => {
      let task: ITask;

      beforeEach(async () => {
        task = await tasksController.deleteTask(tasksStub()._id);
      });

      test('then it should call taskService', () => {
        expect(tasksService.deleteTask).toBeCalledWith(tasksStub()._id);
      });

      test('then it should return a task', () => {
        expect(task).toEqual(tasksStub());
      });
    });
  });
});
