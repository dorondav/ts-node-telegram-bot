// src/index.js
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { logger } from './lib/logger';
import router from './routes/news';
import newsBot from './bot/bot';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
//Init Telegram News Bot
newsBot();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONT_URL as string);
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', async (req: Request, res: Response) => {
  try {
    res.json('hi');
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }
});
app.use('/news', router);
app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
