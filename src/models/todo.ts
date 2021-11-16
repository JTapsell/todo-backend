import { Schema, Types, model, Document } from 'mongoose';

interface ITodo {
  uid: Types.ObjectId;
  description: string;
  checked: boolean
}

const todoSchema = new Schema({
  uid: { type: Types.ObjectId, required: true, ref: 'User' },
  description: { type: String, required: true },
  checked: { type: Boolean, required: true },
});

export const Todo = model<ITodo & Document>('Todo', todoSchema);
