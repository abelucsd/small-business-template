import type { Request, Response, NextFunction } from 'express';
import * as userService from './service.js';
import { logger } from '../utils/logger.js';

const userLogger = logger.child({ service: 'user-controller' });


export const createUser = async( req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    userLogger.info('[createUser] Received request to create a new User.');

    const { firstname, lastname, email, password } = req.body;
    const newUser = await userService.createUser({ firstname, lastname, email, password });

    userLogger.info(`[createProduct] Successfully created User with ID: ${newUser._id}`);
    res.status(201).json(newUser);
  } catch (error) {    
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    userLogger.info('[getUsers] Received request to get all User.');
    
    const users = await userService.getUsers();

    userLogger.info(`[getUser] Successfully fetched User(s).`);
    res.status(200).json(users);
  } catch (error) {        
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id as string;
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id as string;
    const updatedUser = await userService.updateUser(userId, req.body);
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
    }    

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id as string;
    const deletedUser = await userService.deleteUser(userId);
    if (deletedUser == null) {
      res.status(404).json({ message: 'User not found' });
    }    

    res.status(200).json(`Deleted user with ID ${deletedUser!._id}`);
  } catch (error) {
    next(error);
  }
};