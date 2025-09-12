import type { IUser, UserDocument } from "../users/model.js";
import { User } from "../users/model.js"

export const login = async(email: string, password: string): Promise<UserDocument | number> => {
  const user = await User.findOne({email: email});

  if (!user || !(await user.correctPassword(password))) {
    return 401;
  }

  return user;
}