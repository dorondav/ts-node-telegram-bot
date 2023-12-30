import { Article } from '../Types/type';
import { v4 as uuidv4 } from 'uuid';
import * as cheerio from 'cheerio';
import axios from 'axios';
import {logger } from '../lib/logger'
const oneArticles: Article[] = [];
const wallaArticles: Article[] = [];
async function scrapeTitles(url: string) {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    logger.error(`[Services]: API Request ${error}`);
  }
} 
/*TODO: 
try to understand if you want all the sites in one array or
deferent arrays dor each site - so you can easily get only the first x results 

*/
const getOneArticles = async () => {
  const html = await scrapeTitles('https://m.one.co.il/mobile/');
  const $ = cheerio.load(html?.data);
  // console.log('HTML Response:', html?.data);
  const date = new Date();
  const origin = 'One';
  const id = uuidv4();

  $('.mobile-hp-article-top').each((index, element) => {
    const link = $(element).attr('href') ?? '';
    const title = $(element).find('h2').text().trim();
    const image = $(element).find('img').attr('src') ?? '';
    oneArticles.push({ id, title, link, image, origin, date });
  });
  $('.mobile-hp-article-plain').each((index, element) => {
    const link = $(element).attr('href') ?? '';
    const title = $(element).find('h1').text().trim();
    const image = $(element).find('img').attr('src') ?? '';
    oneArticles.push({ id, title, link, image, origin, date });
  });
  return oneArticles;
};

const getWallaArticles = async () => {
  const origin = 'Walla';
  const date = new Date();
  const id = uuidv4();

  const html = await scrapeTitles('https://www.walla.co.il/');
  const $ = cheerio.load(html?.data);
  // console.log('HTML Response:', html?.data);

  $('.main-taste li').each((index, element) => {
    console.log('e', $(element));
    const link = $(element).find('a').attr('href') ?? '';
    const title = $(element).find('h3').text().trim();
    const image = $(element).find('a article .wrap-img figure picture img').attr('src') ?? '';

    wallaArticles.push({ id, title, link, image, origin, date });
  });

  return wallaArticles;
};
export { getOneArticles, getWallaArticles };
