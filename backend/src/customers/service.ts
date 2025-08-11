import type { CreateCustomer, ICustomer } from "./model.js";
import { Customer } from "./model.js";
import { getNextId } from "../shared/counter.model.js";
import { CustomError } from "../shared/CustomError.js";
import { appLogger } from "../utils/logger.js";
import { createUser } from '../users/service.js';
import type { CreateUser } from "../users/model.js";


const logger = appLogger.child({ service: 'customer' });

export const createCustomer = async (customerData: CreateUser): Promise<ICustomer> => {
  try {    
    const newUser = await createUser(customerData);
    const nextId = await getNextId('Customer');
    const newCustomer = {id: `customer-${nextId}`, userId: newUser._id};
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
    return await Customer.find({});
  } catch (error) {
    const err = new CustomError('Failed to fetch Customers', 500);
    throw err;
  } 
};

export const getCustomerById = async (_id: string): Promise<ICustomer | null> => {
  try {
    logger.info(`[getCustomerById] Fetching Customer with ID: ${_id}`);    
    return await Customer.findById(_id);
  } catch (error) {
    const err = new CustomError('Failed to fetch customer by ID', 404);      
    throw err;
  }
};

export const updateCustomer = async (_id: string, CustomerData: Partial<CreateCustomer>): Promise<ICustomer | null> => {
  try {
    logger.info(`[updateCustomer] Updating Customer with ID: ${_id}`);
    const customer = await Customer.findByIdAndUpdate({_id}, {$set: CustomerData}, {new: true});    
    logger.info(`[updateCustomer] Updated Customer with ID: ${_id}`);
    return customer;
  } catch (error) {
    const err = new CustomError('Failed to update Customer', 404);      
    throw err;
  }
};

export const deleteCustomer = async (_id: string): Promise<ICustomer | null> => {
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