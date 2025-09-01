import mongoose, { Types, model, Document } from 'mongoose';
const { Schema } = mongoose;
import bcrypt from "bcryptjs";

export interface CreateUser {  
  id?: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  role: string;
};

export interface IUser extends CreateUser {
  _id: Types.ObjectId;  
};

export interface IUserMethods {
  correctPassword(candidate: string): Promise<boolean>;
}

export type UserDocument = Document<unknown, {}, IUser> & IUser & IUserMethods;

const userSchema = new Schema<IUser, {}, IUserMethods>({
  id: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user"}
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// export const User = mongoose.model<IUser>('User', userSchema);
export const User = mongoose.model<IUser, mongoose.Model<UserDocument>>('User', userSchema);
