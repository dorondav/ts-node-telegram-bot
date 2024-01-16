type Article = {
  id: string;
  title: string;
  url: string;
  date: Date;
  source:string;
};

type WallaArticles = Article & {
  smallTitle: string;
  body?: string;
};

type WallaPageData = {
  title: string[];
  smallTitle: string[];
  url: string[];
  body?: string[];
};

export { Article, WallaArticles, WallaPageData };
