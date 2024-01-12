type Article = {
  id: string;
  title: string;
  url: string;
  date: Date;
};

type WallaArticles = Article & {
  smallTitle: string;
};
type WallaPageData = {
  title: string[];
  smallTitle: string[];
  url: string[];
};
export { Article, WallaArticles, WallaPageData };
