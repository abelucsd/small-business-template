import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;

export interface CreateCustomer {  
  id?: string;
  userId: Types.ObjectId;
};

export interface ICustomer extends CreateCustomer {
  _id: Types.ObjectId;  
};

const customerSchema = new Schema<ICustomer>({
  id: { type: String, required: true, unique: true },  
  userId: { type: Schema.Types.ObjectId, required: true, unique: true, ref: 'User'}
});

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);