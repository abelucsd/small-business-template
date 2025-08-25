import app from './app.js';
import { getDb } from './db/db.js';
import { appLogger } from './utils/logger.js';


const logger = appLogger.child({ service: 'server' });

async function startServer() {
  try {
    await getDb();
    const server = app.listen(4000, () => {
      logger.info('Listening on port 4000');
    });
    server.on('error', (err) => {
      logger.error(`Server error ${err}`);
    });

  } catch (error) {
    logger.error(`Error starting server: ${error}`)
  }
};

startServer();

