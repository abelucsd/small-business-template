import mongoose from 'mongoose';
import { User, type IUser } from '../users/model.js';
const { Schema } = mongoose;

interface ICounter extends Document {
  _id: string;
  seq: number;
};

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model<ICounter>('Counter', CounterSchema);

/**
 * WARNING: Only use in document creation.
 */
export async function getNextId(modelName: string) {
  const ret = await Counter.findByIdAndUpdate(
    modelName,
    { $inc: {seq: 1} },
    { new: true, upsert: true }
  );
  return ret.seq;
};

/**
 * WARNING: Only use when deleting all records in a model.
 */
export async function flushIds(modelName: string): Promise<boolean> {
  // Safeguard - check if model's collection is empty.
  const Model = modelCommandMap[modelName];
  if (Model === undefined) {
    return false;
  }
  const num_documents = await Model.countDocuments({});
  if (num_documents > 0) {
    return false;
  }
  
  await Counter.findByIdAndUpdate(
    modelName,
    { $set: {seq: 0} },
    { upsert: true },
  );
  return true;
};

const modelCommandMap: {[key: string]: mongoose.Model<IUser> | undefined } = {
  User,
}
