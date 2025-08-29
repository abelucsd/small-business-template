import express from 'express';
import cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';
import { userRouter } from './users/routes.js';
import { customerRouter } from './customers/routes.js';
import { categoryRouter } from './categories/routes.js';
import { productRouter } from './products/routes.js';

const app = express();
app.use(express.json());

app.use(cors());

// swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use('/users', userRouter);
app.use('/customers', customerRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

export default app;