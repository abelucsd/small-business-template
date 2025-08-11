import app from './app.js';
import { logger } from './utils/logger.js';


const serverLogger = logger.child({ service: 'server' });

const server = app.listen(4000, () => {
  serverLogger.info('Listening on port 4000');
});
server.on('error', (err) => {
  serverLogger.error(`Server error ${err}`);
});