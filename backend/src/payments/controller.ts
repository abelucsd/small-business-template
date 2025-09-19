import type { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { config } from '../config/config.js';

const stripe = new Stripe(
  config.stripeKey
);


export const createCheckout = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { items, email } = req.body;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Test "},
            unit_amount: 2 * 100,
          },
          quantity: 1,
        },      
      ],
      mode: 'payment',
      success_url: "http://localhost:5173/payment-result?success=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/payment-result?success=false&session_id={CHECKOUT_SESSION_ID}",
    }); 

    res.json({ url: session.url })        
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Checkout session failed" });
  }
};