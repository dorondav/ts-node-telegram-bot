import { v4 as uuidv4 } from 'uuid';
import { Context } from 'grammy';

import { WallaArticles, WallaPageData, Article, ScraperPageData } from '../Types/type';
const createArticleArrayFromObject = (obj: WallaPageData | ScraperPageData, source: string) => {
  const date = new Date();
  const id = uuidv4();
  const articles = [];
  const array = Object.values(obj);

  for (let index = 0; index < array[0].length; index++) {
    const articleItems = array.map((item) => item[index]);
    let articleObj: Article | WallaArticles;
    articleObj = {
      title: articleItems[0],
      url: articleItems[1],
      body: articleItems[2],
      id,
      date,
      source,
    };
    if (source === 'Walla') {
      articleObj = {
        title: articleItems[0],
        smallTitle: articleItems[1],
        url: articleItems[2],
        id,
        date,
        source,
      };

      //Add the article body to the object only if the original object contains him
      articleObj.body = '';
      if (array.length > 3) {
        articleObj.body = articleItems[3];
      }
    }

    articles.push(articleObj);
  }

  return articles;
};

function pushLinksToBot(ctx: Context, stories: Article[]): void {
  stories.forEach((story: Article) => {
    ctx.reply(story['url']);
  });
}
export { createArticleArrayFromObject, pushLinksToBot };
