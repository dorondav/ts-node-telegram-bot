import puppeteer from 'puppeteer';
import { logger } from '../lib/logger';
import { createArticleArrayFromObject } from '../utils/functions';
import { ScraperPageData } from '../Types/type';

export default async function scrapeOne() {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.one.co.il/', { waitUntil: 'networkidle0' });

    //Get list of secondary articles from One
    //Todo: change to promise all
    const mainStory = await page.evaluate((): ScraperPageData => {
      const title = [document.querySelector('#top-article h1 a')?.textContent || ''];
      const urlSlug = document.querySelector('#top-article a.top-article-subtitle')?.getAttribute('href') || '';
      const url = [`https://www.one.co.il${urlSlug}`];
      const body = [document.querySelector('#top-article .top-article-subtitle')?.textContent || ''];

      return { title, url, body };
    });

    //Get list of secondary articles from One
    const articleList = await page.evaluate((): ScraperPageData => {
      const getTextFromElements = (selector: string) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => element.textContent?.trim() || '');
      };
      const oneUrl = 'https://www.one.co.il';
      const title = getTextFromElements('.one-secondaries-articles .one-article-secondary h2');
      const body = getTextFromElements('.one-secondaries-articles .one-article-secondary h3');
      const getArticleLInk = document.querySelectorAll('.one-secondaries-articles a.one-article-secondary ');
      const slugs = [...getArticleLInk].map((e) => e.getAttribute('href')) as string[];
      const url = slugs.map((slug) => (slug.includes(oneUrl) ? slug : `${oneUrl}${slug}`));

      return { title, url, body };
    });

    // Close the browser
    await browser.close();

    // format the article data structure - so each story will be his on array
    const article = createArticleArrayFromObject(articleList, 'One');
    const mainArticle = createArticleArrayFromObject(mainStory, 'One');

    return { article, mainArticle };
  } catch (error) {
    logger.error('[scraper: One]: ', error);
  }
}
