// src/index.js
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { logger } from './lib/logger';

import newsBot from './bot/bot';
// const axios = require('axios');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
//Init Telegram News Bot
newsBot();

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

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
