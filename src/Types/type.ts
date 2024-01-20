type Article = {
  id: string;
  title: string;
  body?: string;
  url: string;
  date: Date;
  source: string;
};
type ScraperPageData = {
  title: string[];
  url: string[];
  body?: string[];
};

type WallaArticles = Article & {
  smallTitle: string;
};

type WallaPageData = ScraperPageData & {
  smallTitle: string[];
};

export { Article, WallaArticles, WallaPageData, ScraperPageData };
