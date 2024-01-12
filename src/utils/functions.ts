import { v4 as uuidv4 } from 'uuid';
import { WallaArticles, WallaPageData } from '../Types/type';
const combineObjectArrays = (obj: WallaPageData) => {
  const date = new Date();
  const id = uuidv4();
  const articles = [];
  const array = Object.values(obj);
  for (let index = 0; index < array.length; index++) {
    // articles.push(array.map((item) => item[index]));
    const articleItems = array.map((item) => item[index]);
    const articleObj:WallaArticles = {
      title: articleItems[0],
      smallTitle: articleItems[1],
      url: articleItems[2],
      id: id,
      date: date,
    };
    articles.push(articleObj);
  }

  return articles;
};

export { combineObjectArrays };
