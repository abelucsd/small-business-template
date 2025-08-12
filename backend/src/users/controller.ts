import type { Request, Response, NextFunction } from 'express';
import * as userService from './service.js';
import { appLogger } from '../utils/logger.js';
import { Types } from 'mongoose';

const logger = appLogger.child({ service: 'user-controller' });


export const createUser = async( req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[createUser] Received request to create a new User.');

    const { firstname, lastname, email, password } = req.body;
    const newUser = await userService.createUser({ firstname, lastname, email, password });

    logger.info(`[createProduct] Successfully created User with ID: ${newUser._id}`);
    res.status(201).json(newUser);
  } catch (error) {    
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[getUsers] Received request to get all User.');
    
    const users = await userService.getUsers();

    logger.info(`[getUser] Successfully fetched User(s).`);
    res.status(200).json(users);
  } catch (error) {        
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid user ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);

    const user = await userService.getUserById(_id);
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
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid user ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);
    const updatedUser = await userService.updateUser(_id, req.body);
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
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid user ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);
    const deletedUser = await userService.deleteUser(_id);
    if (deletedUser == null) {
      res.status(404).json({ message: 'User not found' });
    }    

    res.status(200).json(`Deleted user with ID ${deletedUser!._id}`);
  } catch (error) {
    next(error);
  }
};