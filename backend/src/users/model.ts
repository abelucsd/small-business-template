import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface CreateUser {  
  id?: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
};

export interface IUser extends CreateUser {
  _id: string;  
};

const userSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);