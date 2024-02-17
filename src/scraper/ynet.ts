import puppeteer from 'puppeteer';
import { logger } from '../lib/logger';
import { createArticleArrayFromObject } from '../utils/functions';
import { ScraperPageData } from '../Types/type';

export default async function scrapeYnet() {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  try {
    console.time('goto');

    await page.goto('https://www.ynet.co.il/', { waitUntil: 'domcontentloaded' });
    console.timeEnd('goto');

    //Get list of secondary articles from Ynet
    const mainStory = await page.evaluate((): ScraperPageData => {
      const title = [document.querySelector('[data-tb-region="Top story"] h1 span')?.textContent || ''];
      const url = [document.querySelector('[data-tb-region="Top story"] a')?.getAttribute('href') || ''];
      const body = [document.querySelector('[data-tb-region="Top story"] .slotSubTitle span')?.textContent || ''];

      return { title, url, body };
    });

    //Get list of secondary articles from Ynet
    const articleList = await page.evaluate((): ScraperPageData => {
      const getTextFromElements = (selector: string) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => element.textContent?.trim() || '');
      };

      const title = getTextFromElements('.YnetMultiStripRowsComponenta .slotView h2 span');
      const body = getTextFromElements('.YnetMultiStripRowsComponenta .slotView .slotSubTitle');
      // Each a article have 2 links (nodeLists) to the same place
      const getArticleLInk = document.querySelectorAll('.YnetMultiStripRowsComponenta .slotView a');
      const articleListArray = [...getArticleLInk];
      let i = articleListArray.length;
      while (i--) (i + 1) % 2 === 0 && articleListArray.splice(i, 1);

      const url = articleListArray.map((e) => e.getAttribute('href')) as string[];

      return { title, url, body };
    });

    // Close the browser
    await browser.close();

    // format the article data structure - so each story will be his on array
    const article = createArticleArrayFromObject(articleList, 'Ynet');
    const mainArticle = createArticleArrayFromObject(mainStory, 'Ynet');
    const data = [...mainArticle, ...article];

    return { data };
  } catch (error) {
    logger.error('[scraper: Ynet]: ', error);
  }
}
