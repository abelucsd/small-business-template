import mongoose from 'mongoose';
const { Schema } = mongoose;

interface ICounter extends Document {
  _id: string;
  seq: number;
};

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export async function getNextId(modelName: string) {
  const ret = await Counter.findByIdAndUpdate(
    modelName,
    { $inc: {seq: 1} },
    { new: true, upsert: true }    
  );
  return ret.seq;
};

const Counter = mongoose.model<ICounter>('Counter', CounterSchema);