import type { CreateUser, IUser } from "./model.js";
import { User } from "./model.js";
import { getNextId } from "../shared/counter.model.js";
import { CustomError } from "../shared/CustomError.js";
import { appLogger } from "../utils/logger.js";


const logger = appLogger.child({ service: 'user' });

export const createUser = async (userData: CreateUser): Promise<IUser> => {
  try {    
    const nextId = await getNextId('user');
    const newUser = {...userData, id: `user-${nextId}`};
    logger.info(`[createUser] Creating user ${newUser.id}`);
    const user = await User.create(newUser);
    logger.info(`[createUser] Created user ${newUser.id}`);
    return user;
  } catch (error) {    
    const err = new CustomError('Failed to create user', 400);    
    throw err;
  }
};

export const getUsers = async (): Promise<IUser[]> => {
  try {
    logger.info(`[getUsers] Returning user(s).`);
    return await User.find({});
  } catch (error) {
    const err = new CustomError('Failed to fetch users', 500);
    throw err;
  } 
};

export const getUserById = async (_id: string): Promise<IUser | null> => {
  try {
    logger.info(`[getUserById] Fetching user with ID: ${_id}`);    
    return await User.findById(_id);
  } catch (error) {
    const err = new CustomError('Failed to fetch customer by ID', 404);      
    throw err;
  }
};

export const updateUser = async (_id: string, userData: Partial<CreateUser>): Promise<IUser | null> => {
  try {
    logger.info(`[updateUser] Updating user with ID: ${_id}`);
    const user = await User.findByIdAndUpdate({_id}, {$set: userData}, {new: true});    
    logger.info(`[updateUser] Updated user with ID: ${_id}`);
    return user;
  } catch (error) {
    const err = new CustomError('Failed to update user', 404);      
    throw err;
  }
};

export const deleteUser = async (_id: string): Promise<IUser | null> => {
  try {
    logger.info(`[deleteUser] Delete user with ID: ${_id}`);
    const result = await User.findByIdAndDelete(_id);    
    logger.info(`[deleteUser] Deleted user with ID: ${_id}`);
    return result;
  } catch (error) {
    const err = new CustomError('Failed to delete user.', 404);
    throw err;
  }
};