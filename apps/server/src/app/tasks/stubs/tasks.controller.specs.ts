import { ITask } from '../../../../../../libs/shared/domain/src/lib/task.interface';

export const tasksStub = (): ITask => {
  return {
    _id: '23hd8c334838l',
    name: 'Wash car',
    isDone: true,
  };
};
