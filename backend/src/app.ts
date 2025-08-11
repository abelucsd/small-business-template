import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';
import { userRouter } from './users/routes.js';

const app = express();
app.use(express.json());

// swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use('/users', userRouter);

export default app;