import { Task } from './task';

export const TASKS: Task[] = [
  {
    id: 0,
    name: 'Buy new clothes',
    isDone: false,
  },
  {
    id: 1,
    name: 'Clean bedroom',
    isDone: false,
    endDate: new Date('2023-06-23T23:00:00+0100'),
  },
  {
    id: 2,
    name: 'Fix kitchen lights',
    isDone: true,
  },
  {
    id: 3,
    name: 'Buy groceries',
    isDone: true,
  },
  {
    id: 4,
    name: 'Buy new clothes',
    isDone: false,
  },
];
