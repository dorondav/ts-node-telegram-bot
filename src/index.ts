// src/index.js
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {GetOneArticles} from './dataCollectors/one'
// const axios = require('axios');

dotenv.config();


const app: Express = express();
const port = process.env.PORT || 3000;


app.get('/', async (req: Request, res: Response) => {
  try {
    const oneArticles = await GetOneArticles()

    
    res.json(oneArticles)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
