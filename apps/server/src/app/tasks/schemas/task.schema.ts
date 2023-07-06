import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isDone: boolean;

  @Prop()
  endDate: Date;

  @Prop({ default: 0 })
  updatedCounter: Number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
