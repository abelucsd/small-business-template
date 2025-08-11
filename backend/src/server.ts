import app from './app.js';
import { getDb } from './db/db.js';
import { logger } from './utils/logger.js';


const serverLogger = logger.child({ service: 'server' });

async function startServer() {
  try {
    await getDb();
    const server = app.listen(4000, () => {
      serverLogger.info('Listening on port 4000');
    });
    server.on('error', (err) => {
      serverLogger.error(`Server error ${err}`);
    });

  } catch (error) {
    serverLogger.error(`Error starting server: ${error}`)
  }
};

startServer();

