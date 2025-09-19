import express from 'express';
import * as paymentController from './controller.js';

export const paymentRouter = express.Router();

paymentRouter.post('/create-checkout-session', paymentController.createCheckout);



