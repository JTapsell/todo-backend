import { Schema, Types, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IUser } from '../interfaces/userInterface';

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  todos: [{ type: Types.ObjectId, required: true, ref: 'Todo' }],
});

userSchema.plugin(uniqueValidator);

export const User = model<IUser & Document>('User', userSchema);
