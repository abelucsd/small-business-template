import { User, type IUser, type UserDocument } from "../users/model.js";
import { CustomError } from "../shared/CustomError.js";
import * as repository from './repository.js';
import { setAuthCookie, signToken } from "./jwt.js";

export const login = async (email: string, password: string): Promise<{user: UserDocument, token: string}> => {
  try {
    const user = await repository.login(email, password);
    let token: string;
    if (isUser(user))  {
      token = signToken({ sub: user.id, role: user.role as "user" | "admin" });  
    } else {
      throw new CustomError(`Failed to login with invalid credentials`, user);
    }

    return {user, token};
  } catch(error) {
    const err = new CustomError(`Failed to login ${error}`, 400);
    throw err;
  }
}

function isUser(obj: UserDocument | number): obj is UserDocument {
  return typeof obj !== "number";
}