import puppeteer from 'puppeteer';
import { logger } from '../lib/logger';
import { createArticleArrayFromObject } from '../utils/functions';
import { WallaPageData } from '../Types/type';
export async function scrapeData() {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  try {
// ToDo break this to functions 
    
    await page.goto('https://www.walla.co.il/', { waitUntil: 'networkidle0' });

    //Get main story articles from walla
    const mainData = await page.evaluate((): WallaPageData => {
      const title = [document.querySelector('.drama-wide-wrapper .main-item h2')?.textContent || ''];
      const smallTitle = [document.querySelector('.drama-wide-wrapper .main-item .roof')?.textContent || ''];
      const url = [document.querySelector('.drama-wide-wrapper .main-item a')?.getAttribute('href') || ''];
      const body = [document.querySelector('.drama-wide-wrapper .main-item p')?.textContent || ''];

      return { title, smallTitle, url, body };
    });
    //Get list of secondary articles from walla
    const data = await page.evaluate((): WallaPageData => {
      const getTextFromElements = (selector: string) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => element.textContent?.trim() || '');
      };

      const smallTitle = getTextFromElements('.main-taste li .roof ');
      const title = getTextFromElements('.main-taste li h3');
      const getArticleLInk = document.querySelectorAll('.main-taste li a');
      const url = [...getArticleLInk].map((e) => e.getAttribute('href')) as string[];

      return { title, smallTitle, url };
    });

    // Close the browser
    await browser.close();

    // format the article data structure - so each story will be his on array
    const article = createArticleArrayFromObject(data,'Walla');
    const mainStory = createArticleArrayFromObject(mainData,"Walla");

    return { article, mainStory };
  } catch (error) {
    logger.error('[scraper]: ', error);
  }
}
