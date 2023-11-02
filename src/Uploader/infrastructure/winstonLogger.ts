import winston from 'winston';
import Logger from '../domain/Logger';

enum Levels {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info'
}

export function winstonLogger(): Logger {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.prettyPrint(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.colorize(),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: `logs/${Levels.DEBUG}`, level: Levels.DEBUG }),
      new winston.transports.File({ filename: `logs/${Levels.INFO}`, level: Levels.INFO }),
      new winston.transports.File({ filename: `logs/${Levels.ERROR}`, level: Levels.ERROR })
    ]
  });
}
