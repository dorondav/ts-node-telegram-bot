import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const combineTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/logs-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});


// combineTransport.on('rotate', function (oldFilename, newFilename) {
//   // do something fun
// });

export const logger = winston.createLogger({
  transports: [combineTransport, new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ message, level, timestamp }) => {
      return `${timestamp}:${level}:${message}`;
    }),
  ),
});
