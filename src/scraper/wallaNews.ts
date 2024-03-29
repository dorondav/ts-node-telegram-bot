import puppeteer from 'puppeteer';
import { logger } from '../lib/logger';
import { createArticleArrayFromObject } from '../utils/functions';
import { WallaPageData } from '../Types/type';

export default async function scrapeWallaNews() {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.walla.co.il/', { waitUntil: 'domcontentloaded' });

    //Get main story articles from walla
    const mainData = await page.evaluate((): WallaPageData => {
      const title = [document.querySelector('.drama-wide-wrapper .main-item h2')?.textContent || ''];
      const smallTitle = [document.querySelector('.drama-wide-wrapper .main-item .roof')?.textContent || ''];
      const url = [document.querySelector('.drama-wide-wrapper .main-item a')?.getAttribute('href') || ''];
      const body = [document.querySelector('.drama-wide-wrapper .main-item p')?.textContent || ''];

      return { title, smallTitle, url, body };
    });
    //Get list of secondary articles from walla
    const articles = await page.evaluate((): WallaPageData => {
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
    const article = createArticleArrayFromObject(articles, 'Walla');
    const mainStory = createArticleArrayFromObject(mainData, 'Walla');
    const data = [...mainStory, ...article];

    return { data };
  } catch (error) {
    logger.error('[scraper: Walla News]: ', error);
  }
}
