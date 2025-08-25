import express, { Router } from 'express';
import * as customerController from './controller.js';

export const customerRouter = express.Router();

customerRouter.post('/', customerController.createCustomer);
customerRouter.get('/', customerController.getCustomers);
customerRouter.get('/:id', customerController.getCustomerById);
customerRouter.put('/:id', customerController.updateCustomer);
customerRouter.delete('/:id', customerController.deleteCustomer);