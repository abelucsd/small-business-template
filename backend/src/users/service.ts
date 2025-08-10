import type { CreateUser, IUser } from "./model.js";
import { User } from "./model.js";
import { CustomError } from "../shared/CustomError.js";
import { logger } from "../utils/logger.js";


const userLogger = logger.child({ service: 'user' });

export const createUser = async (userData: CreateUser): Promise<IUser> => {
  try {
    userLogger.info(`[createUser] Creating user ${userData.id}`);
    const user = await User.create(userData);
    userLogger.info(`[createUser] Created user ${userData.id}`);
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

export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    logger.info(`[getUserById] Fetching user with ID: ${id}`);
    return await User.findOne({id: id});
  } catch (error) {
    const err = new CustomError('Failed to fetch customer by ID', 404);      
    throw err;
  }
};

export const updateUser = async (id: string, userData: Partial<CreateUser>): Promise<IUser | null> => {
  try {
    logger.info(`[updateUser] Updating user with ID: ${id}`);
    const user = await User.findOneAndUpdate({id: id}, {$set: userData}, { new: true });
    logger.info(`[updateUser] Updated user with ID: ${id}`);
    return user;
  } catch (error) {
    const err = new CustomError('Failed to update user', 404);      
    throw err;
  }
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    logger.info(`[deleteUser] Delete user with ID: ${id}`);
    const result = await User.deleteOne({ id: id });
    logger.info(`[deleteUser] Deleted user with ID: ${id}`);
    return result.deletedCount === 1 ? true : false;
  } catch (error) {
    const err = new CustomError('Failed to delete user.', 404);
    throw err;
  }
};