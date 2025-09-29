import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.resolve('logs');
fs.mkdirSync(logDir, { recursive: true });

const logFilePath = path.join(logDir, 'combined.log');
const errorFilePath = path.join(logDir, 'error.log');

export const appLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),  
  transports: [
    new winston.transports.Console(),    
    new winston.transports.File({ filename: logFilePath}),
    new winston.transports.File({ filename: errorFilePath, level: 'error'}),
  ]
});