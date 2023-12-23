import { Article } from '../Types/type';
import { v4 as uuidv4 } from 'uuid';
import * as cheerio from 'cheerio';
import axios from 'axios';

const GetOneArticles = async () => {
  const articles: Article[] = [];
  async function scrapeTitles() {
    try {
        // 
      const response = await axios.get('https://m.one.co.il/mobile/');
      return response;
    } catch (error) {
      throw error;
    }
  }
  const html = await scrapeTitles();
  const $ = cheerio.load(html?.data);
  // console.log('HTML Response:', html?.data);

  $('.mobile-hp-article-top').each((index, element) => {
    console.log($(element));
    const link = $(element).attr('href') ?? '';
    const title = $(element).find('h2').text().trim();
    const image = $(element).find('img').attr('src') ?? '';
    const origin = 'One';
    const date = new Date();
    const id = uuidv4();
    articles.push({ id, title, link, image, origin, date });
  });
  $('.mobile-hp-article-plain').each((index, element) => {
    const link = $(element).attr('href') ?? '';
    const title = $(element).find('h1').text().trim();
    const image = $(element).find('img').attr('src') ?? '';
    const origin = 'One';
    const date = new Date();
    const id = uuidv4();
    articles.push({ id, title, link, image, origin, date });
  });
   return articles
};


export { GetOneArticles };
