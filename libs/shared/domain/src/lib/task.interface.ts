export interface ITask {
  _id: string;
  name: string;
  isDone: boolean;
  endDate?: Date;
}
