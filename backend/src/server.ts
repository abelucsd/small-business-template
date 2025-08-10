
import type { Request, Response } from 'express';
import app from './app.js';
import { logger } from './utils/logger.js';


const serverLogger = logger.child({ service: 'server' });

async function startServer() {
  try {
    app.get('/', (req: Request, res: Response) => {
      res.status(200).json('Hello from the server!!!');
    });
    app.listen(4000, () => {
      serverLogger.info(`App is listening on port 4000`);
    });
  } catch (error) {
    serverLogger.error(`[startServer()] Error starting server: ${error}`);
    process.exit(1);
  }
};

startServer();