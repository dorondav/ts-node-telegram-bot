import { Article } from '../Types/type';
import { v4 as uuidv4 } from 'uuid';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { logger } from '../lib/logger';
const oneArticles: Article[] = [];
const wallaArticles: Article[] = [];
const ynetArticles: Article[] = [];

async function scrapeTitles(url: string) {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    logger.error(`[Services]: API Request ${error}`);
  }
}

const numberOfPagesToShow = (articleNum: number) => {
  return articleNum <= 0 ? 1 : articleNum - 1;
};

const getYnetArticles = async (numOfArticles: number = 1) => {
  const origin = 'Ynet News';
  const date = new Date();
  const id = uuidv4();
  // const maxArticles = numberOfPagesToShow(numOfArticles);
  const main = true;

  const html = await scrapeTitles('https://www.ynet.co.il/');
  const $ = cheerio.load(html?.data);
/*
 const att =  $('.slotView').get().map(x => $(x).attr('data-tb-owning-region-name'))

  console.log(att);
  */
 
  $('.slotView').each((index, element) => {
         console.log($(element).attr('data-tb-owning-region-name'));
      
      
    // if (index > maxArticles) return;
    const link = $(element).find('a').attr('href') ?? '';
    const title = $(element).find('span').text().trim();
    ynetArticles.push({ id, title, link, main, origin, date });
        
  });

  
 

  return ynetArticles;
};
const getOneArticles = async (numOfArticles: number = 1) => {
  const html = await scrapeTitles('https://m.one.co.il/mobile/');
  const $ = cheerio.load(html?.data);
  // console.log('HTML Response:', html?.data);
  const date = new Date();
  const origin = 'One';
  const id = uuidv4();
  const maxArticles = numberOfPagesToShow(numOfArticles);
  let main = true;
  $('.mobile-hp-article-top').each((index, element) => {
    const link = $(element).attr('href') ?? '';
    const title = $(element).find('h2').text().trim();
    const image = $(element).find('img').attr('src') ?? '';
    oneArticles.push({ id, title, link, image, main, origin, date });
  });
  main = false;
  $('.mobile-hp-article-plain').each((index, element) => {
    if (index > maxArticles) return;
    const link = $(element).attr('href') ?? '';
    const title = $(element).find('h1').text().trim();
    oneArticles.push({ id, title, link, main, origin, date });
  });
  return oneArticles;
};

const getWallaArticles = async (numOfArticles: number = 1) => {
  const origin = 'Walla';
  const date = new Date();
  const id = uuidv4();
  const maxArticles = numberOfPagesToShow(numOfArticles);
  let main = true;

  const html = await scrapeTitles('https://www.walla.co.il/');
  const $ = cheerio.load(html?.data);
  // console.log('HTML Response:', html?.data);

  $('.main-item').each((index, element) => {
    const link = $(element).find('a').attr('href') ?? '';
    const title = $(element).find('h2').text().trim();
    const img = $(element).find('img').attr('srcset') ?? '';
    const image = img.split(' ')[0];

    wallaArticles.push({ id, title, link, image, main, origin, date });
  });
  main = false;

  $('.main-taste li').each((index, element) => {
    if (index > maxArticles) return;
    const link = $(element).find('a').attr('href') ?? '';
    const title = $(element).find('h3').text().trim();
    wallaArticles.push({ id, title, link, main, origin, date });
  });
  return wallaArticles;
};

export { getOneArticles, getWallaArticles, getYnetArticles };
