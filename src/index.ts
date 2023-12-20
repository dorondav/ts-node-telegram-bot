// src/index.js
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { User } from './Types/type';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';

// const axios = require('axios');

dotenv.config();

const user: User = {
  id: 123,
  firstName: 'doron',
  lastName: 'Davidowitz',
  username: 'dorondav',
};

const app: Express = express();
const port = process.env.PORT || 3000;
console.log(process.env.PORT);

async function scrapeTitles() {
  try {
    const response = await axios.get('https://www.one.co.il/');
    return response;
  } catch (error) {
    throw error;
  }
}

app.get('/', async (req: Request, res: Response) => {
  try {
    const html = await scrapeTitles(); // Assuming scrapeTitles returns a Promise

    const $ = cheerio.load(html?.data);
    // console.log('HTML Response:', html?.data);
    const articles: { title: string; link: string; image: string }[] = [];

    $('.one-secondaries-articles').each((index, element) => {
      console.log($(element))
      const link = $(element).attr('href') ?? '';
      const title = $(element).find('h2').text().trim();
      const image = $(element).find('img').attr('src') ?? '';

      articles.push({ title, link, image });
    });
    /*
    todo: 
    * 1. test if mobile version or web and execute the relevant code
    * 2. the title is empty- fix it
    * 3. destructure the code to functions 
    * 4. maybe add more values to the object
    * 5. add Articles type to articles const
    * 6. try to remove bad data from the array 
    */ 

    $('.mobile-hp-article-plain').each((index, element) => {
      console.log($(element))
      const link = $(element).attr('href') ?? '';
      const title = $(element).find('h1').text().trim();
      const image = $(element).find('img').attr('src') ?? '';

      articles.push({ title, link, image });
    });

    console.log('Articles:', articles);
    res.json(articles); // show as jason 
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
