// src/index.js
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getOneArticles, getWallaArticles } from './services/articles';
import {logger} from './lib/logger'
// const axios = require('axios');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response) => {
  try {
    const wallaArticles = await getWallaArticles(5);
    const oneArticles = await getOneArticles(5);

    oneArticles.forEach((img) => {
      console.log('main',img.image);
    });
    res.json(wallaArticles);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
