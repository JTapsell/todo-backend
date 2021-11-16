import { Types } from "mongoose";

export interface ITodo {
  uid: Types.ObjectId;
  description: string;
  checked: boolean;
}
