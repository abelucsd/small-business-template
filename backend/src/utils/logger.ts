import fs from 'fs';
import path from 'path';

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFilePath = path.join(logDir, 'app.log');

const writeToFile = (msg: string) => {
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} ${msg}\n`;
  fs.appendFileSync(logFilePath, logLine);
};

export const createLogger = (context: string) => {
  const isTest = process.env.NODE_ENV === 'test';
  return {
    info: (msg: string) => {

      const formatted = `INFO [${context}]: ${msg}`;
      writeToFile(formatted);
    },
    error: (msg: string) => {
      if (isTest) return;

      const formatted = `ERROR [${context}]: ${msg}`;
      writeToFile(formatted);
    },
  }
};