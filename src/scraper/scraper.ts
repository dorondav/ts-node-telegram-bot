import puppeteer from 'puppeteer';
import { logger } from '../lib/logger';
import { combineObjectArrays } from '../utils/functions';
import {WallaPageData} from '../Types/type';
export async function scrapeData() {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.walla.co.il/', { waitUntil: 'networkidle0' });
    // Scrape data from h3 elements with class 'data-tb-title'

    const data = await page.evaluate(():WallaPageData => {
      const getTextFromElements = (selector: string) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => element.textContent?.trim() || '');
      };

      const smallTitle = getTextFromElements('.main-taste li .roof ');
      const title = getTextFromElements('.main-taste li h3');

      const getArticleLInk = document.querySelectorAll('.main-taste li a');
      const url = [...getArticleLInk].map((e) => e.getAttribute("href"))as string[];
      
      return { title, smallTitle ,url};
    });

    // Close the browser
    await browser.close();

    //Combine data to a single array


    /* format the data to be better. use the WallaArticles */
    const article = combineObjectArrays(data);
    console.log(article);
     
    return article;
  } catch (error) {
    logger.error('[scraper]: ', error);
  }
}
