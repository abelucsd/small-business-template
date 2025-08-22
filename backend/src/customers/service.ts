import type { CreateCustomer, ICustomer } from "./model.js";
import { Customer } from "./model.js";
import { getNextId } from "../shared/counter.model.js";
import { CustomError } from "../shared/CustomError.js";
import { appLogger } from "../utils/logger.js";
import * as userService from '../users/service.js';
import type { CreateUser, IUser } from "../users/model.js";
import type { Types } from "mongoose";


const logger = appLogger.child({ service: 'customer' });

export const createCustomer = async (customerData: CreateCustomer): Promise<ICustomer> => {
  try {    
    // const newUser = await userService.createUser(customerData);
    const nextId = await getNextId('Customer');
    const newCustomer = { ...customerData, id: `customer-${nextId}`};
    logger.info(`[createCustomer] Creating Customer ${newCustomer.id}`);
    const customer = await Customer.create(newCustomer);
    logger.info(`[createCustomer] Created Customer ${newCustomer.id}`);
    return customer;
  } catch (error) {    
    const err = new CustomError('Failed to create Customer', 400);    
    throw err;
  }
};

export const getCustomers = async (): Promise<ICustomer[]> => {
  try {
    logger.info(`[getCustomers] Returning Customer(s).`);
    console.log("JKASL;DDJF;KLAQSDJDFK;LJASDF")
    const res = await Customer.find({}).populate('userId');        
    console.log('ASJD;FKLJAS;LKDFJ')
    console.log(res)
    return res
  } catch (error) {
    console.log(error)
    const err = new CustomError(`Failed to fetch Customers: ${error}`, 500);
    throw err;
  }
};

export const getCustomerById = async (_id: Types.ObjectId): Promise<ICustomer | null> => {
  try {
    logger.info(`[getCustomerById] Fetching Customer with ID: ${_id}`);
    return await Customer.findById(_id).populate('userId');
  } catch (error) {
    const err = new CustomError(`Failed to fetch customer by ID: ${error}`, 404);      
    throw err;
  }
};

export const updateCustomer = async (_id: Types.ObjectId, customerData: Partial<CreateCustomer>): Promise<ICustomer | null> => {
  try {
    logger.info(`[updateCustomer] Updating Customer with ID: ${_id}`);
    const customer = await Customer.findByIdAndUpdate({_id}, {$set: customerData}, {new: true});
    logger.info(`[updateCustomer] Updated Customer with ID: ${_id}`);
    return customer;
  } catch (error) {
    const err = new CustomError('Failed to update Customer', 404);      
    throw err;
  }
};

export const deleteCustomer = async (_id: Types.ObjectId): Promise<ICustomer | null> => {
  try {
    logger.info(`[deleteCustomer] Delete Customer with ID: ${_id}`);
    const result = await Customer.findByIdAndDelete(_id);    
    logger.info(`[deleteCustomer] Deleted Customer with ID: ${_id}`);
    return result;
  } catch (error) {
    const err = new CustomError('Failed to delete Customer.', 404);
    throw err;
  }
};