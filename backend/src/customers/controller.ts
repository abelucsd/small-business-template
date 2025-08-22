import type { Request, Response, NextFunction } from 'express';
import * as customerService from './service.js';
import * as userService from '../users/service.js';
import { appLogger } from '../utils/logger.js';
import { Types } from 'mongoose';

const logger = appLogger.child({ service: 'Customer-controller' });


export const createCustomer = async( req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[createCustomer] Received request to create a new Customer.');

    const { firstname, lastname, email, password } = req.body;

    console.log("creating customer...")

    // get or create user.
    let user = await userService.getUserByEmail(email);    
    if (!user) {
      // create user
      user = await userService.createUser({ firstname, lastname, email, password });
    }
    
    console.log("createCustomer service layer...")
    const newCustomer = await customerService.createCustomer({userId: user._id});

    logger.info(`[createProduct] Successfully created Customer with ID: ${newCustomer._id}`);
    res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[getCustomers] Received request to get all Customer.');
    
    const customers = await customerService.getCustomers();

    logger.info(`[getCustomer] Successfully fetched Customer(s).`);
    res.status(200).json(customers);
  } catch (error) {        
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid Customer ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);

    const Customer = await customerService.getCustomerById(_id);
    if (!Customer) {
      res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(Customer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid Customer ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);

    const updateCustomer = req.body.customer;    
    const updatedCustomer = await customerService.updateCustomer(_id, updateCustomer);
    if (!updatedCustomer) {
      res.status(404).json({ message: 'Customer not found' });
    }
    
    const updateUser = req.body.user;
    const userId = updateCustomer.userId;
    const updatedUser = await userService.updateUser(userId, updateUser);
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid Customer ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);
    const deletedCustomer = await customerService.deleteCustomer(_id);
    if (deletedCustomer == null) {
      res.status(404).json({ message: 'Customer not found' });
    }    

    res.status(200).json(`Deleted Customer with ID ${deletedCustomer!._id}`);
  } catch (error) {
    next(error);
  }
};